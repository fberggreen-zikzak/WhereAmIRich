import { FEATURED_CITIES, SITE_NAME } from "./site.config.js";
import {
  CITIES,
  DEFAULT_BASE_CITY_ID,
  DEFAULT_SALARY,
  getCityById,
  AMOUNT_SUBLABEL,
  LOCAL_AVERAGE_LABEL,
  searchCities,
  STATUS_LABELS,
} from "./data.js";
import {
  computeResults,
  defaultComparisonIds,
  formatMoney,
  normalizeComparisonIds,
  parseSalaryInput,
  resolveComparisonIds,
  stateFromUrl,
} from "./calc.js";

const CITY_GUIDE_PATHS = Object.fromEntries(
  FEATURED_CITIES.map((c) => [c.id, c.path.replace(/^\//, "")])
);

const els = {
  salaryInput: document.getElementById("salary-input"),
  currencySuffix: document.getElementById("currency-suffix"),
  baseCityPicker: document.getElementById("base-city-picker"),
  baseCityTrigger: document.getElementById("base-city-trigger"),
  baseCityPanel: document.getElementById("base-city-panel"),
  baseCitySearch: document.getElementById("base-city-search"),
  baseCityList: document.getElementById("base-city-list"),
  baseCityFlag: document.getElementById("base-city-flag"),
  baseCityName: document.getElementById("base-city-name"),
  baseCityCountry: document.getElementById("base-city-country"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroSubtitle: document.getElementById("hero-subtitle"),
  compareHighlights: document.getElementById("compare-highlights"),
  compareBest: document.getElementById("compare-best"),
  compareToughest: document.getElementById("compare-toughest"),
  grid: document.getElementById("city-grid"),
  shareFacebook: document.getElementById("share-facebook"),
  shareLinkedIn: document.getElementById("share-linkedin"),
  copyBtn: document.getElementById("copy-link"),
  copyLabel: document.getElementById("copy-label"),
};

const urlState = stateFromUrl(new URLSearchParams(location.search));
let currentSalary = urlState.salary ?? DEFAULT_SALARY;
let currentBaseCityId = urlState.baseCityId ?? DEFAULT_BASE_CITY_ID;
let comparisonCityIds = resolveComparisonIds(
  urlState.comparisonCityIds,
  currentBaseCityId
);

function flagUrl(code) {
  return `https://flagcdn.com/w40/${code}.png`;
}

function citiesAvailableToAdd() {
  const taken = new Set([currentBaseCityId, ...comparisonCityIds]);
  return CITIES.filter((c) => !taken.has(c.id)).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function citiesSearchable() {
  return CITIES.filter((c) => c.id !== currentBaseCityId).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function isDestinationAdded(cityId) {
  return comparisonCityIds.includes(cityId);
}

function updateUrl(salary, baseCityId, destIds) {
  const url = new URL(location.href);
  url.searchParams.set("salary", String(salary));
  url.searchParams.set("city", baseCityId);
  if (destIds.length) {
    url.searchParams.set("dest", destIds.join(","));
  } else {
    url.searchParams.delete("dest");
  }
  history.replaceState(null, "", url);
}

function updateShareMeta(results, salary, base) {
  const sorted = [...results.cities].sort((a, b) => b.equivalent - a.equivalent);
  const richest = sorted[0];
  const poorest = sorted[sorted.length - 1];
  const title =
    richest && poorest && richest.id !== poorest.id
      ? `${richest.name} vs ${poorest.name} — ${SITE_NAME}`
      : `${SITE_NAME} — Salary purchasing power`;
  const desc = `${formatMoney(salary, base.currencyLabel)}/mo in ${base.name} — compare purchasing power in ${results.cities.length} cities (indicative).`;

  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", desc);
}

function renderHero(results, salary) {
  const { base, richest, poorest, betterOffCount, totalCities } = results;
  const pay = formatMoney(salary, base.currencyLabel);

  if (els.heroEyebrow) {
    els.heroEyebrow.textContent = `${pay} in ${base.name} buys you`;
  }

  if (els.heroTitle) {
    if (totalCities === 0) {
      els.heroTitle.innerHTML = `Add cities below to compare from <em class="compare__accent">${base.name}</em>.`;
    } else {
      const bestLabel =
        richest.status === "better"
          ? `Rich in ${richest.name}`
          : `Best in ${richest.name}`;
      const worstLabel =
        poorest.status === "worse"
          ? `Broke in ${poorest.name}`
          : `Toughest in ${poorest.name}`;
      els.heroTitle.innerHTML = `${bestLabel}. <em class="compare__accent">${worstLabel}.</em>`;
    }
  }

  if (els.heroSubtitle) {
    if (totalCities === 0) {
      els.heroSubtitle.textContent = `Add destinations to see where your pay goes furthest.`;
    } else if (betterOffCount === 0) {
      els.heroSubtitle.textContent = `Your salary doesn't stretch further in any of these ${totalCities} cities.`;
    } else if (betterOffCount === 1) {
      els.heroSubtitle.textContent = `Your salary stretches further in 1 of ${totalCities} cities.`;
    } else if (betterOffCount === totalCities) {
      els.heroSubtitle.textContent = `Your salary stretches further in all ${totalCities} cities.`;
    } else {
      els.heroSubtitle.textContent = `Your salary stretches further in ${betterOffCount} of ${totalCities} cities.`;
    }
  }

  if (els.compareHighlights) {
    const show = totalCities > 0;
    els.compareHighlights.hidden = !show;
    if (show && els.compareBest && els.compareToughest) {
      els.compareBest.textContent = richest.name;
      els.compareToughest.textContent = poorest.name;
    }
  }

  if (totalCities > 0) {
    document.title = `${richest.name} vs ${poorest.name} — ${SITE_NAME}`;
  } else {
    document.title = `${SITE_NAME} — Salary purchasing power`;
  }

  updateShareMeta(results, salary, base);
}

function renderCityCard(city, base) {
  const article = document.createElement("article");
  article.className = `city-card city-card--${city.status}`;
  const statusLabel = STATUS_LABELS[city.status];
  const guidePath = CITY_GUIDE_PATHS[city.id];
  const guideLink = guidePath
    ? `<a class="city-card__guide" href="${guidePath}">${city.name} salary guide</a>`
    : "";
  article.setAttribute(
    "aria-label",
    `${city.name}: ${statusLabel}. ${city.amount} per month, ${AMOUNT_SUBLABEL}. ${LOCAL_AVERAGE_LABEL} ${city.averageSalaryLabel} per month. ${city.vsAverageText}. Compared to ${base.name}.`
  );

  article.innerHTML = `
    <div class="city-card__head">
      <div class="city-card__identity">
        <img
          class="city-card__flag"
          src="${flagUrl(city.countryCode)}"
          alt=""
          width="28"
          height="20"
          loading="lazy"
        />
        <h3 class="city-card__name">${city.name}</h3>
      </div>
      <div class="city-card__actions">
        <span class="city-card__badge">${statusLabel}</span>
        <button type="button" class="city-card__remove" aria-label="Remove ${city.name} from comparison">×</button>
      </div>
    </div>
    <p class="city-card__amount">
      <span class="city-card__amount-value">${city.amount}</span><span class="city-card__period">/mo</span>
    </p>
    <p class="city-card__metric-sub">${AMOUNT_SUBLABEL}</p>
    <div class="city-card__foot">
      <p class="city-card__benchmark-label">${LOCAL_AVERAGE_LABEL}</p>
      <p class="city-card__benchmark-value">
        <span class="city-card__benchmark-amount">${city.averageSalaryLabel}</span><span class="city-card__period">/mo</span>
      </p>
      <p class="city-card__delta city-card__delta--${city.vsAverageTone}">${city.vsAverageText}</p>
      ${guideLink}
    </div>
  `;

  article.querySelector(".city-card__remove")?.addEventListener("click", () => {
    removeDestination(city.id);
  });

  return article;
}

function renderAddTile() {
  const article = document.createElement("article");
  article.className = "city-card city-card--add";
  const available = citiesAvailableToAdd();
  const listId = "add-city-list";

  article.setAttribute("aria-label", "Add a destination city");
  article.innerHTML = `
    <div class="add-city__icon" aria-hidden="true">+</div>
    <h3 class="add-city__title">Add destination</h3>
    <p class="add-city__hint">Search for a city to compare</p>
    <div class="add-city__field">
      <label class="visually-hidden" for="add-city-search">Search for a destination</label>
      <input
        id="add-city-search"
        class="add-city__search"
        type="search"
        placeholder="e.g. Milan, Seoul, Mumbai…"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        role="combobox"
        aria-expanded="false"
        aria-controls="${listId}"
        aria-autocomplete="list"
        ${available.length ? "" : "disabled"}
      />
      <ul id="${listId}" class="add-city__list" role="listbox" hidden></ul>
    </div>
    ${available.length ? "" : '<p class="add-city__empty">All cities are already on the board.</p>'}
  `;

  if (!available.length) return article;

  const search = article.querySelector("#add-city-search");
  const list = article.querySelector(`#${listId}`);

  function renderList(query = "") {
    const matches = searchCities(citiesSearchable(), query).sort((a, b) => {
      const aAdded = isDestinationAdded(a.id);
      const bAdded = isDestinationAdded(b.id);
      if (aAdded !== bAdded) return aAdded ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    list.replaceChildren();
    if (!matches.length) {
      list.hidden = true;
      search.setAttribute("aria-expanded", "false");
      return;
    }

    matches.slice(0, 12).forEach((city) => {
      const added = isDestinationAdded(city.id);
      const li = document.createElement("li");
      li.className = `add-city__option${added ? " add-city__option--added" : ""}`;
      li.setAttribute("role", "option");
      li.dataset.cityId = city.id;
      if (added) {
        li.setAttribute("aria-disabled", "true");
      }
      li.innerHTML = `
        <img class="add-city__flag" src="${flagUrl(city.countryCode)}" alt="" width="20" height="14" />
        <span class="add-city__label">
          <span class="add-city__name">${city.name}</span>
          <span class="add-city__country">${city.country}</span>
        </span>
        ${added ? '<span class="add-city__tag">Already added</span>' : ""}
      `;
      if (!added) {
        li.addEventListener("click", () => addDestination(city.id));
      }
      list.appendChild(li);
    });

    list.hidden = false;
    search.setAttribute("aria-expanded", "true");
  }

  search.addEventListener("focus", () => renderList(search.value));
  search.addEventListener("input", () => renderList(search.value));

  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      list.hidden = true;
      search.setAttribute("aria-expanded", "false");
      search.blur();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const first = list.querySelector(
        ".add-city__option:not(.add-city__option--added)"
      );
      if (first?.dataset.cityId) addDestination(first.dataset.cityId);
    }
  });

  document.addEventListener(
    "click",
    (e) => {
      if (!article.contains(e.target)) {
        list.hidden = true;
        search.setAttribute("aria-expanded", "false");
      }
    },
    { capture: true }
  );

  return article;
}

function addDestination(cityId) {
  if (!getCityById(cityId) || cityId === currentBaseCityId) return;
  if (comparisonCityIds.includes(cityId)) return;
  comparisonCityIds = [...comparisonCityIds, cityId];
  applyState(currentSalary, currentBaseCityId);
}

function removeDestination(cityId) {
  if (!comparisonCityIds.includes(cityId)) return;
  comparisonCityIds = comparisonCityIds.filter((id) => id !== cityId);
  applyState(currentSalary, currentBaseCityId);
}

function renderGrid(results) {
  if (!els.grid) return;
  els.grid.replaceChildren();

  [...results.cities]
    .sort((a, b) => b.equivalent - a.equivalent)
    .forEach((city) => {
      els.grid.appendChild(renderCityCard(city, results.base));
    });

  els.grid.appendChild(renderAddTile());
}

function syncCurrencyUi(baseCity) {
  if (els.currencySuffix) {
    els.currencySuffix.textContent = baseCity.currencyLabel;
  }
}

function applyState(salary, baseCityId) {
  const base = getCityById(baseCityId) ?? getCityById(DEFAULT_BASE_CITY_ID);
  if (!base) return;

  currentSalary = salary;
  currentBaseCityId = base.id;
  comparisonCityIds = normalizeComparisonIds(comparisonCityIds, base.id);

  const results = computeResults(
    CITIES,
    salary,
    base.id,
    comparisonCityIds
  );

  if (els.salaryInput) {
    els.salaryInput.value = salary.toLocaleString("en-US");
  }
  updateBaseCityPickerDisplay(base);
  syncCurrencyUi(base);
  renderHero(results, salary);
  renderGrid(results);
  updateUrl(salary, base.id, comparisonCityIds);
}

function updateBaseCityPickerDisplay(city) {
  if (!city) return;
  if (els.baseCityFlag) {
    els.baseCityFlag.src = flagUrl(city.countryCode);
  }
  if (els.baseCityName) {
    els.baseCityName.textContent = city.name;
  }
  if (els.baseCityCountry) {
    els.baseCityCountry.textContent = city.country;
  }
}

let pickerBackdrop = null;

function ensurePickerBackdrop() {
  if (pickerBackdrop) return pickerBackdrop;
  pickerBackdrop = document.createElement("button");
  pickerBackdrop.type = "button";
  pickerBackdrop.className = "picker-backdrop";
  pickerBackdrop.hidden = true;
  pickerBackdrop.setAttribute("aria-label", "Close city list");
  pickerBackdrop.addEventListener("click", () => closeBaseCityPicker());
  document.body.appendChild(pickerBackdrop);
  return pickerBackdrop;
}

function setBaseCityPickerOpen(open) {
  if (!els.baseCityPanel || !els.baseCityTrigger) return;
  els.baseCityPanel.hidden = !open;
  els.baseCityTrigger.setAttribute("aria-expanded", String(open));
  if (els.baseCitySearch) {
    els.baseCitySearch.setAttribute("aria-expanded", String(open));
  }
  els.baseCityPicker?.classList.toggle("base-city-picker--open", open);
  document.body.classList.toggle("picker-open", open);
  const backdrop = ensurePickerBackdrop();
  backdrop.hidden = !open;
}

function renderBaseCityList(query = "") {
  if (!els.baseCityList || !els.baseCitySearch) return;

  const matches = searchCities(CITIES, query).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  els.baseCityList.replaceChildren();

  matches.forEach((city) => {
    const selected = city.id === currentBaseCityId;
    const li = document.createElement("li");
    li.className = `base-city-picker__option${selected ? " base-city-picker__option--selected" : ""}`;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", String(selected));
    li.dataset.cityId = city.id;
    li.innerHTML = `
      <img class="base-city-picker__option-flag" src="${flagUrl(city.countryCode)}" alt="" width="20" height="14" />
      <span class="base-city-picker__option-label">
        <span class="base-city-picker__option-name">${city.name}</span>
        <span class="base-city-picker__option-country">${city.country}</span>
      </span>
      ${selected ? '<span class="base-city-picker__check" aria-hidden="true">✓</span>' : ""}
    `;
    li.addEventListener("click", () => selectBaseCity(city.id));
    els.baseCityList.appendChild(li);
  });
}

function selectBaseCity(cityId) {
  if (!getCityById(cityId) || cityId === currentBaseCityId) {
    closeBaseCityPicker();
    return;
  }

  comparisonCityIds = normalizeComparisonIds(comparisonCityIds, cityId);
  if (!comparisonCityIds.length) {
    comparisonCityIds = defaultComparisonIds(cityId);
  }
  if (els.baseCitySearch) {
    els.baseCitySearch.value = "";
  }
  closeBaseCityPicker();
  applyState(currentSalary, cityId);
}

function openBaseCityPicker() {
  setBaseCityPickerOpen(true);
  renderBaseCityList(els.baseCitySearch?.value ?? "");
  requestAnimationFrame(() => {
    els.baseCitySearch?.focus({ preventScroll: true });
  });
}

function closeBaseCityPicker() {
  setBaseCityPickerOpen(false);
  if (els.baseCitySearch) {
    els.baseCitySearch.value = "";
  }
}

function initBaseCityPicker() {
  if (!els.baseCityPicker) return;

  const base = getCityById(currentBaseCityId);
  if (base) {
    updateBaseCityPickerDisplay(base);
  }

  els.baseCityTrigger?.addEventListener("click", () => {
    if (els.baseCityPanel?.hidden) {
      openBaseCityPicker();
    } else {
      closeBaseCityPicker();
    }
  });

  els.baseCitySearch?.addEventListener("input", () => {
    renderBaseCityList(els.baseCitySearch.value);
  });

  els.baseCitySearch?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeBaseCityPicker();
      els.baseCityTrigger?.focus();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const first = els.baseCityList?.querySelector(".base-city-picker__option");
      if (first?.dataset.cityId) {
        selectBaseCity(first.dataset.cityId);
      }
    }
  });

  document.addEventListener(
    "click",
    (e) => {
      if (!els.baseCityPicker?.contains(e.target)) {
        closeBaseCityPicker();
      }
    },
    { capture: true }
  );
}

function initCalculator() {
  if (!els.salaryInput) return;

  els.salaryInput.addEventListener("input", () => {
    const parsed = parseSalaryInput(els.salaryInput.value);
    if (parsed === null) return;
    applyState(parsed, currentBaseCityId);
  });

  els.salaryInput.addEventListener("blur", () => {
    const parsed = parseSalaryInput(els.salaryInput.value) ?? DEFAULT_SALARY;
    applyState(parsed, currentBaseCityId);
  });
}

function getShareUrl() {
  const { origin, pathname, search } = location;
  return `${origin}${pathname}${search}`;
}

function openSharePopup(shareUrl) {
  window.open(
    shareUrl,
    "_blank",
    "noopener,noreferrer,width=600,height=640"
  );
}

function shareOnFacebook() {
  const url = encodeURIComponent(getShareUrl());
  openSharePopup(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`
  );
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(getShareUrl());
  openSharePopup(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  );
}

async function copyShareLink() {
  const url = getShareUrl();
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      /* fall through */
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

function flashCopyLabel(message, resetMs = 2000) {
  if (!els.copyLabel) return;
  els.copyLabel.textContent = message;
  setTimeout(() => {
    els.copyLabel.textContent = "Copy link";
  }, resetMs);
}

function initShare() {
  els.shareFacebook?.addEventListener("click", shareOnFacebook);
  els.shareLinkedIn?.addEventListener("click", shareOnLinkedIn);

  els.copyBtn?.addEventListener("click", async () => {
    const ok = await copyShareLink();
    flashCopyLabel(ok ? "Copied!" : "Could not copy");
  });
}

initBaseCityPicker();
initCalculator();
initShare();
applyState(currentSalary, currentBaseCityId);

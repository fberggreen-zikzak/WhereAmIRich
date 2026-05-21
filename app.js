import {
  CITIES,
  citiesForSelect,
  DEFAULT_BASE_CITY_ID,
  DEFAULT_SALARY,
  getCityById,
  HERO_TRUST_LINE,
  METRIC_LABEL,
  metricHint,
  STATUS_CONTEXT,
  STATUS_LABELS,
} from "./data.js";
import {
  computeResults,
  formatMoney,
  parseSalaryInput,
  stateFromUrl,
} from "./calc.js";

const els = {
  salaryInput: document.getElementById("salary-input"),
  currencySuffix: document.getElementById("currency-suffix"),
  baseCitySelect: document.getElementById("base-city"),
  citySearch: document.getElementById("city-search"),
  calculatorHint: document.getElementById("calculator-hint"),
  resultsLegend: document.getElementById("results-legend"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroTrust: document.getElementById("hero-trust"),
  heroSubtitle: document.getElementById("hero-subtitle"),
  grid: document.getElementById("city-grid"),
  copyBtn: document.getElementById("copy-link"),
  copyLabel: document.getElementById("copy-label"),
};

const urlState = stateFromUrl(new URLSearchParams(location.search));
let currentSalary = urlState.salary ?? DEFAULT_SALARY;
let currentBaseCityId = urlState.baseCityId ?? DEFAULT_BASE_CITY_ID;

function flagUrl(code) {
  return `https://flagcdn.com/w40/${code}.png`;
}

function updateUrl(salary, baseCityId) {
  const url = new URL(location.href);
  url.searchParams.set("salary", String(salary));
  url.searchParams.set("city", baseCityId);
  history.replaceState(null, "", url);
}

function renderHero(results, salary) {
  const { base, richest, poorest, betterOffCount, totalCities } = results;
  const pay = formatMoney(salary, base.currencyLabel);

  if (els.heroEyebrow) {
    els.heroEyebrow.textContent = `Your salary of ${pay} in ${base.name} is equivalent to`;
  }

  if (els.heroTitle) {
    els.heroTitle.innerHTML = `Rich in ${richest.name}. <em class="hero__accent">Poor in ${poorest.name}.</em>`;
  }

  if (els.heroTrust) {
    els.heroTrust.textContent = HERO_TRUST_LINE;
  }

  if (els.heroSubtitle) {
    if (betterOffCount === 0) {
      els.heroSubtitle.textContent = `Compared to ${base.name}, your pay stretches least in these cities`;
    } else if (betterOffCount === totalCities) {
      const noun = totalCities === 1 ? "city" : "cities";
      els.heroSubtitle.textContent = `Your money goes further in all ${totalCities} other ${noun} than in ${base.name}`;
    } else {
      const noun = betterOffCount === 1 ? "city" : "cities";
      els.heroSubtitle.textContent = `Your money goes further in ${betterOffCount} of ${totalCities} other ${noun} than in ${base.name}`;
    }
  }

  document.title = `Rich in ${richest.name}, poor in ${poorest.name} — Rich or Poor`;
}

function updateResultsLegend(results) {
  if (!els.resultsLegend) return;
  const { base, cities } = results;
  const names = cities.map((c) => c.name).join(", ");
  els.resultsLegend.innerHTML = `<strong>Equivalent salary</strong> — what you’d need to earn there monthly to live like you do in ${base.name}. Shown in ${base.currencyLabel}. Compared to: ${names}.`;
}

function renderCityCard(city, currencyLabel) {
  const article = document.createElement("article");
  article.className = `city-card city-card--${city.status}`;
  const statusLabel = STATUS_LABELS[city.status];
  const statusNote = STATUS_CONTEXT[city.status];
  const hint = metricHint(currencyLabel);

  article.setAttribute(
    "aria-label",
    `${city.name}: ${statusLabel}, ${statusNote}. ${METRIC_LABEL} ${city.amount}`
  );

  article.innerHTML = `
    <div class="city-card__top">
      <div class="city-card__meta">
        <p class="city-card__name">${city.name}</p>
        <img
          class="city-card__flag"
          src="${flagUrl(city.countryCode)}"
          alt=""
          width="28"
          height="20"
          loading="lazy"
        />
      </div>
      <div class="city-card__badge-wrap">
        <span class="city-card__badge" title="${statusNote}">${statusLabel}</span>
        <span class="city-card__status-note">${statusNote}</span>
      </div>
    </div>
    <div class="city-card__figure">
      <span class="city-card__metric" title="${hint}">${METRIC_LABEL}</span>
      <p class="city-card__amount">${city.amount}</p>
    </div>
    <div class="city-card__bar" role="presentation" aria-hidden="true">
      <span class="city-card__bar-fill" style="width: 0%"></span>
    </div>
  `;

  requestAnimationFrame(() => {
    const fill = article.querySelector(".city-card__bar-fill");
    if (fill) fill.style.width = `${city.progress}%`;
  });

  return article;
}

function renderGrid(results) {
  if (!els.grid) return;
  els.grid.replaceChildren();
  [...results.cities]
    .sort((a, b) => b.equivalent - a.equivalent)
    .forEach((city) => {
      els.grid.appendChild(renderCityCard(city, results.base.currencyLabel));
    });
}

function syncCurrencyUi(baseCity) {
  if (els.currencySuffix) {
    els.currencySuffix.textContent = baseCity.currencyLabel;
  }
  if (els.calculatorHint) {
    els.calculatorHint.textContent = `Enter your pay in ${baseCity.name} — we compare how far it goes in ${CITIES.length - 1} other cities (Numbeo, May 2025).`;
  }
}

function applyState(salary, baseCityId) {
  const base = getCityById(baseCityId);
  if (!base) return;

  currentSalary = salary;
  currentBaseCityId = baseCityId;
  const results = computeResults(CITIES, salary, baseCityId);

  if (els.salaryInput) {
    els.salaryInput.value = salary.toLocaleString("en-US");
  }
  if (els.baseCitySelect) {
    els.baseCitySelect.value = baseCityId;
  }
  if (els.citySearch) {
    els.citySearch.value = "";
    filterCityOptions("");
  }

  syncCurrencyUi(base);
  renderHero(results, salary);
  updateResultsLegend(results);
  renderGrid(results);
  updateUrl(salary, baseCityId);
}

function filterCityOptions(query) {
  if (!els.baseCitySelect) return;
  const q = query.trim().toLowerCase();
  [...els.baseCitySelect.options].forEach((opt) => {
    opt.hidden = Boolean(q && !opt.textContent.toLowerCase().includes(q));
  });
}

function initBaseCitySelect() {
  if (!els.baseCitySelect) return;

  els.baseCitySelect.replaceChildren();
  citiesForSelect().forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city.id;
    opt.textContent = city.name;
    els.baseCitySelect.appendChild(opt);
  });

  els.baseCitySelect.addEventListener("change", () => {
    applyState(currentSalary, els.baseCitySelect.value);
  });
}

function initCitySearch() {
  if (!els.citySearch || !els.baseCitySelect) return;

  els.citySearch.addEventListener("input", () => {
    filterCityOptions(els.citySearch.value);
  });

  els.citySearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyState(currentSalary, els.baseCitySelect.value);
      els.citySearch.blur();
    }
  });
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

function initShare() {
  if (!els.copyBtn || !els.copyLabel) return;

  els.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      els.copyLabel.textContent = "Copied!";
      setTimeout(() => {
        els.copyLabel.textContent = "Copy link";
      }, 2000);
    } catch {
      els.copyLabel.textContent = "Could not copy";
      setTimeout(() => {
        els.copyLabel.textContent = "Copy link";
      }, 2000);
    }
  });
}

initBaseCitySelect();
initCitySearch();
initCalculator();
initShare();
applyState(currentSalary, currentBaseCityId);

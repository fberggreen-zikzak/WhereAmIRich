/**
 * Cookie consent — loads Google Analytics and AdSense only after "Accept all".
 * Preference: localStorage key wair-consent = "all" | "essential"
 */
(function () {
  const STORAGE_KEY = "wair-consent";
  const root = document.documentElement;
  const gaId = root.dataset.gaId || "";
  const adsenseClient = root.dataset.adsenseClient || "";

  function loadScript(src, crossOrigin) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.async = true;
      s.src = src;
      if (crossOrigin) s.crossOrigin = crossOrigin;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  function initAdSlots() {
    document.querySelectorAll(".ad-slot").forEach((slot) => {
      slot.hidden = false;
    });
    document.querySelectorAll(".adsbygoogle").forEach(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* AdSense not ready */
      }
    });
  }

  async function loadAnalytics() {
    if (gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag =
        window.gtag ||
        function gtag() {
          window.dataLayer.push(arguments);
        };
      try {
        await loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
        window.gtag("js", new Date());
        window.gtag("config", gaId);
      } catch {
        /* ignore */
      }
    }
    if (adsenseClient) {
      try {
        await loadScript(
          `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`,
          "anonymous"
        );
        initAdSlots();
      } catch {
        /* ignore */
      }
    }
  }

  function hideBanner() {
    document.getElementById("consent-banner")?.remove();
  }

  function showBanner() {
    if (document.getElementById("consent-banner")) return;

    const privacyHref =
      document.querySelector('a[href*="privacy.html"]')?.getAttribute("href") || "privacy.html";

    const banner = document.createElement("div");
    banner.id = "consent-banner";
    banner.className = "consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `
      <p class="consent-banner__text">
        We use cookies for analytics and ads to keep ${root.dataset.siteName || "this site"} free.
        <a href="${privacyHref}">Privacy policy</a>
      </p>
      <div class="consent-banner__actions">
        <button type="button" class="consent-banner__btn consent-banner__btn--secondary" data-consent="essential">
          Essential only
        </button>
        <button type="button" class="consent-banner__btn consent-banner__btn--primary" data-consent="all">
          Accept all
        </button>
      </div>`;

    banner.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-consent]");
      if (!btn) return;
      const value = btn.getAttribute("data-consent");
      localStorage.setItem(STORAGE_KEY, value);
      hideBanner();
      if (value === "all") loadAnalytics();
    });

    document.body.appendChild(banner);
  }

  const choice = localStorage.getItem(STORAGE_KEY);
  if (choice === "all") {
    loadAnalytics();
    return;
  }
  if (choice === "essential") return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();

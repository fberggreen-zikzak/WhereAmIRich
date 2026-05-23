/**
 * Cloudflare Worker — dynamic Open Graph HTML for calculator share URLs.
 *
 * Deploy on www.whereamirich.com (or a share subdomain) with share-data.json
 * uploaded as a Worker asset or bound KV key "share-data".
 *
 * Bots hitting /index.html?city=…&salary=… get minimal HTML with OG tags;
 * humans are redirected to the calculator. Static /share/*.html presets still
 * work without this worker.
 */
const BOT =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Pinterest|Googlebot/i;

/** @param {Record<string, unknown>} data */
function getCity(data, id) {
  return data.cities?.find((c) => c.id === id);
}

/** @param {Record<string, unknown>} data */
function defaultDestIds(data, baseId) {
  const preset = data.defaultComparisonIds ?? [];
  return preset.filter((id) => id !== baseId).slice(0, 8);
}

function factor(fromIndex, toIndex) {
  return Math.round((fromIndex / toIndex) * 1000) / 1000;
}

/** @param {Record<string, unknown>} data */
function buildHook(data, cityId, salary) {
  const base = getCity(data, cityId) ?? getCity(data, "new-york");
  if (!base) {
    return {
      title: `${data.siteName} — Salary purchasing power`,
      description: "Compare your monthly salary to 100+ cities — indicative purchasing power calculator.",
    };
  }

  const destIds = defaultDestIds(data, base.id);
  const dests = destIds.map((id) => getCity(data, id)).filter(Boolean);
  if (!dests.length) {
    return {
      title: `${data.siteName} — ${base.name}`,
      description: `See purchasing power from a ${base.name}-based salary.`,
    };
  }

  let richest = dests[0];
  let poorest = dests[0];
  let maxFactor = 0;
  let minFactor = Infinity;
  for (const d of dests) {
    const f = factor(base.numbeoColIndex, d.numbeoColIndex);
    if (f > maxFactor) {
      maxFactor = f;
      richest = d;
    }
    if (f < minFactor) {
      minFactor = f;
      poorest = d;
    }
  }

  const pay = `${salary.toLocaleString("en-US")} ${base.currencyLabel}`.trim();
  return {
    title: `${richest.name} vs ${poorest.name} — ${data.siteName}`,
    description: `${pay}/mo in ${base.name} — indicative purchasing power across ${dests.length} destinations.`,
  };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {{ title: string; description: string; url: string; data: Record<string, unknown> }} opts */
function ogHtml({ title, description, url, data }) {
  const image = data.ogImage ?? "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="${escapeHtml(data.siteName ?? "WhereAmIRich.com")}"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:image" content="${escapeHtml(image)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${escapeHtml(image)}"/>
<meta http-equiv="refresh" content="0;url=${escapeHtml(url)}"/>
</head>
<body><p><a href="${escapeHtml(url)}">Open calculator</a></p></body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") ?? "";

    if (!BOT.test(ua)) {
      return fetch(request);
    }

    const isCalc =
      (url.pathname === "/" || url.pathname.endsWith("/index.html")) &&
      url.searchParams.has("city");

    if (!isCalc) {
      return fetch(request);
    }

    let data;
    try {
      if (env.SHARE_DATA) {
        data = JSON.parse(env.SHARE_DATA);
      } else if (env.SHARE_KV) {
        const raw = await env.SHARE_KV.get("share-data");
        data = raw ? JSON.parse(raw) : null;
      } else {
        const asset = await env.ASSETS.fetch(new URL("/share-data.json", url.origin));
        data = asset.ok ? await asset.json() : null;
      }
    } catch {
      return fetch(request);
    }

    if (!data) return fetch(request);

    const cityId = url.searchParams.get("city") ?? "new-york";
    const salary = Number(url.searchParams.get("salary")) || data.defaultSalary || 6200;
    const hook = buildHook(data, cityId, salary);
    const canonical = `${data.siteUrl}${url.pathname}${url.search}`;

    return new Response(ogHtml({ ...hook, url: canonical, data }), {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "cache-control": "public, max-age=3600",
      },
    });
  },
};

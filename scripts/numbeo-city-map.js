/**
 * Manual Numbeo label overrides for catalog cities that do not auto-match.
 * Keys are catalog city ids; values are exact Numbeo table labels.
 *
 * @see scripts/refresh-numbeo-indices.js
 */
export const NUMBEO_NAME_OVERRIDES = {
  "new-york": "New York, NY, United States",
  "san-francisco": "San Francisco, CA, United States",
  "los-angeles": "Los Angeles, CA, United States",
  "chicago": "Chicago, IL, United States",
  "boston": "Boston, MA, United States",
  "washington-dc": "Washington, DC, United States",
  "seattle": "Seattle, WA, United States",
  "miami": "Miami, FL, United States",
  "philadelphia": "Philadelphia, PA, United States",
  "atlanta": "Atlanta, GA, United States",
  "san-diego": "San Diego, CA, United States",
  "portland": "Portland, OR, United States",
  "las-vegas": "Las Vegas, NV, United States",
  "honolulu": "Honolulu, HI, United States",
  "austin": "Austin, TX, United States",
  "denver": "Denver, CO, United States",
  "houston": "Houston, TX, United States",
  krakow: "Krakow (Cracow), Poland",
  seville: "Seville (Sevilla), Spain",
  kyiv: "Kiev (Kyiv), Ukraine",
  "tel-aviv": "Tel Aviv-Yafo, Israel",
  "san-jose-cr": "San Jose, Costa Rica",
  jeddah: "Jeddah (Jiddah), Saudi Arabia",
  cairo: "Cairo, Egypt",
  "sao-paulo": "Sao Paulo, Brazil",
  bogota: "Bogota, Colombia",
  medellin: "Medellin, Colombia",
  cancun: "Cancun, Mexico",
  poznan: "Poznan, Poland",
  "ho-chi-minh-city": "Ho Chi Minh City, Vietnam",
  sarajevo: "Sarajevo, Bosnia And Herzegovina",
  dubai: "Dubai, United Arab Emirates",
  "abu-dhabi": "Abu Dhabi, United Arab Emirates",
  "hong-kong": "Hong Kong, Hong Kong (China)",
};

/** Alternate country strings Numbeo uses vs our catalog. */
export const NUMBEO_COUNTRY_ALIASES = {
  uae: "united arab emirates",
  "hong kong": "hong kong (china)",
  "hong kong (china)": "hong kong",
  "bosnia and herzegovina": "bosnia and herzegovina",
  "czech republic": "czechia",
  czechia: "czech republic",
  "south korea": "korea, south",
  turkey: "turkiye",
  turkiye: "turkey",
};

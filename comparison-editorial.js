/**
 * Extended editorial copy for head-to-head comparison pages.
 * @typedef {{ heading: string; paragraphs: string[] }} ComparisonSection
 * @typedef {{ sections: ComparisonSection[]; scenarios: { label: string; salary: number; fromCityId: string }[] }} ComparisonEditorial
 */

/** @type {Record<string, ComparisonEditorial>} */
export const COMPARISON_CONTENT = {
  "london-vs-lisbon": {
    sections: [
      {
        heading: "Who this comparison is for",
        paragraphs: [
          "London vs Lisbon is the archetypal remote-work trade-off: keep a UK or international salary tied to London, move to Portugal for lifestyle and lower everyday costs — or reverse the move and understand why Lisbon pay feels tight in the capital.",
          "Use this page if you are weighing an EU base, comparing job offers in both cities, or explaining to family why the same number on paper buys different lifestyles.",
        ],
      },
      {
        heading: "Housing (not in the Numbeo basket)",
        paragraphs: [
          "London rent in zones 1–3 often dwarfs Lisbon’s central prices in absolute terms, but Lisbon’s market tightened sharply after 2020. A one-bedroom in Lisbon might still save £400–£800/month vs comparable London areas — yet that gap is narrower than the goods-only COL factor suggests.",
          "Always check current listings: our calculator’s purchasing-power factor uses Numbeo’s basket excluding rent. Add housing research before signing a lease in either city.",
        ],
      },
      {
        heading: "Tax, visa, and payroll caveats",
        paragraphs: [
          "UK income tax and National Insurance reduce London take-home pay. Portugal has its own progressive rates and historically offered special regimes for new residents — rules change; consult a tax adviser for your residency timeline.",
          "Brexit ended automatic UK EU freedom of movement. British citizens in Portugal and Portuguese workers in the UK need valid visas. None of that appears in our indices.",
        ],
      },
      {
        heading: "Lifestyle beyond the index",
        paragraphs: [
          "Lisbon offers milder winters and shorter commutes for many; London offers deeper job markets and global flight connections. Healthcare access differs (NHS vs SNS). Childcare and international schools can invert a spreadsheet advantage if you need English-language education in Lisbon.",
          "The Numbeo basket reflects average consumption — your wine habit, ski trips, or minimalist street-food diet will not match the median.",
        ],
      },
    ],
    scenarios: [
      { label: "Mid-level professional", salary: 4500, fromCityId: "london" },
      { label: "Senior remote worker", salary: 7000, fromCityId: "london" },
      { label: "Local Lisbon earner", salary: 1800, fromCityId: "lisbon" },
    ],
  },

  "new-york-vs-london": {
    sections: [
      {
        heading: "Who this comparison is for",
        paragraphs: [
          "New York and London compete for finance, media, and tech talent with similarly loud salary headlines and similarly expensive daily life. This pairing suits US–UK transferees, dual citizens, and anyone choosing between offers on either side of the Atlantic.",
          "Indices alone miss healthcare: US employer-sponsored insurance vs NHS access for residents is a major non-COL difference.",
        ],
      },
      {
        heading: "Housing (not in the Numbeo basket)",
        paragraphs: [
          "Manhattan and inner London both punish renters; Brooklyn and outer boroughs soften New York averages, as do zones 3–4 in London. Neither market is cheap in global terms.",
          "Because rent is excluded from our factor, small COL index gaps between the two cities understate how similar total budgets can feel once housing is included.",
        ],
      },
      {
        heading: "Tax, visa, and payroll caveats",
        paragraphs: [
          "US citizens owe US tax on worldwide income; UK residents pay HMRC. Double-tax treaties exist but compliance is non-trivial. State and city taxes (especially NYC) add layers London does not have.",
          "Work visas (Skilled Worker, H-1B, L-1, etc.) constrain who can actually earn in either market — the calculator assumes you can legally work and be paid there.",
        ],
      },
      {
        heading: "Lifestyle beyond the index",
        paragraphs: [
          "London’s paid vacation norms and US at-will employment differ culturally. Transport: car-free Manhattan vs Oyster card London both work; suburban life assumes different costs.",
          "Tipping culture in New York restaurants increases effective dining costs vs VAT-inclusive London menus where service is usually included.",
        ],
      },
    ],
    scenarios: [
      { label: "Finance analyst", salary: 9000, fromCityId: "new-york" },
      { label: "Media / tech role", salary: 6500, fromCityId: "london" },
      { label: "Dual-offer comparison", salary: 12000, fromCityId: "new-york" },
    ],
  },

  "dubai-vs-bangkok": {
    sections: [
      {
        heading: "Who this comparison is for",
        paragraphs: [
          "Dubai vs Bangkok contrasts a tax-marketed Gulf hub with Southeast Asia’s longstanding expat favorite. Typical users include regional managers, remote workers choosing a base, and contractors comparing packages that include housing allowances.",
          "The COL gap is large on paper; tax treatment and visa stability often decide the winner more than coffee prices.",
        ],
      },
      {
        heading: "Housing (not in the Numbeo basket)",
        paragraphs: [
          "Dubai rents are quoted annually and cluster in tower districts; Bangkok offers central condos at lower nominal rates with flexible lease terms. School fees in Dubai for families can exceed rent — absent from Numbeo averages.",
          "Bangkok room shares and older apartments remain inexpensive; expat-standard condos cost more but usually stay below comparable Dubai units.",
        ],
      },
      {
        heading: "Tax, visa, and payroll caveats",
        paragraphs: [
          "UAE personal income tax is generally not levied on individuals in the way European countries do; Thailand taxes residents on Thai-sourced and remitted foreign income under evolving rules — professional advice is essential.",
          "Employment visas in both countries tie many workers to sponsors. Pure digital-nomad setups face different constraints in 2025–26 than packaged corporate relocations.",
        ],
      },
      {
        heading: "Lifestyle beyond the index",
        paragraphs: [
          "Bangkok’s street food and nightlife are world-famous and cheap; Dubai emphasizes malls, beaches, and regulated alcohol venues with premium pricing. Climate: Bangkok’s humidity vs Dubai’s summer heat both require AC budgets.",
          "Bangkok factors often show much stronger goods purchasing power than Dubai when Bangkok is home; Dubai may still win for specific career networks or zero-income-tax packages with housing included.",
        ],
      },
    ],
    scenarios: [
      { label: "Regional manager package", salary: 25000, fromCityId: "dubai" },
      { label: "Remote worker (USD)", salary: 6000, fromCityId: "dubai" },
      { label: "Bangkok-based freelancer", salary: 150000, fromCityId: "bangkok" },
    ],
  },
};

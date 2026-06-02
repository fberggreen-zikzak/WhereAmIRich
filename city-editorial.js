/**
 * Hand-written editorial copy for featured city guides.
 * Used by scripts/generate-city-pages.js — not mass-templated boilerplate.
 *
 * @typedef {{ heading: string; paragraphs: string[] }} EditorialSection
 * @typedef {{ overview: string[]; sections: EditorialSection[]; exampleSalary?: number }} CityGuideEditorial
 */

/** @type {Record<string, CityGuideEditorial>} */
export const CITY_GUIDE_CONTENT = {
  london: {
    overview: [
      "London sits in the upper tier of global city costs: strong wages in finance, tech, and professional services, but everyday prices — especially dining out, transport, and services — add up quickly. Our Numbeo index (excluding rent) reflects groceries, restaurants, and local consumption rather than housing alone.",
      "If you are paid in pounds and considering a move abroad, London is often the baseline people compare from. A salary that feels comfortable in Zone 2 can feel dramatically different when the same gross number is evaluated against Lisbon, Bangkok, or Berlin.",
    ],
    sections: [
      {
        heading: "Everyday costs in London",
        paragraphs: [
          "Supermarket shopping in London is broadly in line with other Western European capitals, though premium chains and convenience stores push bills higher in central postcodes. A mid-range restaurant meal for two often runs £50–£80 before drinks; pub lunches and street food can cut that, but regular dining out is a major budget line.",
          "Transport is a fixed cost many Londoners underestimate in COL comparisons. An Travelcard or contactless cap on Zones 1–2 is hundreds of pounds per month. The calculator’s Numbeo basket includes public transport and taxis, but not commuter rail from the Home Counties — worth remembering if you live outside the city proper.",
          "Healthcare is mostly NHS-funded for residents, but private insurance, dental, and optical costs still appear in household budgets. Childcare and school fees are not in the index but can dominate family finances.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Rent is explicitly excluded from our primary Numbeo index. In London, that omission matters: one-bedroom flats in inner boroughs often exceed £1,800–£2,500 per month, and house shares remain expensive by European standards.",
          "Someone earning £3,200 gross per month (a rough local benchmark) may find rent alone consumes half of take-home pay in popular areas. Use the calculator for goods-and-services purchasing power, then research rent separately on Numbeo, SpareRoom, or Rightmove before relocating.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "London salaries vary sharply by sector. Graduate roles in banking or consulting can start above £40k; many creative and nonprofit roles sit closer to national averages. Remote workers paid in London rates while living elsewhere often discover how much location affects real lifestyle — the calculator quantifies that gap using COL indices.",
          "When comparing to local averages in the app, remember figures are approximate gross monthly benchmarks converted with simplified FX. They show whether you are above or below a typical earner in a destination, not a precise job offer.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "London is a common anchor for UK and international remote contracts. Teams negotiating “same salary, work from Portugal” often use Lisbon or Barcelona as destinations — where factors frequently show 1.4×–1.6× spending power from a London base.",
          "Visa and tax rules are not modeled here. A higher purchasing-power factor in another country does not automatically mean higher net disposable income after UK exit charges, double taxation treaties, or local social contributions.",
        ],
      },
    ],
    exampleSalary: 4500,
  },

  "new-york": {
    overview: [
      "New York is our reference city (index ≈ 100): high wages in many sectors, but equally high prices for dining, services, and daily life. Manhattan and Brooklyn dominate the mental image, though Numbeo aggregates city-wide data including outer boroughs where costs soften.",
      "A US salary quoted in dollars often sounds impressive until compared with European or Asian cities on a purchasing-power basis — or until rent and health insurance are layered on top.",
    ],
    sections: [
      {
        heading: "Everyday costs in New York",
        paragraphs: [
          "Groceries in NYC can match or exceed other US metros; bodegas and delivery apps add a premium for convenience. Eating out is a cultural default: casual lunches $15–$25, sit-down dinners $40–$80 per person in Manhattan without wine.",
          "MetroCards, OMNY caps, and occasional rideshares add up. The COL index includes transport, but parking, car ownership, and bridge tolls sit outside a typical basket if you live car-free in the city.",
          "Sales tax appears at checkout (unlike many European VAT-inclusive prices), so sticker shock on electronics and clothing is real for newcomers from abroad.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Rent drives most NYC budget stress. Studio and one-bedroom rents in popular neighborhoods often exceed $3,000–$4,000/month; room shares remain costly. Because rent is excluded from our main index, a destination that looks only slightly cheaper on goods may still win on total cost of living once housing is included.",
          "Remote workers keeping a New York employer while moving to Austin, Lisbon, or Bangkok should run the calculator for daily goods, then model rent locally — the combination tells the full story.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Finance, tech, media, and law still anchor high earners, but median wages across the city are more modest. The calculator’s local average row uses an approximate gross benchmark — useful for “am I above typical here?” not for offer negotiation.",
          "Health insurance premiums and out-of-pocket medical costs are not in the Numbeo basket but can equal a rent payment for families. International comparisons that ignore healthcare understate US living costs.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "New York employers increasingly hire nationally and internationally. A $120k salary might stretch further in Berlin or Barcelona on paper; tax residency, state income tax, and employer geo-pay policies can claw back part of that advantage.",
          "Popular comparison pairs from a New York base include London (similar tier), Lisbon (often much stronger purchasing power on goods), and Bangkok (often 2×+ on the index alone).",
        ],
      },
    ],
    exampleSalary: 8000,
  },

  lisbon: {
    overview: [
      "Lisbon has become one of Europe’s best-known remote-work hubs: Atlantic weather, English-friendly services, and a Numbeo index well below London, Paris, or Berlin. Wages local to Portugal are lower than Northern Europe, but foreign salaries converted into euros often feel generous.",
      "The city’s popularity pushed rents up in Alfama, Príncipe Real, and along the river — yet everyday spending on food, coffee, and local services remains comparatively affordable.",
    ],
    sections: [
      {
        heading: "Everyday costs in Lisbon",
        paragraphs: [
          "Supermarket chains like Continente and Pingo Doce keep grocery bills moderate; Mercado da Ribeira and neighborhood tascas offer inexpensive lunches. A coffee and pastel de nata rarely breaks €3 at a local café; tourist-zone prices run higher.",
          "Public transport (Metro, buses, trams) is cheap by Western standards. Ride-hailing is widely used; the COL index captures typical urban mobility without car ownership, which many central residents skip.",
          "Utilities and mobile plans are reasonable; summer air conditioning and winter heating in older buildings can add seasonal spikes not obvious from a single index number.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Rents rose sharply post-2020 as digital nomads and returning emigrants competed for limited stock. One-bedroom flats in central areas often run €1,200–€1,800; cheaper options exist in Amadora, Almada, or along metro lines with longer commutes.",
          "Our calculator excludes rent from the primary factor. Lisbon often shows strong purchasing power vs London on goods; housing may narrow that gap depending on neighborhood choice.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Local gross salaries sit below Western European averages — roughly €1,400/month is a common benchmark in our dataset. Tech and multinational roles pay more, especially for English-speaking positions, but many remote workers keep employers abroad.",
          "The vs-local-average badge in the app helps answer: “If I earn X from abroad, how does that compare to a typical Lisbon earner?” That is context, not a hiring survey.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Portugal’s D7, digital nomad, and golden visa routes attracted global attention; rules change — verify with official immigration sources. Tax regimes for new residents (e.g. NHR historically) influenced moves but are not modeled here.",
          "From a Lisbon base, London and Paris often show weaker purchasing power on goods (factors below 1×); Bangkok and Kuala Lumpur show much stronger. Many Europeans use Lisbon as a lower-cost EU base while serving UK or US clients.",
        ],
      },
    ],
    exampleSalary: 3500,
  },

  bangkok: {
    overview: [
      "Bangkok offers some of the lowest everyday costs among cities in our catalog: street food, local markets, and affordable services pull the Numbeo index far below Western hubs. Salaries local to Thailand are lower in nominal terms, but foreign remote incomes converted to baht can support a comfortable urban lifestyle.",
      "The city is sprawling; costs differ between central Sukhumvit and outer districts. Numbeo reflects an urban average — luxury malls and expat compounds sit above it, soi life sits below.",
    ],
    sections: [
      {
        heading: "Everyday costs in Bangkok",
        paragraphs: [
          "Food is Bangkok’s famous bargain: pad thai, rice dishes, and market meals often cost 50–80 baht; mid-range restaurants remain cheap by global standards. Western imports and rooftop dining cost more but rarely match London or New York prices.",
          "Grab, BTS/MRT, and motorcycle taxis make car-free living practical. The index includes transport; toll highways and car ownership are optional extras many expats skip.",
          "Healthcare quality varies from excellent private hospitals (not cheap) to affordable clinics. Insurance is common for long-stay foreigners; medical spending is partially reflected in COL surveys but not personalized to your plan.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Central condos with pools and gyms target expats at wide price ranges — from modest studios to luxury penthouses. Rent is excluded from our headline factor; Bangkok often looks extremely favorable on goods alone, and housing can still be reasonable vs Western capitals.",
          "Lease terms, deposits, and agent fees add friction. Short-term furnished units cost more per month than annual contracts.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Local gross salaries in Bangkok are modest in dollar or euro terms. The calculator’s benchmarks help compare a foreign paycheck to typical local earners — many remote workers intentionally optimize for that gap.",
          "Thailand’s job market for international roles concentrates in tech, hospitality management, and teaching; most calculator users here are comparing relocation from Europe or the US, not local job offers.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Bangkok is a long-standing hub for location-independent workers in Southeast Asia. Visa rules evolve — tourist visas, elite visas, and employer-sponsored permits each have constraints not covered on this site.",
          "From Bangkok, London, Singapore, and New York typically show much weaker purchasing power on everyday goods (factors well below 1× when Bangkok is home). Dubai sometimes sits closer depending on lifestyle basket.",
        ],
      },
    ],
    exampleSalary: 120000,
  },

  dubai: {
    overview: [
      "Dubai combines Gulf-region pricing with a large expat population and tax-free salary marketing. Everyday goods can be mid-range globally — imported products cost more — while services and dining span budget cafeterias to luxury hotels.",
      "Because many residents pay no personal income tax, gross-to-net comparisons with London or New York mislead if you only look at COL indices. The calculator shows goods-and-services purchasing power, not after-tax wealth.",
    ],
    sections: [
      {
        heading: "Everyday costs in Dubai",
        paragraphs: [
          "Groceries mix local and imported goods; European brands cost premium prices. Dining ranges from affordable South Asian and Filipino restaurants to hotel brunches that rival any global city.",
          "Car culture dominates; fuel is relatively cheap but car payments, Salik tolls, and parking add up. Public transport exists but many expat budgets assume a vehicle — partially captured in Numbeo transport weights.",
          "Summer electricity for air conditioning can spike bills dramatically — a seasonal cost the annual index smooths over.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Rent is typically paid in one or two cheques annually, which distorts monthly mental accounting. Marina, Downtown, and JLT command high rents; older areas and Sharjah commutes reduce costs.",
          "Housing is excluded from our primary index factor. Dubai vs Bangkok comparisons often show Bangkok winning on goods; rent and school fees (for families) decide total affordability.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Packages often include housing allowance, schooling, and flights for senior expat roles — none of which appear in Numbeo averages. Local benchmark salaries in our data are directional only.",
          "Contract end-of-service gratuity and visa sponsorship tie workers to employers; job mobility differs from Europe or the US.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Pure remote workers face visa limitations; many use Dubai for short stays or company hubs rather than permanent freelance bases. Free zones and new remote-work visa categories change the landscape — confirm with official UAE sources.",
          "Dubai vs Bangkok is a common pairing in our comparisons: lower COL index in Bangkok, different tax and lifestyle trade-offs in Dubai.",
        ],
      },
    ],
    exampleSalary: 18000,
  },

  singapore: {
    overview: [
      "Singapore ranks among Asia’s most expensive cities for everyday consumption: efficient infrastructure, high-quality imports, and strict urban planning come with prices to match. Wages in finance and tech are strong regionally, but so are housing and car ownership costs.",
      "The city-state is small and well-connected; Numbeo reflects urban averages across hawker centers and Orchard Road alike.",
    ],
    sections: [
      {
        heading: "Everyday costs in Singapore",
        paragraphs: [
          "Hawker centers keep food affordable — meals often S$5–S$8 — while restaurants and alcohol carry Singapore’s famous sin taxes and import premiums. Groceries at Cold Storage or FairPrice sit above Southeast Asian neighbors but below Tokyo for many items.",
          "Public transport (MRT, buses) is excellent and reasonably priced. Certificate of Entitlement (COE) makes car ownership one of the world’s most expensive — most residents do not own cars, which the COL basket assumes.",
          "Healthcare mixes public subsidies with private care; insurance and Medisave are part of long-term planning for residents.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Most residents live in HDB flats or private condos with significant monthly payments. Rent for expats in central districts is comparable to major Western cities. Rent exclusion from our index means Singapore’s high goods score understates total living costs for many households.",
          "Foreign workers on employment passes often receive housing allowances not reflected in salary benchmarks.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Regional headquarters roles pay competitively; local benchmarks vary by passport, industry, and pass type. The calculator’s average salary row is a rough gross monthly figure for context.",
          "CPF contributions for citizens and PRs reduce take-home pay compared with pure gross comparisons against tax-free Dubai or low-tax Bangkok setups.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Singapore actively regulates employment passes; remote freelancing from a tourist visa is not a long-term strategy. Many users compare Singapore as a current or potential employer base against Bangkok, Kuala Lumpur, or London.",
          "From Singapore, Bangkok and Lisbon often show stronger purchasing power on goods; Zurich and London can be similar or tougher depending on direction.",
        ],
      },
    ],
    exampleSalary: 9000,
  },

  berlin: {
    overview: [
      "Berlin remains more affordable than Munich, Zurich, or London on most Numbeo measures, while offering a major EU labor market and startup scene. Rents climbed in recent years but everyday services, transit, and local food still undercut many Western capitals.",
      "Germany’s tax and social contributions reduce net pay versus gross headlines — the calculator uses gross salary input and does not model deductions.",
    ],
    sections: [
      {
        heading: "Everyday costs in Berlin",
        paragraphs: [
          "Supermarkets (Aldi, Lidl, Rewe) keep grocery costs moderate. Döner, bakeries, and lunch menus offer inexpensive daily meals; sit-down dining in trendy neighborhoods approaches Paris prices.",
          "The BVG monthly pass covers wide urban travel at a predictable cost. Biking is popular and cheap; the COL index includes typical public transport usage.",
          "Electricity and heating in older Altbau buildings can surprise newcomers; winter gas prices fluctuate with European energy markets.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Berlin’s rental market tightened: cold rent, warm rent, and Nebenkosten confuse comparisons. Central one-bedroom flats often run €1,200–€1,800 warm; outer districts and Brandenburg commutes reduce pressure.",
          "Rent is outside our primary index. Berlin frequently shows stronger purchasing power vs London on goods; housing gap may be narrower than Lisbon but still meaningful.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Tech salaries lag US coastal cities but beat many EU regions for senior roles. Public sector and creative industries pay less; local benchmark gross around €3,800/month is approximate.",
          "Health insurance is mandatory; employer splits are standard but reduce the net figure you should mentally compare to US offers.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Freelance and EU Blue Card routes attract international talent. English-speaking jobs exist but German still opens more doors outside startups.",
          "Berlin vs London is a frequent mental comparison: factors often show Berlin-based goods spending power stronger in Lisbon or Bangkok, weaker in Zurich.",
        ],
      },
    ],
    exampleSalary: 4500,
  },

  paris: {
    overview: [
      "Paris combines high culture with high prices: dining, services, and retail in central arrondissements exceed many EU averages, while suburbs and petite couronne offer relief. The Numbeo index (excluding rent) sits below London and New York but above Lisbon and Barcelona.",
      "French payroll taxes and social charges mean net pay differs substantially from gross — enter gross monthly figures as you understand them and interpret results directionally.",
    ],
    sections: [
      {
        heading: "Everyday costs in Paris",
        paragraphs: [
          "Markets and discount grocers help; Monoprix and Franprix in central areas cost more. A café crème at a bar counter stays relatively cheap; table service and tourist-zone bistros multiply the bill.",
          "Navigo passes cover metro, RER, and buses within zones; strikes and rerouting are a lifestyle factor, not a cost one. Taxis and Uber add up for late nights.",
          "Wine and cheese can be affordable luxuries; imported goods and electronics often cost more than US or Asian prices.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Paris rent is notoriously tight: small studios in desirable arrondissements often exceed €1,500–€2,000. Rent-controlled legacy leases exist but are not available to most newcomers.",
          "Our calculator’s factor excludes rent. Comparing Paris to Lisbon on goods alone understates Lisbon’s total advantage if both rents are market-rate.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "CDI contracts, 13th-month pay, and long lunch culture shape work life. Gross benchmarks around €3,200/month represent broad averages — finance and luxury sectors pay far more.",
          "The vs-local-average feature helps foreign remote workers see how a UK or US salary stacks against typical Parisian gross pay.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "France offers talent passports and EU freedom of movement for citizens; visa rules for non-EU remote workers require legal review. Paris attracts creatives and corporate transferees more than pure nomad visas.",
          "Paris vs Barcelona and Paris vs Lisbon appear often in relocation threads: Spain and Portugal typically show stronger purchasing power from a Paris salary base on everyday goods.",
        ],
      },
    ],
    exampleSalary: 4200,
  },

  barcelona: {
    overview: [
      "Barcelona blends Mediterranean lifestyle with a growing tech and tourism economy. Everyday costs sit below Paris, London, and Berlin on our index, though tourist-heavy neighborhoods inflate prices for dining and short-term stays.",
      "Catalonia’s language and politics add local flavor; most international workers operate in English in tech, but Spanish and Catalan help outside that bubble.",
    ],
    sections: [
      {
        heading: "Everyday costs in Barcelona",
        paragraphs: [
          "Mercats like La Boqueria and neighborhood markets offer fresh produce at reasonable prices; supermarkets (Mercadona, Carrefour) are budget-friendly. Menú del día lunches remain one of Europe’s best deals.",
          "TMB metro and bus network covers the city; Bicing bikes are cheap for short trips. Beach culture is free; nightlife and beach clubs are not.",
          "Utilities in older buildings without central heating can mean expensive electric heaters in winter — a detail averages hide.",
        ],
      },
      {
        heading: "Housing vs the calculator basket",
        paragraphs: [
          "Barcelona’s rental market faced legal changes and tourism restrictions; long-term leases still compete with short-term lets in central districts. One-bedroom flats often run €1,200–€1,700 in Eixample or Gràcia.",
          "Rent is excluded from the headline purchasing-power factor. Barcelona vs Madrid is close on indices; vs London the goods advantage is often large.",
        ],
      },
      {
        heading: "Salaries and job market context",
        paragraphs: [
          "Local salaries trail Northern Europe; startups and multinationals pay premiums for niche skills. Benchmark gross around €2,400/month is indicative — not a offer guide.",
          "Spain’s autónomo (freelance) regime has fixed monthly costs remote workers must research separately.",
        ],
      },
      {
        heading: "Remote workers and relocations",
        paragraphs: [
          "Spain’s digital nomad visa drew international attention; tax and social security rules apply after thresholds. Barcelona is popular with EU and UK remote workers post-Brexit.",
          "From Barcelona, Lisbon is often similar or slightly cheaper on goods; Bangkok and Dubai show different tiers entirely. Compare pairs in our head-to-head guides and plug your salary into the calculator.",
        ],
      },
    ],
    exampleSalary: 3200,
  },
};

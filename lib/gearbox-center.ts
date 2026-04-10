export type GearboxSourceTier =
  | "Official ZF"
  | "ZF Aftermarket"
  | "Official ZF Media";

export type GearboxSource = {
  label: string;
  url: string;
  tier: GearboxSourceTier;
  note?: string;
};

export type GearboxMedia = {
  title: string;
  kind: "Image" | "Video" | "Guide";
  url: string;
  sourceLabel: string;
  imageUrl?: string;
};

export type GearboxFact = {
  label: string;
  value: string;
};

export type TransmissionEntry = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  layout: string;
  whyItMatters: string;
  heroImageUrl?: string;
  factSheet: GearboxFact[];
  howItWorks: string[];
  maintenance: string[];
  fluidGuidance: string[];
  applications: string[];
  media: GearboxMedia[];
  sources: GearboxSource[];
};

const zf8hpSources = [
  {
    label: "ZF 8-Speed Automatic Transmission",
    url: "https://www.zf.com/products/en/cars/products_64238.html",
    tier: "Official ZF",
    note: "Family overview, torque range, architecture, and product positioning.",
  },
  {
    label: "ZF Aftermarket oil and oil change kits",
    url: "https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/oil-oil-change-kits/",
    tier: "ZF Aftermarket",
    note: "Kit makeup, fitment families, and public 8HP service-kit guidance.",
  },
  {
    label: "ZF Aftermarket lubricants / TE-ML lists",
    url: "https://aftermarket.zf.com/en/aftermarket-portal/our-catalog/lubricants/",
    tier: "ZF Aftermarket",
    note: "Use this to verify the approved fluid for the exact transmission application.",
  },
  {
    label: "ZF 8-Speed Plug-In Hybrid Transmission media",
    url: "https://press.zf.com/press/en/media/media_48448.html",
    tier: "Official ZF Media",
    note: "Official 8HP hybrid-system video/media entry.",
  },
] as const satisfies GearboxSource[];

const zf9hpSources = [
  {
    label: "ZF 9-Speed Automatic Transmission",
    url: "https://www.zf.com/products/en/cars/products_65822.html",
    tier: "Official ZF",
    note: "Family overview for front-transverse 9HP layouts.",
  },
  {
    label: "ZF Aftermarket lubricants / TE-ML lists",
    url: "https://aftermarket.zf.com/en/aftermarket-portal/our-catalog/lubricants/",
    tier: "ZF Aftermarket",
    note: "Use the exact application list before choosing fluid.",
  },
] as const satisfies GearboxSource[];

const zf7dctSources = [
  {
    label: "ZF 7-Speed Dual Clutch Transmission",
    url: "https://www.zf.com/products/en/cars/products_65820.html",
    tier: "Official ZF",
    note: "Family overview plus torque capacities for the published 7DT variants.",
  },
  {
    label: "ZF Aftermarket lubricants / TE-ML lists",
    url: "https://aftermarket.zf.com/en/aftermarket-portal/our-catalog/lubricants/",
    tier: "ZF Aftermarket",
    note: "Transmission-specific fluid verification still happens by application, not by family nickname alone.",
  },
] as const satisfies GearboxSource[];

const torqueConverterSources = [
  {
    label: "ZF Torque Converter",
    url: "https://www.zf.com/products/en/cars/products_65854.html",
    tier: "Official ZF",
    note: "Core explanation of how ZF frames torque-converter comfort, damping, and efficiency.",
  },
  {
    label: "How to Change the Transmission Oil on a Passenger Car",
    url: "https://aftermarket.zf.com/sg/aftermarket-portal/for-workshops/useful-tips/transmission-oil-change-pc/",
    tier: "ZF Aftermarket",
    note: "Workshop-facing maintenance context.",
  },
] as const satisfies GearboxSource[];

export const sourceConfidenceLegend = [
  {
    tier: "Official ZF",
    description: "Family specs, architecture, and product claims published by ZF.",
  },
  {
    tier: "ZF Aftermarket",
    description: "Workshop-facing service information, fluid lists, and kit guidance from ZF.",
  },
  {
    tier: "Official ZF Media",
    description: "Images and videos published in the official ZF press/media center.",
  },
] as const;

export const transmissionFamilies: TransmissionEntry[] = [
  {
    slug: "zf-8hp",
    name: "ZF 8HP",
    category: "Torque-converter automatic",
    summary:
      "ZF's benchmark eight-speed longitudinal automatic for rear-drive and all-wheel-drive passenger cars. This is the first family most enthusiasts mean when they say 'ZF auto'.",
    layout: "Longitudinal, rear-wheel-drive and all-wheel-drive applications",
    whyItMatters:
      "The 8HP is the backbone of a huge amount of modern enthusiast hardware, so it makes sense to build the knowledge center around it first.",
    heroImageUrl:
      "https://press.zf.com/press/media/press_media/2018_3/press_image/press_media_database/products_technology/division_p/2014-08-20_1_ZF-8HP_Generation_2_3_2_748px.jpg",
    factSheet: [
      { label: "Type", value: "8-speed automatic with torque converter" },
      { label: "Torque range", value: "220 to 1,000 Nm" },
      { label: "Architecture", value: "5 shift elements for 4 gear sets" },
      { label: "Published spread", value: "Total spread of 7.0" },
      { label: "Published reference weight", value: "8HP70: 87 kg including oil" },
      {
        label: "Variants called out by ZF",
        value: "Conventional, mild hybrid, and plug-in hybrid modular kits",
      },
    ],
    howItWorks: [
      "ZF says the 8HP uses five shift elements across four gear sets, with only two shift elements open per gear to reduce drag losses.",
      "The public product page calls out three multidisk clutches, two brakes, and a parallel-axis vane-cell pump as part of the efficiency story.",
      "ZF positions the 8HP around a wide spread, quick response, and lower fuel consumption without increasing package size over the older 6HP family.",
    ],
    maintenance: [
      "ZF Aftermarket's public 8HP service-kit overview says the kit makeup depends on the transmission type: either separate seal and filter, or a complete plastic oil pan with integrated filter plus the matching gasket and threaded plug.",
      "ZF Aftermarket publicly references 7 one-liter LifeguardFluid bottles for the listed 8HP kit overview.",
      "Hybrid 8HP variants should only be serviced by a high-voltage trained expert according to ZF Aftermarket's public note.",
    ],
    fluidGuidance: [
      "Use ZF's TE-ML lubricant list to identify the approved fluid for the exact application before ordering oil.",
      "Do not treat '8HP' as one universal fill quantity: the family page is not a VIN-specific fill chart, so exact liters still need the transmission code and application lookup.",
      "The public ZF Aftermarket overview is a strong starting point for kits, but application-level service procedures still need exact transmission identification.",
    ],
    applications: [
      "Performance sedans and coupes",
      "Luxury cars",
      "SUVs",
      "Hybrid longitudinal passenger-car platforms",
    ],
    media: [
      {
        title: "8HP official media image",
        kind: "Image",
        url: "https://press.zf.com/press/en/media/media_2253.html",
        sourceLabel: "ZF Press Center",
        imageUrl:
          "https://press.zf.com/press/media/press_media/2018_3/press_image/press_media_database/products_technology/division_p/2014-08-20_1_ZF-8HP_Generation_2_3_2_748px.jpg",
      },
      {
        title: "8HP hybrid-system official video",
        kind: "Video",
        url: "https://press.zf.com/press/en/media/media_48448.html",
        sourceLabel: "ZF Press Center",
        imageUrl:
          "https://press.zf.com/cdn/assets/image/2002/tlandscape_16_9/1667/8ganghybridgetriebe3.jpg",
      },
      {
        title: "8HP service-kit overview",
        kind: "Guide",
        url: "https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/oil-oil-change-kits/",
        sourceLabel: "ZF Aftermarket",
      },
    ],
    sources: [...zf8hpSources],
  },
  {
    slug: "zf-9hp",
    name: "ZF 9HP",
    category: "Torque-converter automatic",
    summary:
      "ZF's nine-speed automatic for front-transverse passenger cars, designed to pack more ratio spread into tighter packaging.",
    layout: "Front-transverse, front-wheel-drive and all-wheel-drive applications",
    whyItMatters:
      "If the 8HP is the headline transmission for longitudinal cars, the 9HP is the important ZF family for many compact and crossover transverse platforms.",
    heroImageUrl: "https://www.zf.com/public/FirstSpirit749x499/9hp_geschlossen_neu_71957.png",
    factSheet: [
      { label: "Type", value: "9-speed automatic with torque converter" },
      { label: "Packaging concept", value: "Tree-space concept for front-transverse application" },
      { label: "Architecture note", value: "Modular construction system" },
      {
        label: "Published positioning",
        value: "Better efficiency without drag losses and lower fuel consumption",
      },
    ],
    howItWorks: [
      "ZF frames the 9HP as a space-efficient automatic for front-transverse layouts where packaging is extremely tight.",
      "The official page emphasizes the modular construction system so different starting elements and AWD applications can be implemented cost-effectively.",
      "The product story is basically packaging plus ratio spread: more gears without giving up comfort or efficiency in compact front-driven platforms.",
    ],
    maintenance: [
      "The public 9HP family page is architecture-focused rather than workshop-procedure-focused, so service work still needs exact transmission and vehicle lookup.",
      "Use the ZF Aftermarket lubricant catalog rather than assuming one universal fluid or fill quantity for every 9HP installation.",
    ],
    fluidGuidance: [
      "Public family-level ZF pages do not publish one catch-all fill quantity for every 9HP application.",
      "Use the TE-ML list and the exact product catalog entry for the transmission code before selecting fluid or service parts.",
    ],
    applications: [
      "Front-wheel-drive passenger cars",
      "All-wheel-drive transverse platforms",
      "Compact and midsize road cars",
    ],
    media: [
      {
        title: "9HP official product image",
        kind: "Image",
        url: "https://www.zf.com/products/en/cars/products_65822.html",
        sourceLabel: "ZF Passenger Car Products",
        imageUrl: "https://www.zf.com/public/FirstSpirit749x499/9hp_geschlossen_neu_71957.png",
      },
      {
        title: "9HP press image",
        kind: "Image",
        url: "https://press.zf.com/press/en/media/media_6055.html",
        sourceLabel: "ZF Press Center",
        imageUrl: "https://press.zf.com/cdn/assets/image/2002/tlandscape_16_9/6055/9hp.jpg",
      },
    ],
    sources: [...zf9hpSources],
  },
  {
    slug: "zf-7dt",
    name: "ZF 7DT",
    category: "Dual-clutch automatic",
    summary:
      "ZF's seven-speed dual-clutch family for sporty passenger cars, focused on uninterrupted torque delivery and fast shifts.",
    layout: "Rear / four-wheel drive and front-longitudinal variants published by ZF",
    whyItMatters:
      "It gives the app a second kind of automatic gearbox knowledge: not just torque-converter autos, but the dual-clutch side of modern performance cars too.",
    heroImageUrl: "https://www.zf.com/public/FirstSpirit749x499/7Gang_Doppelkupplung_71951.png",
    factSheet: [
      { label: "Type", value: "7-speed dual-clutch transmission" },
      { label: "7DT45HL(A)", value: "Rear / 4-wheel drive, 450 Nm" },
      { label: "7DT45FL", value: "Front / longitudinal engine, 390 Nm" },
      { label: "7DT70HL(A)", value: "Rear / 4-wheel drive, 700 Nm" },
      { label: "7DT75(A)", value: "Rear / 4-wheel drive, 525 / 750 Nm" },
    ],
    howItWorks: [
      "ZF's core positioning is simple: lightning-fast gear changes without interrupting thrust.",
      "The family is aimed at dynamic, sporty vehicles but the page also stresses travel comfort instead of making it sound like a track-only gearbox.",
      "In practical terms, this is the branch of the knowledge center where users can learn how a dual-clutch automatic differs from a torque-converter automatic.",
    ],
    maintenance: [
      "The public family page is a product overview, so detailed clutch service, adaptation routines, and exact fill quantities remain application-specific.",
      "Treat the ZF product family name as a starting point, not a complete workshop procedure on its own.",
    ],
    fluidGuidance: [
      "Verify the exact application in the ZF Aftermarket lubricant lists before choosing fluid.",
      "Public ZF family pages do not expose one family-wide liters figure for every 7DT variant, so the app should show the spec gap honestly instead of guessing.",
    ],
    applications: [
      "Sporty longitudinal passenger cars",
      "Rear-drive performance cars",
      "All-wheel-drive performance cars",
    ],
    media: [
      {
        title: "7-speed dual-clutch product image",
        kind: "Image",
        url: "https://www.zf.com/products/en/cars/products_65820.html",
        sourceLabel: "ZF Passenger Car Products",
        imageUrl: "https://www.zf.com/public/FirstSpirit749x499/7Gang_Doppelkupplung_71951.png",
      },
    ],
    sources: [...zf7dctSources],
  },
];

export const howItWorksBasics = [
  {
    slug: "torque-converter-basics",
    title: "How a torque-converter automatic works",
    summary:
      "Start here if you want the app to explain why a classic ZF automatic feels smooth off the line yet can still lock up early for efficiency.",
    bullets: [
      "ZF highlights hydrodynamic start-up behavior, adaptable lock-up clutches, and variable damping systems.",
      "The official torque-converter page also explains that early lock-up with the TwinTD damping concept can reduce fuel consumption while improving comfort at low engine speeds.",
      "This is the mechanical base layer behind a big chunk of modern ZF automatic-transmission behavior.",
    ],
    media: [
      {
        title: "Torque converter official overview",
        kind: "Guide",
        url: "https://www.zf.com/products/en/cars/products_65854.html",
        sourceLabel: "ZF Passenger Car Products",
      },
    ],
    sources: [...torqueConverterSources],
  },
  {
    slug: "service-basics",
    title: "How ZF frames service and fluid selection",
    summary:
      "This is the practical maintenance section: what the public ZF sources actually tell you before you ever touch a drain plug.",
    bullets: [
      "ZF Aftermarket says its service kits are designed around the specific transmission type and can include filters, seals, oil-pan assemblies, and threaded plugs depending on the family.",
      "ZF LifeguardFluid pages stress transmission-specific fluid matching, not generic 'any ATF will do' thinking.",
      "The TE-ML lubricant lists are where you verify the correct approved oil for the exact transmission application.",
      "Hybrid transmission oil changes should only be performed by properly trained high-voltage experts according to the public ZF Aftermarket note.",
    ],
    media: [
      {
        title: "ZF LifeguardFluid and kit overview",
        kind: "Guide",
        url: "https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/oil-oil-change-kits/",
        sourceLabel: "ZF Aftermarket",
      },
      {
        title: "Passenger-car transmission oil change guide",
        kind: "Guide",
        url: "https://aftermarket.zf.com/sg/aftermarket-portal/for-workshops/useful-tips/transmission-oil-change-pc/",
        sourceLabel: "ZF Aftermarket",
      },
    ],
    sources: [
      {
        label: "ZF Aftermarket oil and oil change kits",
        url: "https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/oil-oil-change-kits/",
        tier: "ZF Aftermarket",
      },
      {
        label: "How to Change the Transmission Oil on a Passenger Car",
        url: "https://aftermarket.zf.com/sg/aftermarket-portal/for-workshops/useful-tips/transmission-oil-change-pc/",
        tier: "ZF Aftermarket",
      },
      {
        label: "ZF Aftermarket lubricants / TE-ML lists",
        url: "https://aftermarket.zf.com/en/aftermarket-portal/our-catalog/lubricants/",
        tier: "ZF Aftermarket",
      },
    ],
  },
] as const;

export const featuredGearboxMedia = [
  {
    title: "8HP plug-in hybrid video",
    kind: "Video",
    url: "https://press.zf.com/press/en/media/media_48448.html",
    sourceLabel: "ZF Press Center",
    imageUrl: "https://press.zf.com/cdn/assets/image/2002/tlandscape_16_9/1667/8ganghybridgetriebe3.jpg",
  },
  {
    title: "9HP product image",
    kind: "Image",
    url: "https://www.zf.com/products/en/cars/products_65822.html",
    sourceLabel: "ZF Passenger Car Products",
    imageUrl: "https://press.zf.com/cdn/assets/image/2002/tlandscape_16_9/6055/9hp.jpg",
  },
  {
    title: "7-speed DCT product page",
    kind: "Guide",
    url: "https://www.zf.com/products/en/cars/products_65820.html",
    sourceLabel: "ZF Passenger Car Products",
    imageUrl: "https://www.zf.com/public/FirstSpirit749x499/7Gang_Doppelkupplung_71951.png",
  },
] as const satisfies GearboxMedia[];

export function getTransmissionBySlug(slug: string) {
  return transmissionFamilies.find((entry) => entry.slug === slug);
}

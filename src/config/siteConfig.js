export const siteConfig = {
  business: {
    name: "Legacy Car Detailing Studio",
    shortName: "Legacy",
    tagline: "Premium Car Detailing Experts",
    specialties: "PPF | Ceramic Coating | Sun Films | Wraps",
    specialtiesList: ["PPF", "Ceramic Coating", "Sun Films", "Wraps"],
    logo: "/assets/logo.webp",
    crest: "/assets/logo-crest.webp",
    phone: "8123543569",
    displayPhone: "81235 43569",
    telLink: "tel:+918123543569",
    whatsappLink: "https://wa.me/918123543569?text=Hello%20Legacy%20Car%20Detailing%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20PPF%20%2F%20Ceramic%20Coating%20%2F%20Sun%20Films%20%2F%20Wraps%20%2F%20Detailing.",
    address: "Add studio address here",
    hours: "Monday – Sunday: 08:00 – 20:00",
    mapLink: "https://maps.google.com/?q=Legacy+Car+Detailing+Studio",
    closingLine: "Obsessive automotive preservation. Every surface, every millimeter, treated as timeless.",
    socialLinks: [
      { name: "Instagram", url: "https://instagram.com" },
      { name: "YouTube", url: "https://youtube.com" },
      { name: "WhatsApp", url: "https://wa.me/918123543569" }
    ],
    copyrightNotice: "Legacy Car Detailing Studio. All rights reserved."
  },

  frames: {
    desktop: {
      total: 151,
      path: "/assets/frames/frame_",
      extension: ".webp",
      digits: 4,
      width: 1280,
      height: 720
    },
    mobile: {
      total: 90,
      path: "/assets/frames_mobile/frame_",
      extension: ".webp",
      digits: 4,
      width: 800,
      height: 450
    },
    interactiveThreshold: 0.20
  },

  // 5 editorial stages calibrated to footage
  stages: [
    {
      id: "hero",
      stageNumber: "01 / 05",
      stageTag: "STAGE 01 / 05",
      dirtLevel: 100,
      title: "Legacy Car Detailing Studio",
      tagline: "Premium Car Detailing Experts",
      specialties: "PPF | Ceramic Coating | Sun Films | Wraps",
      shortLine: "Scroll down to start the wash cycle.",
      scrollStart: 0.00,
      scrollEnd: 0.22,
      fadePeak: 0.08,
      position: "left-bottom"
    },
    {
      id: "foam-wash",
      stageNumber: "02 / 05",
      stageTag: "STAGE 02 / 05",
      dirtLevel: 75,
      title: "Car Wash",
      shortLine: "Mud, dust and bird mess gone before you finish your tea.",
      scrollStart: 0.24,
      scrollEnd: 0.43,
      fadePeak: 0.33,
      position: "right-top"
    },
    {
      id: "clay-polish-wax",
      stageNumber: "03 / 05",
      stageTag: "STAGE 03 / 05",
      dirtLevel: 45,
      title: "Clay Bar, Polishing & Waxing",
      shortLine: "Dual-action rotary pads cut out the swirl marks; honest carnauba locks the paint.",
      scrollStart: 0.45,
      scrollEnd: 0.61,
      fadePeak: 0.53,
      position: "left-top"
    },
    {
      id: "interior-glass",
      stageNumber: "04 / 05",
      stageTag: "STAGE 04 / 05",
      dirtLevel: 20,
      title: "Windows, Interior, Leather & Suede",
      shortLine: "No smudges on the glass, no biscuit crumbs in the seat seams.",
      scrollStart: 0.63,
      scrollEnd: 0.81,
      fadePeak: 0.72,
      position: "right-bottom"
    },
    {
      id: "showroom-reveal",
      stageNumber: "05 / 05",
      stageTag: "STAGE 05 / 05",
      dirtLevel: 0,
      title: "Showroom Finish",
      shortLine: "Pristine panels, mirror reflection, ready for the open road.",
      scrollStart: 0.83,
      scrollEnd: 1.00,
      fadePeak: 0.93,
      position: "left-bottom",
      ctaText: "Book your shine"
    }
  ],

  // Exactly the 8 services in the service menu with optional metadata
  services: [
    {
      id: "ppf-paint-protection",
      num: "01",
      title: "Paint Protection Film (PPF)",
      description: "Self-healing ultra-clear aliphatic urethane barrier protecting panels against stone chips, scratches, and road fallout.",
      from: null,
      duration: null,
      includes: "Instant Self-Healing, 10-Year Guarantee",
      imageCrop: "/assets/frames/frame_0150.webp"
    },
    {
      id: "ceramic-coating",
      num: "02",
      title: "Ceramic Coating",
      description: "Multi-layer 9H nano-ceramic matrix bonding with clear coat for extreme hydrophobic beading, UV defense, and deep wet-look gloss.",
      from: null,
      duration: null,
      includes: "9H Hardness, Hydrophobic Shield",
      imageCrop: "/assets/frames/frame_0088.webp"
    },
    {
      id: "sun-films",
      num: "03",
      title: "Sun Films",
      description: "High-rejection nano-ceramic architectural window films blocking 99% UV rays and maximum infrared heat without signal interference.",
      from: null,
      duration: null,
      includes: "99% UV Rejection, Heat Shield",
      imageCrop: "/assets/frames/frame_0110.webp"
    },
    {
      id: "custom-wraps",
      num: "04",
      title: "Custom Wraps",
      description: "Bespoke color transformations, satin/matte conversions, and styling accents applied with flawless edge-wrapped craftsmanship.",
      from: null,
      duration: null,
      includes: "Premium Cast Vinyl, Seamless Edges",
      imageCrop: "/assets/frames/frame_0070.webp"
    },
    {
      id: "paint-correction",
      num: "05",
      title: "Paint Correction & Polishing",
      description: "Precision multi-stage rotary cut and jeweling that permanently eliminates swirl marks, scratches, holograms, and paint oxidation.",
      from: null,
      duration: null,
      includes: "Swirl-Free Leveling, High Clarity",
      imageCrop: "/assets/frames/frame_0080.webp"
    },
    {
      id: "deep-interior-detailing",
      num: "06",
      title: "Deep Interior Detailing",
      description: "Medical-grade dry steam vapor decontamination, deep carpet extraction, and HVAC duct sanitization restoring showroom purity.",
      from: null,
      duration: null,
      includes: "Steam Sanitized, Zero Odor",
      imageCrop: "/assets/frames/frame_0128.webp"
    },
    {
      id: "leather-suede-restoration",
      num: "07",
      title: "Leather & Suede Restoration",
      description: "pH-neutral botanical nourishment and ceramic barrier treatment rubbed by hand, reviving original factory matte nap.",
      from: null,
      duration: null,
      includes: "Matte Finish, UV Nourishment",
      imageCrop: "/assets/frames/frame_0130.webp"
    },
    {
      id: "deionized-hydro-wash",
      num: "08",
      title: "Deionized Hydro Wash",
      description: "Touchless deionized snow-foam wash with filtered 0-TDS water rinse, protecting ceramic coats and delicate clear coat finishes.",
      from: null,
      duration: null,
      includes: "0-TDS Spot-Free, Touchless Foam",
      imageCrop: "/assets/frames/frame_0045.webp"
    }
  ]
};

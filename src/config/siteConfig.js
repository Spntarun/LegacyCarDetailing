export const siteConfig = {
  business: {
    name: "Dolphin Car Spa",
    shortName: "Dolphin",
    tagline: "Bring it in dirty. Drive it out new.",
    phone: "8660036822",
    displayPhone: "86600 36822",
    telLink: "tel:+918660036822",
    whatsappLink: "https://wa.me/918660036822?text=Hello%20Dolphin%20Car%20Spa%2C%20I%20would%20like%20to%20book%20a%20service.",
    address: "Add address here",
    footerText: "Dolphin Car Spa. Demo site."
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
      title: "Dolphin Car Spa",
      tagline: "Bring it in dirty. Drive it out new.",
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

  // Exactly the 8 services in the service menu
  services: [
    {
      id: "car-wash",
      num: "01",
      title: "Car Wash",
      description: "Touchless deionized pressure rinse and snow foam that treats clear coats with respect.",
      imageCrop: "/assets/frames/frame_0045.webp"
    },
    {
      id: "auto-detailing",
      num: "02",
      title: "Auto Detailing",
      description: "Complete bumper-to-bumper strip down, arches scrubbed and badges cleaned with soft hair brushes.",
      imageCrop: "/assets/frames/frame_0070.webp"
    },
    {
      id: "car-polishing",
      num: "03",
      title: "Car Polishing",
      description: "Rotary correction that levels out oxidation, holograms and car-wash spiderweb marks.",
      imageCrop: "/assets/frames/frame_0080.webp"
    },
    {
      id: "car-waxing",
      num: "04",
      title: "Car Waxing",
      description: "Hand-applied Brazilian carnauba paste for deep water beading and warm, honest luster.",
      imageCrop: "/assets/frames/frame_0088.webp"
    },
    {
      id: "car-window-cleaning",
      num: "05",
      title: "Car Window Cleaning",
      description: "Tint-safe de-mineralizing wipe inside and out so oncoming headlights don't scatter glare.",
      imageCrop: "/assets/frames/frame_0110.webp"
    },
    {
      id: "clay-bar-treatment",
      num: "06",
      title: "Clay Bar Treatment",
      description: "Specialized synthetic clay shears off brake fallout and rail dust that soaps can't touch.",
      imageCrop: "/assets/frames/frame_0075.webp"
    },
    {
      id: "interior-cleaning",
      num: "07",
      title: "Interior Cleaning",
      description: "Dry steam vapor through the vents, deep extraction on carpets, and not a trace of stale smell.",
      imageCrop: "/assets/frames/frame_0128.webp"
    },
    {
      id: "leather-suede-cleaning",
      num: "08",
      title: "Leather and Suede Cleaning",
      description: "Gentle pH-neutral conditioner rubbed in by hand; suede brushed up to a factory matte nap.",
      imageCrop: "/assets/frames/frame_0130.webp"
    }
  ]
};

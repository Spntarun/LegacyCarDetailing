# Dolphin Car Spa — Premium Auto Detailing Single-Page Experience

A luxury, scroll-driven 3D-style single-page web experience built for **Dolphin Car Spa**. As visitors scroll on laptop or mobile devices, the hero vehicle transforms dynamically from mud-covered to showroom spotless, with synchronized stage overlays, fluid 60fps Lenis interpolation, glass-morphism service cards, direct phone/WhatsApp booking integrations, and full accessibility support.

---

## 🚀 Live Demo & Tech Stack

- **Framework**: Vite + React 19
- **Animation & Scrubbing**: GSAP + ScrollTrigger with lerped `requestAnimationFrame` canvas rendering
- **Smooth Scrolling**: Lenis (`lenis`)
- **Styling**: Tailwind CSS v4 (Dark Navy `#0A1628`, Cyan Glow `#00D4FF`, Glassmorphism)
- **Icons**: Lucide React
- **Media Engine**: FFmpeg WebP sequence generation (Desktop: 1280px / 151 frames; Mobile: 800px / 90 frames)

---

## 📁 Project Structure

```text
DolphinSPa/
├── assets/
│   ├── DolphinBackdrop.mov       # Source 1080p master video
│   ├── frames/                   # Desktop 1280px WebP sequence (151 frames)
│   └── frames_mobile/            # Mobile 800px WebP sequence (90 frames)
├── public/
│   ├── favicon.svg               # Brand cyan dolphin badge icon
│   └── assets/                   # Publicly served frame sequences
├── src/
│   ├── config/
│   │   └── siteConfig.js         # Single source of truth (all copy, services, timings)
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky responsive blur/shrink navbar
│   │   ├── LoadingScreen.jsx     # Dolphin branded 20% threshold progress preloader
│   │   ├── ScrollStoryCanvas.jsx # Core canvas scrub + video-synced overlays + reduced motion slider
│   │   ├── ServicesSection.jsx   # 8 glassmorphism cards with responsive grid & stagger animations
│   │   ├── ContactSection.jsx    # Call Now (8660036822) & WhatsApp booking + footer
│   │   └── FloatingMobileCTA.jsx # Floating quick-dial & WhatsApp buttons on mobile
│   ├── App.jsx                   # Lenis + GSAP initialization & root layout
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Theme variables, glassmorphism, custom scrollbars
├── index.html                    # SEO meta tags, Open Graph, Google Fonts (Outfit & Inter)
├── package.json
└── vite.config.js
```

---

## 🛠️ How to Swap the Video & Regenerate Frames

If you ever wish to replace `assets/DolphinBackdrop.mov` with a new master video:

### 1. Place your new video
Save the new video file to `assets/DolphinBackdrop.mov` (or update the filename in the commands below).

### 2. Regenerate Desktop & Mobile WebP Sequences using FFmpeg
Run the following commands in your shell:

```bash
# 1. Desktop sequence (~150 frames, 1280px wide WebP, 82 quality)
ffmpeg -y -i assets/DolphinBackdrop.mov -vf "fps=8,scale=1280:-1" -c:v libwebp -quality 82 assets/frames/frame_%04d.webp

# 2. Mobile lightweight sequence (~90 frames, 800px wide WebP, 75 quality)
ffmpeg -y -i assets/DolphinBackdrop.mov -vf "fps=4.76,scale=800:-1" -c:v libwebp -quality 75 assets/frames_mobile/frame_%04d.webp

# 3. Sync frames to the public distribution folder
cp -r assets/frames public/assets/
cp -r assets/frames_mobile public/assets/
```
*(On Windows PowerShell, use `Copy-Item -Recurse -Force assets/frames public/assets/` and `Copy-Item -Recurse -Force assets/frames_mobile public/assets/`)*

### 3. Update Frame Counts in Config (if different)
In `src/config/siteConfig.js`, adjust the `total` counts to match the newly generated frames:
```javascript
frames: {
  desktop: {
    total: 151, // Update if new total count differs
    ...
  },
  mobile: {
    total: 90,  // Update if new mobile count differs
    ...
  }
}
```

---

## ✏️ How to Edit Text, Overlays, and Services

All business information, stage text, and the 8 service packages are centralized in a single configuration file:
👉 **[`src/config/siteConfig.js`](file:///T:/DolphinSPa/src/config/siteConfig.js)**

### Editing Business Contact Info:
```javascript
business: {
  name: "Dolphin Car Spa",
  tagline: "Where every car shines.",
  phone: "8660036822",
  displayPhone: "+91 86600 36822",
  telLink: "tel:+918660036822",
  whatsappLink: "https://wa.me/918660036822",
  hours: "Mon – Sun: 8:00 AM – 8:00 PM"
}
```

### Editing the 5 Scroll Stages & Video Timings:
Each stage in `siteConfig.stages` contains `scrollStart`, `scrollEnd`, `title`, and `shortLine`. Overlays have been calibrated to the real visual footage:
1. **Hero**: 0% - 22% (Dirty car arrival & headlights)
2. **Car Wash**: 24% - 43% (Foam wash & high pressure rinse)
3. **Clay Bar, Polishing and Waxing**: 45% - 61% (Machine swirl removal)
4. **Windows, Interior, Leather and Suede**: 63% - 81% (Streak-free glass & cabin rejuvenation)
5. **Showroom Finish**: 83% - 100% (Gleaming studio reveal + CTA)

### Editing Services:
Update or extend the `services` array in `siteConfig.js` to modify titles, descriptions, icons, or feature bullet lists.

---

## ⚡ Local Development

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Run automated Playwright tests across Desktop (1440px), Tablet (768px), and Mobile (375px)
node test-e2e.js
```

---

## 🚢 How to Deploy

### Option A: Vercel (Recommended)
1. Push this project to GitHub / GitLab / Bitbucket.
2. In [Vercel](https://vercel.com/), click **Add New Project** and select your repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

*Or via Vercel CLI:*
```bash
npm install -g vercel
vercel
```

### Option B: Netlify
1. Log in to [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**.

*Or via Netlify CLI:*
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## ♿ Accessibility & Performance Highlights

- **`prefers-reduced-motion` Support**: Users requesting reduced motion are automatically served an interactive before/after split comparison slider rather than scroll hijacking.
- **Progressive Loading**: Interactive threshold set to the first 20% of frames with background chunk streaming, eliminating loading lag.
- **Responsive Canvas**: Cover-fit canvas scaling keeps the vehicle perfectly centered on iPhone, Android, iPad, laptops, and ultra-wide displays.

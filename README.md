# Legacy Car Detailing Studio — Master Technical Architecture & Guide

A luxury, scroll-driven 3D-style single-page web experience built for **Legacy Car Detailing Studio**. As visitors scroll on laptop or mobile devices, the hero vehicle transforms dynamically from mud-covered arrival to showroom spotless, with synchronized stage overlays, fluid 60fps Lenis interpolation, an editorial 8-treatment service menu, direct phone/WhatsApp booking integrations, and full accessibility support.

---

## 🚀 Tech Stack & Core Libraries

- **Framework**: [Vite 6](https://vite.dev/) + [React 19](https://react.dev/)
- **Animation & Scrubbing**: [GSAP 3.12](https://gsap.com/) + ScrollTrigger with lerped `requestAnimationFrame` 2D canvas rendering
- **Smooth Scrolling**: [Lenis 1.1](https://lenis.darkroom.engineering/) coupled directly with `gsap.ticker`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` and `@theme` custom properties
- **Palette**: Obsidian Ink (`#0B0B0D`), Raised Surface (`#141417`), Hairline Line (`rgba(237,232,223,0.10)`), Warm Bone (`#EDE8DF`), Champagne Gold Accent (`#C9A24B`)
- **Typography**: Cormorant Garamond (Display Serif), Inter (Body), JetBrains Mono (Technical/Telemetry)
- **Media Engine**: Dual WebP sequence generation (Desktop: 1280×720 / 151 frames; Mobile: 800×450 / 90 frames)
- **Testing**: [Playwright](https://playwright.dev/) for automated multi-viewport visual verification

---

## 📁 Project Structure & File Inventory

```text
DolphinSPa/
├── assets/
│   ├── DolphinBackdrop.mov       # Source 1080p master video footage
│   ├── frames/                   # Desktop 1280px WebP sequence (151 frames, frame_0001 to frame_0151)
│   └── frames_mobile/            # Mobile 800px WebP sequence (90 frames, frame_0001 to frame_0090)
├── public/
│   ├── favicon.svg               # Architectural serif 'L' monogram in champagne gold on #0B0B0D
│   └── assets/                   # Publicly served frame sequences (synced with assets/)
│       ├── frames/               # 151 WebP files served at /assets/frames/frame_0001.webp
│       └── frames_mobile/        # 90 WebP files served at /assets/frames_mobile/frame_0001.webp
├── src/
│   ├── config/
│   │   └── siteConfig.js         # Single source of truth (business info, frames, 5 stages, 8 services)
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky navigation with mix-blend-mode: difference
│   │   ├── LoadingScreen.jsx     # High-contrast monospace frame-load preloader (20% interactive threshold)
│   │   ├── ScrollStoryCanvas.jsx # Core canvas scrub, frame streaming, direct DOM overlays, reduced motion slider
│   │   ├── ServicesSection.jsx   # Editorial 8-service split list with hover preview & mobile accordion
│   │   ├── ContactSection.jsx    # Giant serif phone call-to-action (8123543569) & studio information
│   │   ├── FloatingMobileCTA.jsx # Bottom mobile sticky quick-dial bar
│   │   └── CustomCursor.jsx      # Magnetic follower cursor on desktop with hover magnification
│   ├── App.jsx                   # Lenis + GSAP initialization, progress throttling, root layout
│   ├── main.jsx                  # React 19 mount point (StrictMode)
│   └── index.css                 # Tailwind v4 @theme, custom palette, typography, Lenis & scrollbar rules
├── index.html                    # SEO meta tags, Open Graph, Google Fonts (Cormorant Garamond, Inter, JetBrains Mono)
├── package.json                  # Dependencies and build scripts
├── vite.config.js                # Vite config (port 3000, @vitejs/plugin-react, @tailwindcss/vite)
├── test-all-stages.js            # Playwright script testing desktop stages 1 through 5
├── test-e2e.js                   # End-to-end multi-viewport Playwright verification
├── test-mobile-stages.js         # Mobile device frame and scroll verification
└── test-redesign.js              # Visual regression test script
```

---

## 🧠 System Architecture & Rendering Pipelines

### 1. Canvas Video Scrubbing Engine (`ScrollStoryCanvas.jsx`)
- **Dual Image Sequences**:
  - **Desktop**: 151 frames at 1280×720px (`/assets/frames/frame_%04d.webp`).
  - **Mobile**: 90 frames at 800×450px (`/assets/frames_mobile/frame_%04d.webp`), activated below `768px`.
- **Chunked Preloading Strategy**:
  - Loads `frame_0001.webp` immediately and draws the initial canvas cover.
  - Loads the first **20%** of frames (`interactiveThreshold: 0.20`).
  - Fires `onInteractiveReady()` as soon as 20% completes, dismissing the `LoadingScreen` without forcing visitors to wait for all 151 frames.
  - Streams the remaining 80% frames in non-blocking batches of 10 (`setTimeout(loadRemaining, 8)`).
- **Instant Fallback Algorithm**:
  - If a user rapidly scrubs past unloaded frames, `drawFrame()` scans backward (and forward) to find the nearest loaded frame, ensuring the canvas never blanks, flashes, or stutters.
- **Lerped Render Loop**:
  - The `requestAnimationFrame` loop uses linear interpolation:
    $$\text{currentFrame} += (\text{targetFrame} - \text{currentFrame}) \times 0.2$$
  - Redraws occur **only** when `Math.round(currentFrame) !== lastDrawnIndex`.

### 2. High-Performance Direct DOM Updates (Zero React Re-render Thrashing)
- During the pinned 400% scroll scrub, ScrollTrigger fires up to 120 times per second.
- To maintain 60 FPS:
  - Telemetry gauge text (`dirtLevelTextRef.current.innerText = '...'`)
  - Telemetry gauge fill bar (`dirtBarFillRef.current.style.height = '...'`)
  - 5 editorial stage overlays (`overlayRefs.current[idx].style.opacity`, `transform`)
  are written **directly to DOM element styles and text**, bypassing React state and preventing component re-renders during scrolling.

### 3. Lenis Smooth-Scrolling & GSAP Ticker Synchronization
- Initialized in `App.jsx` with duration `1.2s` and custom cubic easing.
- Synchronized with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- Ticked directly inside GSAP's RAF: `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)`.

### 4. Accessibility & Reduced Motion Support
- Detects `prefers-reduced-motion: reduce`.
- When enabled:
  - Bypasses Lenis smooth scrolling.
  - Skips the pinned 400% canvas scroll track entirely.
  - Renders an interactive **Before & After split comparison slider** comparing dirty arrival (`frame_0001.webp`) against showroom finish (`frame_0150.webp`).

### 5. Responsive Dual-Viewport Strategy
- **Desktop (>= 768px)**:
  - 151-frame high-resolution sequence.
  - Left-hand telemetry rail with live dirt percentage gauge.
  - Custom magnetic cursor (`CustomCursor.jsx`) with hover magnification.
  - Service rows feature a floating preview image following cursor position.
- **Mobile (< 768px)**:
  - 90-frame lightweight sequence.
  - Service rows feature tap-to-expand accordion with inline image crop and direct WhatsApp booking deep-link.
  - Sticky bottom action bar (`FloatingMobileCTA.jsx`) for instant one-tap calling (`8123543569`).

---

## ✏️ Single Source of Truth: `src/config/siteConfig.js`

All business information, stage text, and service packages are centralized in `src/config/siteConfig.js`:

### 1. Studio Contact & Booking Details
```javascript
business: {
  name: "Legacy Car Detailing Studio",
  shortName: "Legacy",
  tagline: "Premium Car Detailing Experts",
  specialties: "PPF | Ceramic Coating | Sun Films | Wraps",
  phone: "8123543569",
  displayPhone: "81235 43569",
  telLink: "tel:+918123543569",
  whatsappLink: "https://wa.me/918123543569?text=Hello%20Legacy%20Car%20Detailing%20Studio...",
  address: "Add studio address here",
  hours: "Monday – Sunday: 08:00 – 20:00"
}
```

### 2. The 5 Editorial Stages & Scroll Ranges
Calibrated directly to the vehicle video footage:
1. **Hero**: `0.00 - 0.22` (Dirty car arrival & headlights)
2. **Car Wash**: `0.24 - 0.43` (Touchless foam wash & high-pressure rinse)
3. **Clay Bar, Polishing & Waxing**: `0.45 - 0.61` (Rotary swirl removal & carnauba application)
4. **Windows, Interior, Leather & Suede**: `0.63 - 0.81` (Streak-free glass & cabin rejuvenation)
5. **Showroom Finish**: `0.83 - 1.00` (Gleaming mirror reflection & booking CTA)

### 3. The 8 Signature Protocols (Service Menu)
Each treatment in `services` contains:
- `id`: Unique kebab-case slug (e.g. `"ppf-paint-protection"`, `"ceramic-coating"`)
- `num`: Display index (`"01"` to `"08"`)
- `title`: Service title:
  1. **Paint Protection Film (PPF)** — Self-healing urethane shield
  2. **Ceramic Coating** — Multi-layer 9H nano-quartz matrix
  3. **Sun Films** — High heat-rejection nano-ceramic window films
  4. **Custom Wraps** — Bespoke color change vinyl & styling
  5. **Paint Correction & Polishing** — Swirl-free rotary correction
  6. **Deep Interior Detailing** — Dry steam vapor decontamination
  7. **Leather & Suede Restoration** — Factory matte nap rejuvenation
  8. **Deionized Hydro Wash** — 0-TDS spot-free snow foam wash
- `description`: Editorial service description
- `imageCrop`: Frame crop preview path (`/assets/frames/frame_0150.webp`)

---

## 🛠️ How to Swap the Master Video & Regenerate Frames

If replacing `assets/DolphinBackdrop.mov` with a new master video:

### 1. Place the Master Video
Save the video file to `assets/DolphinBackdrop.mov` (or update filenames accordingly).

### 2. Extract WebP Sequences with FFmpeg
Run the following commands:

```bash
# 1. Desktop sequence (~150 frames, 1280px wide WebP, quality 82)
ffmpeg -y -i assets/DolphinBackdrop.mov -vf "fps=8,scale=1280:-1" -c:v libwebp -quality 82 assets/frames/frame_%04d.webp

# 2. Mobile lightweight sequence (~90 frames, 800px wide WebP, quality 75)
ffmpeg -y -i assets/DolphinBackdrop.mov -vf "fps=4.76,scale=800:-1" -c:v libwebp -quality 75 assets/frames_mobile/frame_%04d.webp
```

### 3. Sync to Public Distribution Folder
- **PowerShell (Windows)**:
  ```powershell
  Copy-Item -Recurse -Force assets\frames public\assets\
  Copy-Item -Recurse -Force assets\frames_mobile public\assets\
  ```
- **Bash (macOS / Linux)**:
  ```bash
  cp -r assets/frames public/assets/
  cp -r assets/frames_mobile public/assets/
  ```

### 4. Update Frame Counts in Config (if different)
In `src/config/siteConfig.js`, adjust the `total` counts to match the generated frame count:
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

## 🛡️ Critical Rules for Flawless Future Editing

1. **Do NOT introduce React `useState` inside the ScrollTrigger loop**:
   In `ScrollStoryCanvas.jsx`, updating DOM nodes directly via refs ensures the scroll runs at 60 FPS. Adding React state updates inside `onUpdate` will trigger component re-render loops and cause severe scrolling lag.
2. **Tailwind v4 Theme Declarations**:
   Tailwind v4 relies on `@theme` in `src/index.css`. Custom fonts and palette tokens (`--color-ink`, `--color-bone`, `--color-signal`, `--font-display`) must be updated in `src/index.css`.
3. **Preserve Lenis Anchor Scrolling**:
   Navigation links scroll smoothly using `el.scrollIntoView({ behavior: 'smooth' })`. Avoid forcing raw `window.scrollTo` without accounting for pinned canvas ScrollTrigger tracks.
4. **Unified Mobile Breakpoint**:
   All mobile layout triggers (frame sequence switch, accordion expansion, floating bottom CTA) use `768px` (`md` in Tailwind). Keep all responsive modifications aligned to this breakpoint.

---

## ⚡ Development & Testing Commands

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Automated Playwright Visual Verification:
node test-all-stages.js     # Captures Desktop stages 1 through 5
node test-mobile-stages.js  # Captures Mobile stages & service accordion
node test-e2e.js            # Comprehensive multi-viewport testing (Desktop, Tablet, Mobile)
node test-redesign.js       # Visual regression suite
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New Project** and pick the repository.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### Netlify
1. Connect repository in Netlify.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Click **Deploy**.

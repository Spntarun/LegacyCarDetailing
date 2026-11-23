import { preview } from 'vite';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('scratch/test_screens');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('--- Starting Vite Preview Server ---');
  const server = await preview({
    preview: {
      port: 3000,
      host: '127.0.0.1'
    }
  });

  const serverUrl = 'http://127.0.0.1:3000';
  console.log(`Server listening at: ${serverUrl}`);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e1) {
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch (e2) {
      browser = await chromium.launch({ headless: true });
    }
  }

  const consoleErrors = [];
  const testResults = {
    viewports: [],
    stages: [],
    overflows: [],
    errors: []
  };

  try {
    // 1. Multi-Viewport & Responsive Checks
    const viewports = [
      { width: 360, height: 740, name: '360_mobile_small' },
      { width: 390, height: 844, name: '390_mobile_iphone' },
      { width: 768, height: 1024, name: '768_tablet' },
      { width: 1024, height: 768, name: '1024_desktop_small' },
      { width: 1440, height: 900, name: '1440_desktop' },
      { width: 1920, height: 1080, name: '1920_ultrawide' }
    ];

    console.log('\n--- 1. Testing Viewports & Overflow ---');
    for (const vp of viewports) {
      const isMobile = vp.width < 768;
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile,
        hasTouch: isMobile
      });
      const page = await ctx.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(`[${vp.name}] ${msg.text()}`);
        }
      });

      await page.goto(serverUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      await page.locator('button[aria-label="Skip introduction video"]').click().catch(() => {});
      await page.waitForTimeout(800);

      // Verify horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          hasOverflow: docWidth > winWidth + 1
        };
      });

      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): docWidth=${overflow.docWidth}, winWidth=${overflow.winWidth}, overflow=${overflow.hasOverflow}`);
      testResults.overflows.push({ ...vp, ...overflow });

      await page.screenshot({ path: path.join(outDir, `vp_${vp.name}.png`) });
      await ctx.close();
    }

    // 2. Desktop Stages Scrub Verification (1440x900)
    console.log('\n--- 2. Testing All 5 Stages at 1440x900 ---');
    const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesktop = await ctxDesktop.newPage();
    pageDesktop.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`[Desktop] ${msg.text()}`);
    });

    await pageDesktop.goto(serverUrl, { waitUntil: 'networkidle' });
    await pageDesktop.waitForTimeout(800);
    await pageDesktop.locator('button[aria-label="Skip introduction video"]').click().catch(() => {});
    await pageDesktop.waitForTimeout(1000);

    const stages = [
      { name: '01_hero', y: 0 },
      { name: '02_wash', y: 1100 },
      { name: '03_polish', y: 1900 },
      { name: '04_interior', y: 2700 },
      { name: '05_showroom_reveal', y: 3500 }
    ];

    for (const stg of stages) {
      await pageDesktop.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), stg.y);
      await pageDesktop.waitForTimeout(600);
      await pageDesktop.screenshot({ path: path.join(outDir, `stage_${stg.name}.png`) });
      console.log(`Captured stage_${stg.name}.png at y=${stg.y}`);
    }

    // Services section & hover preview
    await pageDesktop.evaluate(() => document.getElementById('services')?.scrollIntoView({ behavior: 'instant' }));
    await pageDesktop.waitForTimeout(500);
    const firstRow = pageDesktop.locator('.service-menu-row').first();
    await firstRow.hover();
    await pageDesktop.waitForTimeout(400);
    await pageDesktop.screenshot({ path: path.join(outDir, 'stage_06_services_hover.png') });
    console.log('Captured stage_06_services_hover.png');

    // Contact section
    await pageDesktop.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }));
    await pageDesktop.waitForTimeout(500);
    await pageDesktop.screenshot({ path: path.join(outDir, 'stage_07_contact.png') });
    console.log('Captured stage_07_contact.png');

    await ctxDesktop.close();

    // 3. Mobile Specific Tests (375x812 with touch)
    console.log('\n--- 3. Testing Mobile Specifics (375x812) ---');
    const ctxMobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true
    });
    const pageMobile = await ctxMobile.newPage();
    let mobileFramesCount = 0;
    pageMobile.on('request', (req) => {
      if (req.url().includes('frames_mobile')) mobileFramesCount++;
    });

    await pageMobile.goto(serverUrl, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(800);
    await pageMobile.locator('button[aria-label="Skip introduction video"]').click().catch(() => {});
    await pageMobile.waitForTimeout(800);

    // Scroll to Services and test accordion click
    await pageMobile.evaluate(() => document.getElementById('services')?.scrollIntoView({ behavior: 'instant' }));
    await pageMobile.waitForTimeout(500);

    // Tap first service to expand
    const mobileFirstRow = pageMobile.locator('.service-menu-row').first();
    await mobileFirstRow.click();
    await pageMobile.waitForTimeout(400);
    await pageMobile.screenshot({ path: path.join(outDir, 'mobile_accordion_expanded.png') });
    console.log('Captured mobile_accordion_expanded.png');

    // Scroll to contact and verify floating CTA doesn't obscure content
    await pageMobile.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }));
    await pageMobile.waitForTimeout(500);
    await pageMobile.screenshot({ path: path.join(outDir, 'mobile_contact_footer.png') });
    console.log(`Captured mobile_contact_footer.png (Mobile frames loaded: ${mobileFramesCount})`);

    await ctxMobile.close();

    // 4. Reduced Motion Test
    console.log('\n--- 4. Testing Reduced Motion Mode ---');
    const ctxReduced = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const pageReduced = await ctxReduced.newPage();
    await pageReduced.goto(serverUrl, { waitUntil: 'networkidle' });
    await pageReduced.waitForTimeout(800);
    await pageReduced.locator('button[aria-label="Skip introduction video"]').click().catch(() => {});
    await pageReduced.waitForTimeout(800);
    await pageReduced.screenshot({ path: path.join(outDir, 'reduced_motion_slider.png') });
    console.log('Captured reduced_motion_slider.png');
    await ctxReduced.close();

  } finally {
    await browser.close();
    await server.httpServer.close();
    console.log('--- Test Run Finished ---');
  }

  const anyOverflow = testResults.overflows.some((o) => o.hasOverflow);
  console.log(`\n================================`);
  console.log(`Test Summary:`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error('ERROR:', e));
  }
  console.log(`Horizontal Overflows: ${anyOverflow ? 'FAIL' : 'PASS (Zero Overflow across 360-1920px)'}`);
  console.log(`All Tests Finished Successfully.`);
  console.log(`================================`);

  if (consoleErrors.length > 0 || anyOverflow) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});

import { test } from '@playwright/test';

test('stat card layout fix', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/dashboard');
  // Wait for Convex data to load - try to detect the stat value label
  try {
    await page.waitForSelector('text=ACTIVE LISTINGS', { timeout: 15000 });
  } catch {
    // fallback: just wait
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/v3_full.png', fullPage: true });
  await page.screenshot({ path: 'screenshots/v3_viewport.png' });
});

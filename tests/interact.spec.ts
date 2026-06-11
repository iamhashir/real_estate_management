import { test } from '@playwright/test';

test('final dashboard check', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/final_dashboard.png', fullPage: true });
});

test('final properties check', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/properties');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/final_properties.png' });
});

test('mobile final', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'screenshots/final_mobile.png', fullPage: true });
});

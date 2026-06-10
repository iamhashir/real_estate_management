import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";

const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 812 },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const PAGES = [
  { path: "/dashboard",  label: "Dashboard" },
  { path: "/properties", label: "Properties" },
  { path: "/clients",    label: "Clients" },
  { path: "/deals",      label: "Deals" },
];

const BASE = "http://localhost:3000";
const OUT  = "./qa-screenshots";
mkdirSync(OUT, { recursive: true });

const issues = [];

function log(vp, page, type, detail) {
  const msg = `[${vp.name}] ${page.label}: ${type} — ${detail}`;
  console.log(msg);
  issues.push({ viewport: vp.name, page: page.label, type, detail });
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const ctx  = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    for (const route of PAGES) {
      await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle", timeout: 15000 }).catch(() =>
        page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded", timeout: 10000 })
      );
      await page.waitForTimeout(800);

      // ── Screenshot ──────────────────────────────────────────────────────────
      const shot = `${OUT}/${vp.name}-${route.label.toLowerCase()}.png`;
      await page.screenshot({ path: shot, fullPage: true });
      console.log(`  ✓ screenshot → ${shot}`);

      // ── Horizontal overflow ─────────────────────────────────────────────────
      const overflows = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll("*").forEach((el) => {
          if (el.scrollWidth > document.documentElement.clientWidth + 4) {
            const tag  = el.tagName.toLowerCase();
            const cls  = el.className?.toString().slice(0, 60) ?? "";
            const rect = el.getBoundingClientRect();
            if (rect.height > 0) bad.push(`${tag}[${cls}] scrollW=${el.scrollWidth}`);
          }
        });
        return bad.slice(0, 8);
      });
      if (overflows.length) log(vp, route, "OVERFLOW", overflows.join(" | "));

      // ── Bottom tab bar on mobile ─────────────────────────────────────────────
      if (vp.name === "mobile") {
        const tabBar = await page.locator("nav[aria-label='Primary']").isVisible().catch(() => false);
        if (!tabBar) log(vp, route, "MISSING", "BottomTabBar not visible on mobile");

        const sidebar = await page.locator("aside[aria-label='Main navigation']").isVisible().catch(() => false);
        if (sidebar) log(vp, route, "VISIBLE_WRONG", "Sidebar should be hidden on mobile");
      }

      // ── Sidebar on desktop ───────────────────────────────────────────────────
      if (vp.name === "desktop") {
        const sidebar = await page.locator("aside[aria-label='Main navigation']").isVisible().catch(() => false);
        if (!sidebar) log(vp, route, "MISSING", "Sidebar not visible on desktop");
      }

      // ── Small touch targets (< 44px) ────────────────────────────────────────
      if (vp.name === "mobile") {
        const smallTargets = await page.evaluate(() => {
          const results = [];
          const interactive = document.querySelectorAll("button, a[href], [role='button']");
          interactive.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40)) {
              const text = (el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 40);
              results.push(`"${text}" ${Math.round(rect.width)}x${Math.round(rect.height)}`);
            }
          });
          return results.slice(0, 10);
        });
        if (smallTargets.length) log(vp, route, "SMALL_TARGET", smallTargets.join(" | "));
      }

      // ── Text below 14px ─────────────────────────────────────────────────────
      if (vp.name === "mobile") {
        const tinyText = await page.evaluate(() => {
          const results = [];
          document.querySelectorAll("p, span, label, li, td, th, a").forEach((el) => {
            const size = parseFloat(getComputedStyle(el).fontSize);
            if (size > 0 && size < 13 && el.textContent?.trim().length > 0) {
              const text = (el.textContent ?? "").trim().slice(0, 40);
              results.push(`"${text}" (${size}px)`);
            }
          });
          return results.slice(0, 8);
        });
        if (tinyText.length) log(vp, route, "TINY_TEXT", tinyText.join(" | "));
      }

      // ── Search input font-size on mobile (must be 16px to avoid iOS zoom) ───
      if (vp.name === "mobile") {
        const searchFontSize = await page.evaluate(() => {
          const inp = document.querySelector("input[type='search']");
          return inp ? parseFloat(getComputedStyle(inp).fontSize) : null;
        });
        if (searchFontSize !== null && searchFontSize < 16) {
          log(vp, route, "IOS_ZOOM_RISK", `Search input font-size ${searchFontSize}px < 16px`);
        }
      }
    }

    await ctx.close();
  }

  await browser.close();

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════");
  if (issues.length === 0) {
    console.log("✅  No responsive issues found.");
  } else {
    console.log(`⚠️  ${issues.length} issue(s) found:\n`);
    issues.forEach((i, n) =>
      console.log(`  ${n + 1}. [${i.viewport}] ${i.page} › ${i.type}\n     ${i.detail}\n`)
    );
  }

  writeFileSync(`${OUT}/report.json`, JSON.stringify(issues, null, 2));
  console.log(`\nScreenshots + report saved to ${OUT}/`);
})();

/**
 * Suite Name: Homepage Lighthouse Audits
 * Purpose: Audit the representative in-scope NUHS+ Homepage in desktop and mobile emulation.
 * Coverage Scope: Homepage ownership; Homepage only, with the two profiles specified in website-test-plan.md.
 * Covered Features: Lighthouse performance, accessibility, best-practices, and SEO scores.
 * Covered User Journeys: Load the representative Homepage and evaluate its rendered experience for each planned device profile.
 * Run Entire Suite: npx playwright test -c playwright.lighthouse.config.ts
 * Run Spec: npx playwright test -c playwright.lighthouse.config.ts tests/lighthouse/homepage-lighthouse.spec.ts
 * Run Test: npx playwright test -c playwright.lighthouse.config.ts tests/lighthouse/homepage-lighthouse.spec.ts -g "T1 Desktop Homepage Lighthouse"
 * Headed Run: npx playwright test -c playwright.lighthouse.config.ts tests/lighthouse/homepage-lighthouse.spec.ts --headed
 * Report: npx playwright show-report playwright-report/lighthouse
 */

import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Page } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { LIGHTHOUSE_SCORE_THRESHOLDS, LIGHTHOUSE_SITE_URL } from '../../playwright.lighthouse.config';
import { captureEvidence, dismissBlockingPopup, expect, test } from '../support/helper';

const CDP_PORT = 9222;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;

async function prepareHomepageForAudit(page: Page): Promise<void> {
  const main = page.getByRole('main');
  await expect(main).toBeVisible();
  await expect(main.locator('.featured-slider .slick-slide.slick-current a[href]')).toBeVisible();
  await expect(main.locator('.podcast-slider .slick-slide:not(.slick-cloned) a[href]').first()).toBeVisible();

  const viewport = page.viewportSize();
  if (!viewport) {
    throw new Error('The Homepage Lighthouse profile must define a viewport.');
  }
  const scrollStep = Math.floor(viewport.height * 0.75);
  let scrollY = await page.evaluate(() => window.scrollY);
  while (true) {
    await page.mouse.wheel(0, scrollStep);
    await dismissBlockingPopup(page);
    let nextScrollY = await page.evaluate(() => window.scrollY);
    if (nextScrollY <= scrollY) {
      await page.mouse.wheel(0, scrollStep);
      await dismissBlockingPopup(page);
      nextScrollY = await page.evaluate(() => window.scrollY);
      if (nextScrollY <= scrollY) {
        break;
      }
    }
    scrollY = nextScrollY;
  }

  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await dismissBlockingPopup(page);
  await expect
    .poll(() =>
      main.locator('img').evaluateAll((images) =>
        images
          .filter((image) => {
            const slide = image.closest('.slick-slide');
            return !slide || slide.classList.contains('slick-current');
          })
          .every((image) => {
            const img = image as HTMLImageElement;
            return img.complete && img.naturalWidth > 0;
          }),
      ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(main.locator('.featured-slider .slick-slide.slick-current a[href]')).toBeVisible();
  await dismissBlockingPopup(page);
  await expect
    .poll(() =>
      page.locator('.modal-backdrop').evaluateAll((backdrops) =>
        backdrops.every((backdrop) => Number(getComputedStyle(backdrop).opacity) <= 0.01),
      ),
    )
    .toBe(true);
}

const profiles = [
  {
    id: 'T1',
    name: 'Desktop',
    viewport: { width: 1365, height: 900 },
    lighthouseOptions: {
      formFactor: 'desktop' as const,
      screenEmulation: { mobile: false, width: 1365, height: 900, deviceScaleFactor: 1, disabled: true },
    },
  },
  {
    id: 'T2',
    name: 'Mobile',
    viewport: { width: 390, height: 844 },
    lighthouseOptions: {
      formFactor: 'mobile' as const,
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
    },
  },
] as const;

test.describe('Homepage Lighthouse Audits', () => {
  for (const profile of profiles) {
    test(`${profile.id} ${profile.name} Homepage Lighthouse thresholds`, async ({ page }, testInfo) => {
      await page.setViewportSize(profile.viewport);
      await page.goto(LIGHTHOUSE_SITE_URL);
      await prepareHomepageForAudit(page);
      await captureEvidence(page, testInfo, profile.id, `${profile.name}-Homepage-Before-Audit`);

      const reportName = `nuhs-homepage-${profile.name.toLowerCase()}`;
      const reportDirectory = testInfo.outputPath('lighthouse-reports');
      await mkdir(reportDirectory, { recursive: true });

      const result = await playAudit({
        page,
        port: CDP_PORT,
        thresholds: LIGHTHOUSE_SCORE_THRESHOLDS,
        opts: profile.lighthouseOptions,
        ignoreError: true,
        reports: {
          formats: { html: true, json: true },
          name: reportName,
          directory: reportDirectory,
        },
      });

      const htmlPath = resolve(reportDirectory, `${reportName}.html`);
      const jsonPath = resolve(reportDirectory, `${reportName}.json`);
      await testInfo.attach(`${profile.id}-Lighthouse-HTML-Report`, {
        path: htmlPath,
        contentType: 'text/html',
      });
      await testInfo.attach(`${profile.id}-Lighthouse-JSON-Report`, {
        path: jsonPath,
        contentType: 'application/json',
      });

      const reportJson = JSON.parse(await readFile(jsonPath, 'utf8')) as {
        categories?: Record<string, { score?: number | null }>;
      };
      const scores = Object.fromEntries(
        CATEGORIES.map((category) => {
          const score = reportJson.categories?.[category]?.score;
          if (typeof score !== 'number') {
            throw new Error(`${category} score is missing from the Lighthouse report.`);
          }
          return [category, score * 100];
        }),
      );
      await testInfo.attach(`${profile.id}-Lighthouse-Scores`, {
        body: Buffer.from(
          JSON.stringify(
            {
              page: LIGHTHOUSE_SITE_URL,
              profile: profile.name,
              thresholds: LIGHTHOUSE_SCORE_THRESHOLDS,
              scores,
              thresholdComparison: result.comparisonError ?? 'All configured thresholds met.',
              reports: [htmlPath, jsonPath],
            },
            null,
            2,
          ),
        ),
        contentType: 'application/json',
      });

      for (const category of CATEGORIES) {
        expect.soft(scores[category], `${category} Lighthouse score`).toBeGreaterThanOrEqual(
          LIGHTHOUSE_SCORE_THRESHOLDS[category],
        );
      }
      await captureEvidence(page, testInfo, profile.id, `${profile.name}-Homepage-Audit-Complete`);
    });
  }
});

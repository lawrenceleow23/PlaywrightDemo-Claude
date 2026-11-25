/**
 * Suite Name: Shared Site Shell
 * Purpose: Validate the shared NUHS+ header, navigation, search, text sizing, and footer journeys.
 * Coverage Scope: Shared Site Shell ownership from website-test-plan.md; desktop and mobile profiles only.
 * Covered Features: Primary navigation, About Us submenu, logo, sticky header, text-size control, search, subscription, footer links, and responsive footer layout.
 * Covered User Journeys: Navigate from the Homepage, search for a keyword, open specified shared destinations, and use shell controls on desktop/mobile.
 * Run Entire Suite: npx playwright test
 * Run Spec: npx playwright test tests/functional/shared-site-shell.spec.ts
 * Run Test: npx playwright test tests/functional/shared-site-shell.spec.ts -g "T1 Desktop primary navigation"
 * Headed Run: npx playwright test tests/functional/shared-site-shell.spec.ts --headed
 * Report: npx playwright show-report
 */

import {
  expect,
  test,
  captureEvidence,
  captureNetworkActivity,
  clickWithPopupDismissal,
  dismissBlockingPopup,
} from '../support/helper';

const SITE_ORIGIN = 'https://websparks-stg.sitefinity.cloud';
const HOME_URL = `${SITE_ORIGIN}/home`;
const ENTITY_LINKS = [
  'National University Hospital',
  'Ng Teng Fong General Hospital',
  'Alexandra Hospital',
  'Jurong Community Hospital',
  'National University Polyclinics',
  'Jurong Medical Centre',
  'National University Cancer Institute Singapore',
  'National University Heart Centre Singapore',
  'National University Centre for Oral Health Singapore',
  'NUHS Diagnostics',
  'NUHS Pharmacy',
  'National University of Singapore - Yong Loo Lin School of Medicine',
  'National University of Singapore - Faculty of Dentistry',
  'National University of Singapore - Saw Swee Hock School of Public Health',
];

test.describe('Shared Site Shell', () => {
  test('T1 Desktop primary navigation and sticky header', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const navigation = page.getByRole('navigation');
    const links = [
      ['NEWS', '/home#news'],
      ['LIFESTYLE', '/home#lifestyle'],
      ['SCIENCE', '/home#science'],
      ['PEOPLE', '/home#people'],
      ['MULTIMEDIA', '/home#multimedia'],
      ['MEDIPEDIA', '/medipedia'],
    ] as const;

    for (const [label, href] of links) {
      await expect(navigation.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    }

    for (const [label, hash] of links.slice(0, 5)) {
      await navigation.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
      await dismissBlockingPopup(page);
    }

    const header = page.getByRole('banner');
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await dismissBlockingPopup(page);
    await expect.poll(async () => Math.round((await header.boundingBox())?.y ?? Number.NaN)).toBe(0);
    await captureEvidence(page, testInfo, 'T1', 'Desktop-Navigation-Sticky-Header');
  });

  test('T2 Desktop About Us submenu reaches both destination types', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    await page.getByText('ABOUT US', { exact: true }).hover();

    const navigation = page.getByRole('navigation');
    const nuhsPlusLink = navigation.getByRole('link', { name: 'NUHS+', exact: true });
    const nuhsLink = navigation.getByRole('link', { name: 'NUHS', exact: true });
    await expect(nuhsPlusLink).toBeVisible();
    await expect(nuhsLink).toBeVisible();
    await nuhsPlusLink.click();
    await expect(page).toHaveURL(/\/about-us\/nuhsplus(?:$|[?#])/);

    await page.goto(HOME_URL);
    await page.getByText('ABOUT US', { exact: true }).hover();
    const [nuhsPage] = await Promise.all([page.waitForEvent('popup'), nuhsLink.click()]);
    await expect.poll(() => nuhsPage.url()).toContain('/about-us/nuhs');
    await captureEvidence(page, testInfo, 'T2', 'About-Us-Destinations');
    await nuhsPage.close();
  });

  test('T3 Logo returns from search results to the Homepage', async ({ page }, testInfo) => {
    await page.goto(`${SITE_ORIGIN}/generalSearch/?keyword=rehabilitation`);
    await page.getByRole('link', { name: 'NUHS Logo', exact: true }).click();
    await expect(page).toHaveURL(/\/home(?:$|[?#])/);
    await captureEvidence(page, testInfo, 'T3', 'Homepage-Reached-From-Logo');
  });

  test('T4 Text-size choices produce relative visible changes', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const contentText = page.locator('main p:visible').first();
    const size = async (): Promise<number> =>
      Number.parseFloat(await contentText.evaluate((element) => getComputedStyle(element).fontSize));

    const defaultSize = await size();
    const smallOption = page.locator('.font-resizer [data-size="0.92"]');
    const defaultOption = page.locator('.font-resizer [data-size="1"]');
    const largeOption = page.locator('.font-resizer [data-size="1.18"]');

    await smallOption.click();
    await expect(smallOption).toHaveAttribute('data-size-active', 'true');
    await expect.poll(size).toBeLessThan(defaultSize);

    await defaultOption.click();
    await expect(defaultOption).toHaveAttribute('data-size-active', 'true');
    await expect.poll(size).toBeCloseTo(defaultSize, 1);

    await largeOption.click();
    await expect(largeOption).toHaveAttribute('data-size-active', 'true');
    await expect.poll(size).toBeGreaterThan(defaultSize);
    await captureEvidence(page, testInfo, 'T4', 'Large-Text-Size-State');
  });

  test('T5 Search textbox uses the specified placeholder', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const search = page.locator('#generalSearch');
    if (!(await search.isVisible())) {
      await page.getByRole('button', { name: /search toggler/i }).click();
    }
    await expect(search).toBeVisible();
    await expect(search).toHaveAttribute('placeholder', 'Search keyword or topic');
    await captureEvidence(page, testInfo, 'T5', 'Search-Placeholder');
  });

  test('T6 Header search submits a keyword and reaches search results', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const search = page.locator('#generalSearch');
    if (!(await search.isVisible())) {
      await page.getByRole('button', { name: /search toggler/i }).click();
    }

    const activity = await captureNetworkActivity(page, testInfo, 'T6', async () => {
      await search.fill('rehabilitation');
      await search.press('Enter');
      await expect(page).toHaveURL(/\/generalSearch\/\?keyword=rehabilitation/i);
      await expect(page).toHaveTitle(/Results/i);
    });
    expect(activity.length).toBeGreaterThan(0);
    await captureEvidence(page, testInfo, 'T6', 'Search-Results');
  });

  test('T7 Subscribe now opens the observed external subscription form', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const subscribeLink = page.getByRole('banner').getByRole('link', { name: /subscribe now/i });
    await expect(subscribeLink).toHaveAttribute('target', '_blank');
    await subscribeLink.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    const [subscriptionPage] = await Promise.all([
      page.waitForEvent('popup'),
      clickWithPopupDismissal(page, subscribeLink),
    ]);
    await expect.poll(() => subscriptionPage.url()).toContain('form.gov.sg');
    await captureEvidence(page, testInfo, 'T7', 'Subscription-Destination');
    await subscriptionPage.close();
  });

  test('T8 Footer entity links are grouped into three desktop columns', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    const lists = footer.locator('ul');
    await expect(footer).toBeAttached();
    expect(await lists.count()).toBeGreaterThanOrEqual(3);

    const firstThree = [lists.nth(0), lists.nth(1), lists.nth(2)];
    for (const list of firstThree) {
      await expect(list.locator('a[href]').first()).toBeAttached();
    }

    const boxes = await Promise.all(firstThree.map((list) => list.boundingBox()));
    expect(boxes.every((box) => box !== null)).toBe(true);
    expect(boxes[0]!.x).toBeLessThan(boxes[1]!.x);
    expect(boxes[1]!.x).toBeLessThan(boxes[2]!.x);
    expect(boxes[0]!.y).toBeCloseTo(boxes[1]!.y, 0);
    expect(boxes[1]!.y).toBeCloseTo(boxes[2]!.y, 0);

    for (const label of ENTITY_LINKS) {
      await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute('target', '_blank');
    }
    await captureEvidence(page, testInfo, 'T8', 'Footer-Entity-Columns');
  });

  test('T9 Footer legal link uses the specified Privacy Policy label', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    const privacyLink = footer.getByRole('link', { name: 'Privacy Policy', exact: true });
    await expect(privacyLink).toBeVisible();
    await captureEvidence(page, testInfo, 'T9', 'Footer-Legal-Link');
  });

  test('T10 Footer About NUHS and legal links reach their observed destinations', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await clickWithPopupDismissal(page, footer.getByRole('link', { name: 'About NUHS', exact: true }));
    await expect(page).toHaveURL(/\/about-us\/nuhs(?:$|[?#])/);

    await page.goto(HOME_URL);
    const termsLink = footer.locator('a[href="https://www.nuhs.edu.sg/Pages/terms-of-use.aspx"]');
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await expect(termsLink).toHaveAttribute('target', '_blank');
    const [termsPage] = await Promise.all([page.waitForEvent('popup'), clickWithPopupDismissal(page, termsLink)]);
    await expect.poll(() => termsPage.url()).toMatch(/\/terms-of-use(?:$|[?#])/);
    await captureEvidence(page, testInfo, 'T10', 'Footer-Destination-Types');
    await termsPage.close();
  });

  test('T11 Footer entity and social links open new tabs at their linked destinations', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    const entityLink = footer.getByRole('link', { name: 'National University Hospital', exact: true });
    const [entityPage] = await Promise.all([
      page.waitForEvent('popup'),
      clickWithPopupDismissal(page, entityLink),
    ]);
    await expect.poll(() => entityPage.url()).toContain('nuh.com.sg');
    await entityPage.close();

    const linkedInLink = footer.locator('a[aria-label="linkedin"]');
    const [socialPage] = await Promise.all([
      page.waitForEvent('popup'),
      clickWithPopupDismissal(page, linkedInLink),
    ]);
    await expect.poll(() => socialPage.url()).toContain('linkedin.com');
    await captureEvidence(page, testInfo, 'T11', 'Footer-External-Destinations');
    await socialPage.close();
  });

  test('T12 Header social links open the corresponding external destinations', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const header = page.getByRole('banner');
    const destinations = [
      ['facebook', 'facebook.com'],
      ['instagram', 'instagram.com'],
      ['linkedin', 'linkedin.com'],
    ] as const;

    await captureEvidence(page, testInfo, 'T12', 'Header-Social-Links');

    for (const [label, host] of destinations) {
      const socialLink = header.getByRole('link', { name: label, exact: true });
      await expect(socialLink).toHaveAttribute('target', '_blank');
      const [socialPage] = await Promise.all([
        page.waitForEvent('popup'),
        clickWithPopupDismissal(page, socialLink),
      ]);
      await expect.poll(() => socialPage.url()).toContain(host);
      await socialPage.close();
    }
  });

  test('T13 @mobile Mobile navigation exposes its specified destinations and controls', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const menuToggle = page.getByRole('button', { name: 'menu toggler' });
    const header = page.getByRole('banner');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    const navigation = page.getByRole('navigation');
    await expect(navigation.getByRole('link', { name: 'HOME', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'NEWS', exact: true })).toBeVisible();
    await expect(header.getByRole('textbox')).toBeVisible();
    for (const label of ['facebook', 'instagram', 'linkedin']) {
      await expect.soft(header.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await page.getByText('ABOUT US', { exact: true }).click();
    await expect(navigation.getByRole('link', { name: 'NUHS', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'NUHS+', exact: true })).toBeVisible();
    await captureEvidence(page, testInfo, 'T13', 'Mobile-Navigation-Open');
  });

  test('T14 @mobile Mobile sticky header and footer use the planned layout', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const header = page.getByRole('banner');
    const menuToggle = page.getByRole('button', { name: 'menu toggler' });
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await dismissBlockingPopup(page);
    await expect(header.getByRole('link', { name: 'NUHS Logo', exact: true })).toBeVisible();
    await expect(header.locator('.font-resizer')).toBeVisible();
    await expect(menuToggle).toBeVisible();
    await expect(page.getByRole('textbox').first()).toBeVisible();
    await expect.poll(async () => Math.round((await header.boundingBox())?.y ?? Number.NaN)).toBe(0);

    const footer = page.getByRole('contentinfo');
    const lists = footer.locator('ul').filter({ has: page.locator('a[href]') });
    const firstThree = [lists.nth(0), lists.nth(1), lists.nth(2)];
    const boxes = await Promise.all(firstThree.map((list) => list.boundingBox()));
    expect(boxes.every((box) => box !== null)).toBe(true);
    expect(boxes[0]!.y).toBeLessThan(boxes[1]!.y);
    expect(boxes[1]!.y).toBeLessThan(boxes[2]!.y);
    await footer.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await captureEvidence(page, testInfo, 'T14', 'Mobile-Sticky-Shell-And-Footer');
  });

  test('T15 @mobile Mobile header search submits a keyword', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const search = page.locator('input[placeholder]').first();
    if (!(await search.isVisible())) {
      const searchToggle = page.locator('button[aria-label*="search"]:visible').first();
      await expect(searchToggle).toBeVisible();
      await searchToggle.click();
    }
    await expect(search).toBeVisible();

    const activity = await captureNetworkActivity(page, testInfo, 'T15', async () => {
      await search.fill('rehabilitation');
      await search.press('Enter');
      await expect(page).toHaveURL(/\/generalSearch\/\?keyword=rehabilitation/i);
      await expect(page).toHaveTitle(/Results/i);
    });
    expect(activity.length).toBeGreaterThan(0);
    await captureEvidence(page, testInfo, 'T15', 'Mobile-Search-Results');
  });
});

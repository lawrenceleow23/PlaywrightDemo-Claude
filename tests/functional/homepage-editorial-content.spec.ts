/**
 * Suite Name: Homepage Editorial Content
 * Purpose: Validate the NUHS+ Homepage modules, content journeys, and responsive states.
 * Coverage Scope: Homepage Editorial Content ownership from website-test-plan.md; desktop and mobile only.
 * Covered Features: Featured Stories, Highlight Story, Image & Standfirst, Load More, Podcast, Back to Top, and Homepage metadata.
 * Covered User Journeys: Browse Homepage stories, expand articles, use Podcast navigation, and return to the top.
 * Run Entire Suite: npx playwright test
 * Run Spec: npx playwright test tests/functional/homepage-editorial-content.spec.ts
 * Run Test: npx playwright test tests/functional/homepage-editorial-content.spec.ts -g "T1 Featured Stories inventory"
 * Headed Run: npx playwright test tests/functional/homepage-editorial-content.spec.ts --headed
 * Report: npx playwright show-report
 */

import {
  captureEvidence,
  captureNetworkActivity,
  clickWithPopupDismissal,
  dismissBlockingPopup,
  expect,
  test,
  waitForCarouselToSettle,
} from '../support/helper';

const SITE_ORIGIN = 'https://websparks-stg.sitefinity.cloud';
const HOME_URL = `${SITE_ORIGIN}/home`;

test.describe('Homepage Editorial Content', () => {
  test('T1 Featured Stories inventory has five items and one active story', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const slider = page.locator('.featured-slider');
    const stories = slider.locator('.slick-slide:not(.slick-cloned)');
    await expect(stories).toHaveCount(5);
    await expect(slider.locator('.slick-slide.slick-current')).toHaveCount(1);
    await expect(slider.locator('.slick-slide.slick-current a[href]').first()).toBeVisible();
    await captureEvidence(page, testInfo, 'T1', 'Featured-Stories-Initial-State');
  });

  test('T2 Featured Stories arrows change the active story', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const slider = page.locator('.featured-slider');
    await slider.hover();
    const activeStory = (): Promise<string | null> =>
      slider.locator('.slick-slide.slick-current').getAttribute('data-slick-index');
    const beforeNextStory = await activeStory();
    await captureEvidence(page, testInfo, 'T2', 'Featured-Stories-Before-Arrows');

    await captureNetworkActivity(page, testInfo, 'T2-Featured-Next', () =>
      clickWithPopupDismissal(page, page.getByRole('button', { name: 'Next', exact: true })),
    );
    await expect.poll(activeStory).not.toBe(beforeNextStory);
    await waitForCarouselToSettle(slider);
    await captureEvidence(page, testInfo, 'T2', 'Featured-Stories-After-Next');

    const beforePreviousStory = await activeStory();
    await captureNetworkActivity(page, testInfo, 'T2-Featured-Previous', () =>
      clickWithPopupDismissal(page, page.getByRole('button', { name: 'Previous', exact: true })),
    );
    await expect.poll(activeStory).not.toBe(beforePreviousStory);
    await waitForCarouselToSettle(slider);
    expect(await activeStory()).toBe(beforeNextStory);
    await captureEvidence(page, testInfo, 'T2', 'Featured-Stories-After-Previous');
  });

  test('T3 Featured Stories automatically rotate to another active story', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const slider = page.locator('.featured-slider');
    const activeStory = (): Promise<string | null> =>
      slider.locator('.slick-slide.slick-current').getAttribute('data-slick-index');
    await captureEvidence(page, testInfo, 'T3', 'Featured-Stories-Before-Auto-Rotation');
    const initialStory = await activeStory();

    await expect.poll(activeStory, { timeout: 12_000 }).not.toBe(initialStory);
    await captureEvidence(page, testInfo, 'T3', 'Featured-Stories-After-Auto-Rotation');
  });

  test('T4 Featured Story opens an article-like destination in the same tab', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const featuredStory = page.locator('.featured-slider .slick-slide.slick-current a[href]').first();
    await expect(featuredStory).toBeVisible();
    await clickWithPopupDismissal(page, featuredStory);
    await expect(page).toHaveURL(/\/(?:article|stories)\/[^/?#]+/);
    await captureEvidence(page, testInfo, 'T4', 'Featured-Story-Destination');
  });

  test('T5 Highlight Story presents two stories and opens a representative destination', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const highlights = page.locator('main > section:nth-of-type(2) .highlights');
    const cards = highlights.locator('a[href]');
    await expect(cards).toHaveCount(2);
    for (const card of await cards.all()) {
      await expect(card.locator('img')).toBeVisible();
      await expect(card).toContainText(/\S/);
    }

    await highlights.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await clickWithPopupDismissal(page, cards.first());
    await expect(page).toHaveURL(/\/(?:article|stories)\/[^/?#]+/);
    await captureEvidence(page, testInfo, 'T5', 'Highlight-Story-Destination');
  });

  test('T6 Image & Standfirst starts with three cards and opens an article', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const cards = page.locator('.general-list a[href]');
    await expect(cards).toHaveCount(3);
    await expect(cards.first().locator('img')).toBeVisible();
    await cards.first().scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await clickWithPopupDismissal(page, cards.first());
    await expect(page).toHaveURL(/\/(?:article|stories)\/[^/?#]+/);
    await captureEvidence(page, testInfo, 'T6', 'Initial-Image-And-Standfirst-Article');
  });

  test('T7 Load More adds six cards, captures its response, and reaches a new article', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const cards = page.locator('.general-list a[href]');
    const loadMore = page.getByRole('button', { name: /load more/i });
    await expect(cards).toHaveCount(3);
    await expect(loadMore).toBeVisible();
    await loadMore.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);

    const activity =     await captureNetworkActivity(page, testInfo, 'T7', async () => {
      await clickWithPopupDismissal(page, loadMore);
      await expect(cards).toHaveCount(9);
      await expect(loadMore).toBeHidden();
    });
    const dynamicResponses = activity.filter(
      (request) => (request.resourceType === 'xhr' || request.resourceType === 'fetch') && request.response,
    );
    expect(dynamicResponses.length).toBeGreaterThan(0);
    expect(dynamicResponses.some((request) => request.response!.status >= 200 && request.response!.status < 300)).toBe(
      true,
    );
    await captureEvidence(page, testInfo, 'T7', 'Load-More-Expanded-State');

    await cards.nth(8).scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await clickWithPopupDismissal(page, cards.nth(8));
    await expect(page).toHaveURL(/\/(?:article|stories)\/[^/?#]+/);
    await captureEvidence(page, testInfo, 'T7', 'Newly-Loaded-Article-Destination');
  });

  test('T8 Podcast inventory does not exceed the specified maximum of six', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const podcastCards = page.locator('.podcast-slider .slick-slide:not(.slick-cloned) a[href]');
    expect(await podcastCards.count()).toBeLessThanOrEqual(6);
    await captureEvidence(page, testInfo, 'T8', 'Podcast-Inventory');
  });

  test('T9 Podcast title opens search results in a new tab with the podcast query', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const podcastTitle = page.getByRole('main').getByRole('link', { name: 'Podcast', exact: true });
    await expect(podcastTitle).toHaveAttribute('target', '_blank');
    await podcastTitle.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    const [resultsPage] = await Promise.all([
      page.waitForEvent('popup'),
      clickWithPopupDismissal(page, podcastTitle),
    ]);
    await expect.poll(() => resultsPage.url()).toMatch(/\/generalSearch\/\?keyword=podcast/i);
    await expect(resultsPage).toHaveTitle(/Results/i);
    await captureEvidence(page, testInfo, 'T9', 'Podcast-Search-Destination');
    await resultsPage.close();
  });

  test('T10 Podcast arrows change the visible article set', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const podcast = page.locator('.podcast-container');
    const slider = podcast.locator('.podcast-slider');
    await slider.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await slider.hover();
    await waitForCarouselToSettle(slider);
    const activeItem = (): Promise<string | null> =>
      slider.locator('.slick-slide.slick-current').getAttribute('data-slick-index');
    const visibleArticles = (): Promise<string[]> =>
      slider
        .locator('.slick-slide.slick-active:not(.slick-cloned) a[href]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute('href'))
            .filter((href): href is string => href !== null),
        );
    const initialVisibleArticles = await visibleArticles();
    await captureEvidence(page, testInfo, 'T10', 'Podcast-Before-Arrows');

    const beforeNextItem = await activeItem();
    await captureNetworkActivity(page, testInfo, 'T10-Podcast-Next', () =>
      clickWithPopupDismissal(page, podcast.locator('.slider-button.slider-next')),
    );
    await expect.poll(activeItem).not.toBe(beforeNextItem);
    await waitForCarouselToSettle(slider);
    const nextVisibleArticles = await visibleArticles();
    expect(nextVisibleArticles).not.toEqual(initialVisibleArticles);
    await captureEvidence(page, testInfo, 'T10', 'Podcast-After-Next');

    const beforePreviousItem = await activeItem();
    const beforePreviousArticles = await visibleArticles();
    await captureNetworkActivity(page, testInfo, 'T10-Podcast-Previous', () =>
      clickWithPopupDismissal(page, podcast.locator('.slider-button.slider-prev')),
    );
    await expect.poll(activeItem).not.toBe(beforePreviousItem);
    await waitForCarouselToSettle(slider);
    const previousVisibleArticles = await visibleArticles();
    expect(previousVisibleArticles).not.toEqual(beforePreviousArticles);
    expect(previousVisibleArticles).toEqual(initialVisibleArticles);
    await captureEvidence(page, testInfo, 'T10', 'Podcast-After-Previous');
  });

  test('T11 Podcast article opens its recorded destination route', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const article = page.locator('.podcast-slider .slick-slide.slick-current a[href]').first();
    await expect(article).toBeVisible();
    await article.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    await clickWithPopupDismissal(page, article);
    await expect(page).toHaveURL(/\/(?:article|stories)\/[^/?#]+/);
    await captureEvidence(page, testInfo, 'T11', 'Podcast-Article-Destination');
  });

  test('T12 Back to Top appears after scrolling and returns the Homepage to its top', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const backToTop = page.locator('#scrollToTop');
    await expect(backToTop).toBeHidden();
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await dismissBlockingPopup(page);
    await expect(backToTop).toBeVisible();
    await clickWithPopupDismissal(page, backToTop);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(backToTop).toBeHidden();
    await captureEvidence(page, testInfo, 'T12', 'Returned-To-Top');
  });

  test('T13 Homepage records exploratory SEO metadata findings', async ({ page, browserName }, testInfo) => {
    await page.goto(HOME_URL);
    const metadata = await page.evaluate(() => {
      const descriptions = [...document.querySelectorAll<HTMLMetaElement>('meta[name="description"]')].map(
        (meta) => meta.content,
      );
      const canonicals = [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')].map(
        (link) => link.href,
      );
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((heading) => heading.tagName);
      const headingLevels = headings.map((heading) => Number(heading.slice(1)));
      const openGraph = [...document.querySelectorAll<HTMLMetaElement>('meta[property^="og:"]')].map((meta) => ({
        property: meta.getAttribute('property'),
        content: meta.content,
      }));
      const twitter = [...document.querySelectorAll<HTMLMetaElement>('meta[name^="twitter:"]')].map((meta) => ({
        name: meta.name,
        content: meta.content,
      }));
      const images = [...document.images];
      const duplicateMetadata = (keys: Array<string | null>): string[] => {
        const presentKeys = keys.filter((key): key is string => Boolean(key));
        return [...new Set(presentKeys.filter((key, index) => presentKeys.indexOf(key) !== index))];
      };
      return {
        title: document.title,
        descriptions,
        canonicals,
        headings,
        headingLevels,
        headingOrderValid: headingLevels.every(
          (level, index) => index === 0 || level <= headingLevels[index - 1] + 1,
        ),
        openGraph,
        twitter,
        imageCount: images.length,
        imagesMissingAlt: images.filter((image) => !image.hasAttribute('alt')).length,
        imagesWithEmptyAlt: images.filter((image) => image.hasAttribute('alt') && !image.alt.trim()).length,
        emptyOpenGraph: openGraph.filter((tag) => !tag.content.trim()).map((tag) => tag.property),
        duplicateOpenGraph: duplicateMetadata(openGraph.map((tag) => tag.property)),
        emptyTwitter: twitter.filter((tag) => !tag.content.trim()).map((tag) => tag.name),
        duplicateTwitter: duplicateMetadata(twitter.map((tag) => tag.name)),
      };
    });

    const findings: string[] = [];
    if (!metadata.title.trim()) findings.push('Document title is missing or empty.');
    if (metadata.descriptions.length === 0 || !metadata.descriptions.some((description) => description.trim())) {
      findings.push('Meta description is missing or empty.');
    }
    if (metadata.descriptions.length > 1) findings.push('Meta description is duplicated.');
    if (metadata.canonicals.length === 0 || !metadata.canonicals.some((canonical) => canonical.trim())) {
      findings.push('Canonical URL is missing or empty.');
    }
    if (metadata.canonicals.length > 1) findings.push('Canonical URL is duplicated.');
    if (metadata.headings[0] !== 'H1') findings.push('Heading structure does not begin with H1.');
    if (metadata.headingLevels.filter((level) => level === 1).length !== 1) {
      findings.push('Heading structure does not contain exactly one H1.');
    }
    if (!metadata.headingOrderValid) findings.push('Heading levels skip a rank.');
    if (metadata.openGraph.length === 0) findings.push('Open Graph metadata is missing.');
    if (metadata.emptyOpenGraph.length > 0) findings.push('Open Graph metadata contains empty values.');
    if (metadata.duplicateOpenGraph.length > 0) findings.push('Open Graph metadata contains duplicate properties.');
    if (metadata.twitter.length === 0) findings.push('Twitter metadata is missing.');
    if (metadata.emptyTwitter.length > 0) findings.push('Twitter metadata contains empty values.');
    if (metadata.duplicateTwitter.length > 0) findings.push('Twitter metadata contains duplicate names.');
    if (metadata.imagesMissingAlt > 0) findings.push('Images are missing alt attributes.');
    if (metadata.imagesWithEmptyAlt > 0) findings.push('Images have empty alt text.');

    await testInfo.attach('T13-Homepage-SEO-Observations.json', {
      body: Buffer.from(JSON.stringify({ url: page.url(), browserName, metadata, findings }, null, 2)),
      contentType: 'application/json',
    });
    for (const finding of findings) {
      testInfo.annotations.push({ type: 'seo-finding', description: finding });
    }
    await captureEvidence(page, testInfo, 'T13', 'Homepage-Metadata-And-Images');
  });

  test('T14 @mobile Featured Story image is approximately square on mobile', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const image = page.locator('.featured-slider .slick-slide.slick-current img').first();
    await expect(image).toBeVisible();
    const box = await image.boundingBox();
    expect(box).not.toBeNull();
    const aspectRatio = box!.width / box!.height;
    expect(aspectRatio).toBeGreaterThanOrEqual(0.75);
    expect(aspectRatio).toBeLessThanOrEqual(1.25);
    await captureEvidence(page, testInfo, 'T14', 'Mobile-Featured-Story-Crop');
  });

  test('T15 @mobile Highlight Stories remain readable in the mobile Standfirst layout', async ({ page }, testInfo) => {
    await page.goto(HOME_URL);
    const highlights = page.locator('main > section:nth-of-type(2) .highlights');
    const cards = highlights.locator('a[href]');
    await expect(cards).toHaveCount(2);
    await highlights.scrollIntoViewIfNeeded();
    await dismissBlockingPopup(page);
    for (const card of await cards.all()) {
      await expect(card).toBeVisible();
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('p').first()).toBeVisible();
    }
    await captureEvidence(page, testInfo, 'T15', 'Mobile-Highlight-Standfirst');
  });
});

import { writeFile } from 'node:fs/promises';
import type { Locator, Page, Request, TestInfo } from '@playwright/test';
import { test as base, expect } from '@playwright/test';

type RuntimeEvidenceFixtures = {
  runtimeEvidence: void;
};

type CapturedResponse = {
  status: number;
  statusText: string;
  contentType: string | null;
  durationMs: number | null;
  body?: string;
  bodyOmitted?: string;
  bodyError?: string;
};

export type CapturedRequest = {
  url: string;
  method: string;
  resourceType: string;
  postData: string | null;
  response?: CapturedResponse;
  failure?: string;
};

const PRIVATE_QUERY_KEYS = /token|secret|password|authorization|cookie|email|phone|key/i;
const PRIVATE_BODY_KEYS =
  /(["']?(?:access[_-]?token|refresh[_-]?token|password|secret|authorization|cookie|email|phone)["']?\s*:\s*)("[^"]*"|[^,\s}]+)/gi;
const EMAIL_PATTERN = /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g;
const MAX_BODY_CHARS = 12_000;

function safeText(value: string): string {
  return value
    .replace(PRIVATE_BODY_KEYS, '$1"[REDACTED]"')
    .replace(EMAIL_PATTERN, '[REDACTED_EMAIL]');
}

function safeUrl(value: string): string {
  const parsed = new URL(value);
  for (const key of parsed.searchParams.keys()) {
    if (PRIVATE_QUERY_KEYS.test(key)) {
      parsed.searchParams.set(key, '[REDACTED]');
    }
  }
  return parsed.toString();
}

function safeFilePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }
  return String(error);
}

export async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  identifier: string,
  label: string,
): Promise<void> {
  await dismissBlockingPopup(page);
  const name = `${identifier}-${safeFilePart(label)}`;
  const screenshotPath = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
}

export async function captureNetworkActivity(
  page: Page,
  testInfo: TestInfo,
  identifier: string,
  action: () => Promise<void>,
): Promise<CapturedRequest[]> {
  const records: CapturedRequest[] = [];
  const requestRecords = new Map<Request, CapturedRequest>();
  const startTimes = new Map<Request, number>();
  const pendingResponses: Promise<void>[] = [];
  const captureTypes = new Set(['document', 'fetch', 'xhr']);

  const onRequest = (request: Request): void => {
    if (!captureTypes.has(request.resourceType())) {
      return;
    }

    const record: CapturedRequest = {
      url: safeUrl(request.url()),
      method: request.method(),
      resourceType: request.resourceType(),
      postData: request.postData() ? safeText(request.postData()!) : null,
    };
    records.push(record);
    requestRecords.set(request, record);
    startTimes.set(request, Date.now());
  };

  const onResponse = (response: import('@playwright/test').Response): void => {
    const request = response.request();
    const record = requestRecords.get(request);
    if (!record) {
      return;
    }

    const pending = (async (): Promise<void> => {
      const contentType = response.headers()['content-type'] ?? null;
      const timing = request.timing();
      const captured: CapturedResponse = {
        status: response.status(),
        statusText: response.statusText(),
        contentType,
        durationMs: timing.responseEnd >= 0 ? timing.responseEnd : null,
      };

      if (request.resourceType() === 'document') {
        captured.bodyOmitted = 'Document bodies are excluded; response metadata is retained.';
      } else {
        try {
          const bytes = await response.body();
          const text = bytes.toString('utf8');
          if (contentType?.includes('json') || contentType?.startsWith('text/')) {
            const sanitized = safeText(text);
            captured.body =
              sanitized.length > MAX_BODY_CHARS
                ? `${sanitized.slice(0, MAX_BODY_CHARS)}\n[TRUNCATED; original length ${sanitized.length} characters]`
                : sanitized;
          } else {
            captured.bodyOmitted = `Body omitted for non-text content type ${contentType ?? '(unknown)'}.`;
          }
        } catch (error) {
          captured.bodyError = errorText(error);
        }
      }

      record.response = captured;
    })();
    pendingResponses.push(pending);
  };

  const onRequestFailed = (request: Request): void => {
    const record = requestRecords.get(request);
    if (record) {
      record.failure = request.failure()?.errorText ?? 'Request failed without an error message.';
    }
  };

  page.on('request', onRequest);
  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);

  let actionError: unknown;
  try {
    await action();
  } catch (error) {
    actionError = error;
  } finally {
    page.off('request', onRequest);
    page.off('response', onResponse);
    page.off('requestfailed', onRequestFailed);
    await Promise.all(pendingResponses);

    const outputPath = testInfo.outputPath(`${identifier}-network.json`);
    await writeFile(outputPath, JSON.stringify(records, null, 2), 'utf8');
    await testInfo.attach(`${identifier}-network`, {
      path: outputPath,
      contentType: 'application/json',
    });
  }

  if (actionError !== undefined) {
    throw actionError;
  }
  return records;
}

export async function waitForCarouselToSettle(slider: Locator): Promise<void> {
  const track = slider.locator('.slick-track');
  await expect(track).toBeAttached();
  await expect
    .poll(() =>
      track.evaluate((element) =>
        element
          .getAnimations()
          .every((animation) => animation.playState === 'finished' || animation.playState === 'idle'),
      ),
    )
    .toBe(true);
}

export async function dismissBlockingPopup(page: Page): Promise<void> {
  const popup = page.locator('#popUpBanner');

  await page.removeLocatorHandler(popup);
  try {
    if (await popup.isVisible()) {
      await closePopup(popup);
    }

    await expect(popup).toBeHidden();
  } finally {
    await page.addLocatorHandler(popup, () => closePopup(popup));
  }
}

async function closePopup(popup: Locator): Promise<void> {
  const closeButton = popup.getByRole('button', { name: 'Close' });
  await expect(closeButton).toBeVisible();
  await closeButton.click();
  await expect(popup).toBeHidden();
}

export async function clickWithPopupDismissal(page: Page, locator: Locator): Promise<void> {
  await dismissBlockingPopup(page);
  try {
    await locator.click({ timeout: 5_000 });
  } catch (error) {
    const popup = page.locator('#popUpBanner');
    if (!(await popup.isVisible())) {
      throw error;
    }
    await dismissBlockingPopup(page);
    await locator.click({ timeout: 5_000 });
  }
  await dismissBlockingPopup(page);
}

async function attachFailureEvidence(
  page: Page,
  testInfo: TestInfo,
  diagnostics: string[],
): Promise<void> {
  const identifier = safeFilePart(testInfo.title.split(' ')[0] ?? 'failure') || 'failure';
  const failurePath = testInfo.outputPath(`${identifier}-Failure.png`);
  let screenshotStatus = 'Captured and attached.';

  if (page.isClosed()) {
    screenshotStatus = 'Not captured: the page was already closed.';
  } else {
    try {
      await dismissBlockingPopup(page);
      await page.screenshot({ path: failurePath, fullPage: false });
      await testInfo.attach(`${identifier}-Failure`, {
        path: failurePath,
        contentType: 'image/png',
      });
    } catch (error) {
      screenshotStatus = `Not captured: ${errorText(error)}`;
    }
  }

  const failureDetails = {
    testIdentifier: identifier,
    title: testInfo.title,
    browser: testInfo.project.name,
    currentUrl: page.isClosed() ? 'Page closed before evidence collection.' : page.url(),
    timestamp: new Date().toISOString(),
    screenshotStatus,
    errors: testInfo.errors.map(({ message, stack }) => ({ message, stack })),
    diagnostics,
  };

  await testInfo.attach(`${identifier}-Failure-Details`, {
    body: Buffer.from(JSON.stringify(failureDetails, null, 2)),
    contentType: 'application/json',
  });
}

export const test = base.extend<RuntimeEvidenceFixtures>({
  runtimeEvidence: [
    async ({ page }, use, testInfo) => {
      const diagnostics: string[] = [];
      const popup = page.locator('#popUpBanner');
      await page.addLocatorHandler(popup, () => closePopup(popup));

      const onConsole = (message: import('@playwright/test').ConsoleMessage): void => {
        if (message.type() === 'error' || message.type() === 'warning') {
          diagnostics.push(`console.${message.type()}: ${safeText(message.text())}`);
        }
      };
      const onPageError = (error: Error): void => {
        diagnostics.push(`pageerror: ${safeText(errorText(error))}`);
      };
      const onRequestFailed = (request: Request): void => {
        diagnostics.push(
          `requestfailed: ${request.method()} ${safeUrl(request.url())} - ${request.failure()?.errorText ?? 'No error message.'}`,
        );
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      page.on('requestfailed', onRequestFailed);

      try {
        await use();
      } finally {
        page.off('console', onConsole);
        page.off('pageerror', onPageError);
        page.off('requestfailed', onRequestFailed);

        if (testInfo.status !== testInfo.expectedStatus) {
          await attachFailureEvidence(page, testInfo, diagnostics);
        }
      }
    },
    { auto: true },
  ],
});

export { expect };

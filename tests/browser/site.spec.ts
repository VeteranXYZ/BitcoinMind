import { expect, test } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/', '/primer', '/library', '/texts', '/toolkit', '/paths', '/frames',
  '/frames/1', '/frames/2', '/timeline', '/glossary', '/objections',
  '/stack', '/notes', '/questions', '/about',
];

test('mobile menu is modal, closes with Escape, and restores focus', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator('[data-menu-open]');
  await expect(opener).toHaveAccessibleName('Open menu');

  await opener.click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
  await expect(opener).toHaveAttribute('aria-expanded', 'true');
  await expect(opener).toHaveAccessibleName('Close menu');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeHidden();
  await expect(opener).toHaveAttribute('aria-expanded', 'false');
  await expect(opener).toHaveAccessibleName('Open menu');
  await expect(opener).toBeFocused();
});

test('resource filters keep one matching card and expose an empty state', async ({ page }) => {
  await page.goto('/library');
  const search = page.getByRole('searchbox', { name: 'Search library' });
  const cards = page.locator('[data-filter-card]:visible');

  await search.fill('Grokking Bitcoin');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Grokking Bitcoin');

  await search.fill('a resource that does not exist');
  await expect(cards).toHaveCount(0);
  await expect(page.getByText('No library items match this filter.')).toBeVisible();
});

test('resource filter types stay consistent and emit one analytics event', async ({ page }) => {
  await page.goto('/texts');
  await page.evaluate(() => {
    const testWindow = window as typeof window & {
      filterEventCount: number;
      BitcoinMindAnalytics: { track: () => void };
    };
    testWindow.filterEventCount = 0;
    testWindow.BitcoinMindAnalytics = {
      track: () => { testWindow.filterEventCount += 1; },
    };
  });

  await page.getByRole('button', { name: 'Reference', exact: true }).click();
  await expect(page.locator('#running-a-full-node')).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { filterEventCount: number }).filterEventCount)).toBe(1);
});

test('analytics is opt-in and never calls the production property from preview', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (/google(tagmanager|-analytics)\.com/.test(request.url())) googleRequests.push(request.url());
  });

  await page.goto('/');
  const preferences = page.getByRole('region', { name: 'Analytics preferences' });
  await expect(preferences).toBeVisible();
  await expect.poll(() => page.evaluate(() => {
    const analytics = (window as typeof window & {
      BitcoinMindAnalytics?: { consent: string; enabled: boolean; loaded: boolean };
    }).BitcoinMindAnalytics;
    return analytics && {
      consent: analytics.consent,
      enabled: analytics.enabled,
      loaded: analytics.loaded,
    };
  })).toEqual({ consent: 'denied', enabled: false, loaded: false });

  await page.getByRole('button', { name: 'Allow analytics' }).click();
  await expect(preferences).toBeHidden();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('bitcoinmind_analytics_consent'))).toBe('granted');
  await page.waitForTimeout(100);
  expect(googleRequests).toEqual([]);
  expect((await page.context().cookies()).filter((cookie) => cookie.name.startsWith('_ga'))).toEqual([]);
});

test('all public routes fit a 390px viewport without page-level overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of PUBLIC_ROUTES) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${route} should not overflow horizontally`).toBeLessThanOrEqual(dimensions.innerWidth);
  }
});

test('Frame 1 timeline index is keyboard operable', async ({ page }) => {
  await page.goto('/frames/1');
  const lastIndexButton = page.locator('[data-frame-idx]').last();
  await lastIndexButton.focus();
  await expect(lastIndexButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test('Frame 2 exposes arbitrary month inspection to the keyboard', async ({ page }) => {
  await page.goto('/frames/2');
  const range = page.getByRole('slider', { name: 'Inspect month' });
  await range.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.f2-range-value')).toHaveText('Sep 1971');
  await page.keyboard.press('End');
  await expect(page.locator('.f2-range-value')).toHaveText('Apr 2026');
});

test('Frame 2 keeps its explanation and accessible chart without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/frames/2');

  await expect(page.getByRole('heading', { level: 1, name: 'After the Anchor' })).toBeVisible();
  await expect(page.locator('svg[role="img"][aria-labelledby="f2-chart-title f2-chart-desc"]')).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Data sources and method' })).toContainText('data through April 2026');
  await context.close();
});

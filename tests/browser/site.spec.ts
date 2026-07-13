import { expect, test } from '@playwright/test';

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

test('Frame 2 keeps its explanation and accessible chart without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/frames/2');

  await expect(page.getByRole('heading', { level: 1, name: 'After the Anchor' })).toBeVisible();
  await expect(page.locator('svg[role="img"][aria-labelledby="f2-chart-title f2-chart-desc"]')).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Data sources and method' })).toContainText('data through April 2026');
  await context.close();
});

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

test('saved resources and path progress persist locally', async ({ page }) => {
  await page.goto('/library');
  const save = page.locator('[data-study-save]').first();
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.locator('[data-study-save]').first()).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/paths');
  await expect(page.locator('[data-study-queue]')).toContainText('The Bitcoin Standard');
  const firstStep = page.locator('[data-study-progress]').first();
  await firstStep.click();
  await expect(firstStep).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.locator('[data-study-progress]').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-study-resume]')).toBeVisible();
  await expect(page.locator('[data-study-resume-link]')).toContainText('step 2 of 5');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-study-export]').click();
  expect((await downloadPromise).suggestedFilename()).toBe('bitcoinmind-study.json');

  const imported = {
    version: 1,
    saved: [{
      id: 'text:bitcoin-whitepaper',
      title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
      href: '/texts#bitcoin-whitepaper',
      kind: 'Text',
      savedAt: '2026-07-12T00:00:00.000Z',
    }],
    progress: { 'rh-technical': [0, 1] },
  };
  await page.locator('[data-study-import]').setInputFiles({
    name: 'bitcoinmind-study.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await expect(page.locator('[data-study-queue]')).toContainText('Bitcoin: A Peer-to-Peer Electronic Cash System');
  await expect(page.locator('[data-study-status]')).toHaveText('Local study data imported.');
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

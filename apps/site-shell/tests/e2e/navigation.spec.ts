import { expect, test } from '@playwright/test';

const routes = ['/', '/blog', '/projects', '/merch'] as const;

test.beforeEach(async ({ context }) => {
  await context.grantPermissions([]);
});

test.describe('Site shell navigation', () => {
  for (const route of routes) {
    test(`renders persistent shell on ${route}`, async ({ page }) => {
      await page.goto(route);
      const header = page.getByRole('banner');
      const footer = page.getByRole('contentinfo');
      await expect(header).toBeVisible();
      await expect(footer).toBeVisible();
      for (const label of ['Home', 'Blog', 'Projects', 'Merch']) {
        await expect(header.getByRole('link', { name: label }).first()).toBeVisible();
        await expect(footer.getByRole('link', { name: label }).first()).toBeVisible();
      }
    });
  }

  test('supports route changes via navigation links', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'Projects' }).first().click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('banner')).toBeVisible();
  });
});

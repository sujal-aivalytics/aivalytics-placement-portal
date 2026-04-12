import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/signup'); // Or /login if it exists

    // Perform login actions
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/dashboard**');

    // Use robust Playwright assertions for URL validation
    // This avoids TypeError: url.includes is not a function
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Explicitly check for successful navigation
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
  });
});

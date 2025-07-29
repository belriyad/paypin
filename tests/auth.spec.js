// tests/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/PayPing/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Streamline Your Payment Management');
    
    // Check navigation links
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Demo' })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Check URL
    await expect(page).toHaveURL(/.*login/);
    
    // Check login form elements
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Check URL
    await expect(page).toHaveURL(/.*signup/);
    
    // Check signup form elements
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up with Google' })).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show validation messages (browser native validation)
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeFocused();
  });

  test('should show validation errors for invalid signup', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Fill form with mismatched passwords
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('different123');
    
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Should show password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should navigate to demo page', async ({ page }) => {
    await page.getByRole('link', { name: 'Demo' }).click();
    
    // Check URL
    await expect(page).toHaveURL(/.*demo/);
    
    // Check demo content
    await expect(page.locator('h1')).toContainText('PayPing Demo');
  });

  test('should show privacy policy', async ({ page }) => {
    // Go to signup page first (where privacy link is more likely to be)
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Check if privacy link exists and click it
    const privacyLink = page.getByRole('link', { name: /privacy/i });
    if (await privacyLink.count() > 0) {
      await privacyLink.click();
      await expect(page).toHaveURL(/.*privacy/);
    } else {
      // Navigate directly to privacy page
      await page.goto('/privacy');
      await expect(page.locator('h1')).toContainText(/privacy/i);
    }
  });

  test('should show terms of service', async ({ page }) => {
    // Go to signup page first (where terms link is more likely to be)
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Check if terms link exists and click it
    const termsLink = page.getByRole('link', { name: /terms/i });
    if (await termsLink.count() > 0) {
      await termsLink.click();
      await expect(page).toHaveURL(/.*terms/);
    } else {
      // Navigate directly to terms page
      await page.goto('/terms');
      await expect(page.locator('h1')).toContainText(/terms/i);
    }
  });

  test('should handle authentication state properly', async ({ page }) => {
    // Test that protected routes redirect to login
    await page.goto('/dashboard');
    
    // Should redirect to login or show login form
    await expect(page).toHaveURL(/.*login/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that navigation is still functional
    await expect(page.locator('nav')).toBeVisible();
    
    // Check that main content is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile navigation if hamburger menu exists
    const menuButton = page.locator('[data-testid="mobile-menu"]').or(page.locator('button:has-text("☰")'));
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    }
  });
});

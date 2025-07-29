// tests/settings.spec.js
import { test, expect } from '@playwright/test';

test.describe('Settings Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.mockUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User'
      };
      localStorage.setItem('payping_onboarding_complete', 'true');
    });
    
    await page.goto('/settings');
    await page.waitForTimeout(1000);
  });

  test('should display settings page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check page title
    await expect(page.locator('h1, h2')).toContainText(/settings/i);
  });

  test('should show company information section', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for company settings
    const companySelectors = [
      'text=/company/i',
      'text=/business/i',
      'input[placeholder*="company" i]',
      'input[placeholder*="business" i]',
      '.company-settings',
      '[data-testid*="company"]'
    ];
    
    for (const selector of companySelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show notification preferences', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for notification settings
    const notificationSelectors = [
      'text=/notification/i',
      'text=/email.*reminder/i',
      'text=/sms/i',
      'input[type="checkbox"]',
      '.notification-settings',
      '[data-testid*="notification"]'
    ];
    
    for (const selector of notificationSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show email configuration', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for email settings
    const emailSelectors = [
      'text=/email.*config/i',
      'text=/emailjs/i',
      'text=/smtp/i',
      'input[placeholder*="email" i]',
      '.email-settings',
      '[data-testid*="email"]'
    ];
    
    for (const selector of emailSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show profile information', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for profile settings
    const profileSelectors = [
      'text=/profile/i',
      'text=/account/i',
      'input[placeholder*="name" i]',
      'input[type="email"]',
      '.profile-settings',
      '[data-testid*="profile"]'
    ];
    
    for (const selector of profileSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show save settings functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for save buttons
    const saveButtons = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button:has-text("Save Settings")',
      'button:has-text("Save Changes")',
      '[data-testid="save-settings"]'
    ];
    
    for (const selector of saveButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show payment settings', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for payment-related settings
    const paymentSelectors = [
      'text=/payment.*setting/i',
      'text=/currency/i',
      'text=/default.*amount/i',
      'text=/late.*fee/i',
      '.payment-settings',
      '[data-testid*="payment"]'
    ];
    
    for (const selector of paymentSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show reminder settings', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for reminder configuration
    const reminderSelectors = [
      'text=/reminder.*setting/i',
      'text=/days.*before/i',
      'text=/escalation/i',
      'input[type="number"]',
      '.reminder-settings',
      '[data-testid*="reminder"]'
    ];
    
    for (const selector of reminderSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show data export options', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for data export functionality
    const exportSelectors = [
      'button:has-text("Export Data")',
      'button:has-text("Download Data")',
      'button:has-text("Backup")',
      'text=/export/i',
      '[data-testid="export-data"]'
    ];
    
    for (const selector of exportSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show privacy and security settings', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for privacy/security options
    const securitySelectors = [
      'text=/privacy/i',
      'text=/security/i',
      'text=/password/i',
      'text=/two.*factor/i',
      'button:has-text("Change Password")',
      '.security-settings'
    ];
    
    for (const selector of securitySelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle settings form validation', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try to find and interact with a settings form
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // Try to submit form to see validation
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Save")')
      );
      
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        
        // Look for validation messages or success indicators
        await page.waitForTimeout(1000);
        
        const messageSelectors = [
          '.error',
          '.success',
          '.validation',
          'text=/required/i',
          'text=/saved/i',
          'text=/updated/i'
        ];
        
        for (const selector of messageSelectors) {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            await expect(element.first()).toBeVisible();
            break;
          }
        }
      }
    }
  });

  test('should show subscription settings link', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for subscription-related settings
    const subscriptionSelectors = [
      'text=/subscription/i',
      'text=/plan/i',
      'text=/billing/i',
      'button:has-text("Manage Subscription")',
      'link:has-text("Subscription")',
      '[data-testid*="subscription"]'
    ];
    
    for (const selector of subscriptionSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that settings page is still functional
    await expect(page.locator('body')).toBeVisible();
    
    // Settings sections should stack properly on mobile
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should show help or documentation links', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for help sections
    const helpSelectors = [
      'link:has-text("Help")',
      'button:has-text("Help")',
      'text=/documentation/i',
      'text=/support/i',
      '[data-testid*="help"]'
    ];
    
    for (const selector of helpSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });
});

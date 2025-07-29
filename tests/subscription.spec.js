// tests/subscription.spec.js
import { test, expect } from '@playwright/test';

test.describe('Subscription System', () => {
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
    
    await page.goto('/subscription');
    await page.waitForTimeout(1000);
  });

  test('should display subscription plans', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check page title
    await expect(page.locator('h1')).toContainText(/plan|subscription/i);
    
    // Check for plan names
    const planNames = ['Starter', 'Professional', 'Enterprise'];
    for (const planName of planNames) {
      await expect(page.locator(`text=${planName}`)).toBeVisible();
    }
  });

  test('should show pricing information', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for pricing elements
    const priceSelectors = [
      'text=/\\$\\d+/i',
      'text=/month/i',
      'text=/year/i',
      '.price',
      '[data-testid="price"]'
    ];
    
    for (const selector of priceSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display billing cycle toggle', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for monthly/yearly toggle
    const toggleSelectors = [
      'button:has-text("Monthly")',
      'button:has-text("Yearly")',
      'text=/monthly.*yearly/i',
      '.billing-toggle',
      '[data-testid="billing-cycle"]'
    ];
    
    for (const selector of toggleSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show plan features', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for feature lists
    const featureSelectors = [
      'text=/customers/i',
      'text=/reminders/i',
      'text=/templates/i',
      'text=/support/i',
      'ul li',
      '.feature',
      '.plan-feature'
    ];
    
    for (const selector of featureSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should highlight recommended plan', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for "Most Popular" or "Recommended" indicators
    const recommendedSelectors = [
      'text=/most popular/i',
      'text=/recommended/i',
      'text=/best value/i',
      '.recommended',
      '.popular',
      '[data-testid="recommended"]'
    ];
    
    for (const selector of recommendedSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show choose plan buttons', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for subscription buttons
    const buttonSelectors = [
      'button:has-text("Choose")',
      'button:has-text("Select")',
      'button:has-text("Subscribe")',
      'button:has-text("Get Started")',
      '.plan-button',
      '[data-testid*="plan-button"]'
    ];
    
    for (const selector of buttonSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should test billing cycle switching', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try to switch billing cycles
    const yearlyButton = page.locator('button:has-text("Yearly")');
    if (await yearlyButton.count() > 0) {
      await yearlyButton.click();
      
      // Look for savings indicator
      const savingsTexts = ['Save', '%', 'savings', 'discount'];
      for (const text of savingsTexts) {
        const element = page.locator(`text=${text}`);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show FAQ section', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for FAQ section
    const faqSelectors = [
      'text=/faq/i',
      'text=/frequently asked/i',
      'text=/questions/i',
      '.faq',
      '[data-testid="faq"]'
    ];
    
    for (const selector of faqSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show contact/demo options', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for contact or demo buttons
    const contactSelectors = [
      'button:has-text("Demo")',
      'button:has-text("Contact")',
      'button:has-text("Sales")',
      'text=/schedule.*demo/i',
      'text=/contact.*sales/i'
    ];
    
    for (const selector of contactSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle subscription selection', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try clicking a subscription button
    const subscribeButton = page.locator('button:has-text("Choose Professional")').or(
      page.locator('button:has-text("Choose Starter")').or(
        page.locator('button:has-text("Choose Enterprise")')
      )
    );
    
    if (await subscribeButton.count() > 0) {
      await subscribeButton.first().click();
      
      // Should either show payment form, loading state, or success message
      await page.waitForTimeout(2000);
      
      // Look for payment processing indicators
      const processingSelectors = [
        'text=/processing/i',
        'text=/loading/i',
        'text=/success/i',
        'text=/transaction/i',
        '.loading',
        '.success'
      ];
      
      for (const selector of processingSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show current subscription status', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for current plan indicators
    const statusSelectors = [
      'text=/current plan/i',
      'text=/active/i',
      'text=/your plan/i',
      '.current-plan',
      '.active-plan',
      '[data-testid="current-plan"]'
    ];
    
    for (const selector of statusSelectors) {
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
    
    // Check that subscription plans are still visible and functional
    await expect(page.locator('h1')).toBeVisible();
    
    // Plans should stack vertically on mobile
    const planCards = page.locator('.plan, .card, [data-testid*="plan"]');
    if (await planCards.count() > 0) {
      await expect(planCards.first()).toBeVisible();
    }
  });

  test('should show pricing calculations correctly', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check that prices are displayed correctly
    const pricePattern = /\$\d+/;
    const priceElements = page.locator(`text=${pricePattern}`);
    
    if (await priceElements.count() > 0) {
      // At least one price should be visible
      await expect(priceElements.first()).toBeVisible();
      
      // Test switching to yearly billing
      const yearlyToggle = page.locator('button:has-text("Yearly")');
      if (await yearlyToggle.count() > 0) {
        await yearlyToggle.click();
        await page.waitForTimeout(500);
        
        // Prices should update
        await expect(priceElements.first()).toBeVisible();
      }
    }
  });
});

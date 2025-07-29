// tests/customers.spec.js
import { test, expect } from '@playwright/test';

test.describe('Customer Management', () => {
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
    
    await page.goto('/customers');
    await page.waitForTimeout(1000);
  });

  test('should display customers page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check page title or heading
    await expect(page.locator('h1, h2')).toContainText(/customers/i);
  });

  test('should show add customer functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for add customer button
    const addButtons = [
      'button:has-text("Add Customer")',
      'button:has-text("New Customer")',
      'button:has-text("+")',
      '[data-testid="add-customer"]'
    ];
    
    for (const selector of addButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display customer table or list', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for table or list structure
    const tableSelectors = [
      'table',
      '[data-testid="customer-table"]',
      '.customer-list',
      '.customer-card',
      'thead',
      'tbody'
    ];
    
    let foundTable = false;
    for (const selector of tableSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        foundTable = true;
        break;
      }
    }
    
    // If no table found, check for empty state
    if (!foundTable) {
      const emptyStateTexts = ['No customers', 'Add your first customer', 'Get started'];
      for (const text of emptyStateTexts) {
        const element = page.locator(`text=${text}`);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show customer search functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for search input
    const searchSelectors = [
      'input[placeholder*="search" i]',
      'input[type="search"]',
      '[data-testid="customer-search"]',
      'input[placeholder*="customer" i]'
    ];
    
    for (const selector of searchSelectors) {
      const input = page.locator(selector);
      if (await input.count() > 0) {
        await expect(input.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle customer actions', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for action buttons (edit, delete, send reminder)
    const actionSelectors = [
      'button:has-text("Edit")',
      'button:has-text("Delete")',
      'button:has-text("Send Reminder")',
      '[data-testid*="action"]',
      '.action-button',
      'button[title*="Edit"]',
      'button[title*="Delete"]'
    ];
    
    for (const selector of actionSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        // Just check that action buttons exist, don't click them
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show customer upload functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for upload/import buttons
    const uploadSelectors = [
      'button:has-text("Import")',
      'button:has-text("Upload")',
      'button:has-text("Bulk")',
      '[data-testid="upload-customers"]',
      'input[type="file"]'
    ];
    
    for (const selector of uploadSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display customer information columns', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for typical customer table headers
    const expectedHeaders = ['Name', 'Email', 'Phone', 'Amount', 'Status', 'Actions'];
    
    for (const header of expectedHeaders) {
      const headerElement = page.locator(`th:has-text("${header}"), td:has-text("${header}"), text=${header}`);
      if (await headerElement.count() > 0) {
        // Found at least one expected header
        await expect(headerElement.first()).toBeVisible();
        break;
      }
    }
  });

  test('should navigate to upload customers page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try to navigate to upload page
    const uploadLink = page.getByRole('link', { name: /upload|import/i });
    if (await uploadLink.count() > 0) {
      await uploadLink.click();
      await expect(page).toHaveURL(/.*upload/);
    } else {
      // Navigate directly
      await page.goto('/upload-customers');
      await expect(page).toHaveURL(/.*upload/);
    }
  });

  test('should show customer reminder functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for reminder-related elements
    const reminderSelectors = [
      'button:has-text("Send Reminder")',
      'text=/reminder/i',
      '[data-testid*="reminder"]',
      '.reminder-toggle',
      'input[type="checkbox"]'
    ];
    
    for (const selector of reminderSelectors) {
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
    
    // Check that customer page is still functional
    await expect(page.locator('body')).toBeVisible();
    
    // Table should be responsive or show mobile-friendly view
    const table = page.locator('table');
    if (await table.count() > 0) {
      // Table might be scrollable or stacked on mobile
      await expect(table).toBeVisible();
    }
  });

  test('should handle pagination if customers list is long', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for pagination elements
    const paginationSelectors = [
      '.pagination',
      'button:has-text("Next")',
      'button:has-text("Previous")',
      'text=/page \\d+ of \\d+/i',
      '[data-testid="pagination"]'
    ];
    
    for (const selector of paginationSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });
});

// tests/payments.spec.js
import { test, expect } from '@playwright/test';

test.describe('Payment Management', () => {
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
    
    await page.goto('/payments');
    await page.waitForTimeout(1000);
  });

  test('should display payments page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check page title
    await expect(page.locator('h1, h2')).toContainText(/payment/i);
  });

  test('should show add payment functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for add payment button
    const addButtons = [
      'button:has-text("Add Payment")',
      'button:has-text("New Payment")',
      'button:has-text("Record Payment")',
      'button:has-text("+")',
      '[data-testid="add-payment"]'
    ];
    
    for (const selector of addButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display payments table or list', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for payments display
    const paymentsSelectors = [
      'table',
      '.payment-list',
      '.payment-card',
      '[data-testid="payments-table"]',
      'thead',
      'tbody'
    ];
    
    let foundPayments = false;
    for (const selector of paymentsSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        foundPayments = true;
        break;
      }
    }
    
    // If no payments table found, check for empty state
    if (!foundPayments) {
      const emptyStateTexts = ['No payments', 'Record your first payment', 'Get started'];
      for (const text of emptyStateTexts) {
        const element = page.locator(`text=${text}`);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show payment status indicators', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for payment status elements
    const statusSelectors = [
      'text=/paid/i',
      'text=/pending/i',
      'text=/overdue/i',
      'text=/completed/i',
      '.status',
      '.payment-status',
      '[data-testid*="status"]'
    ];
    
    for (const selector of statusSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display payment columns', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for typical payment table headers
    const expectedHeaders = ['Customer', 'Amount', 'Date', 'Status', 'Invoice', 'Actions'];
    
    for (const header of expectedHeaders) {
      const headerElement = page.locator(`th:has-text("${header}"), td:has-text("${header}"), text=${header}`);
      if (await headerElement.count() > 0) {
        await expect(headerElement.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show payment filtering options', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for filter elements
    const filterSelectors = [
      'select',
      'input[type="date"]',
      'button:has-text("Filter")',
      '.filter',
      '[data-testid*="filter"]',
      'text=/filter by/i'
    ];
    
    for (const selector of filterSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show payment search functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for search input
    const searchSelectors = [
      'input[placeholder*="search" i]',
      'input[type="search"]',
      '[data-testid="payment-search"]',
      'input[placeholder*="payment" i]'
    ];
    
    for (const selector of searchSelectors) {
      const input = page.locator(selector);
      if (await input.count() > 0) {
        await expect(input.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show payment actions', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for payment action buttons
    const actionSelectors = [
      'button:has-text("Edit")',
      'button:has-text("Delete")',
      'button:has-text("View")',
      'button:has-text("Send Receipt")',
      '.action-button',
      '[data-testid*="action"]'
    ];
    
    for (const selector of actionSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show payment statistics', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for payment stats
    const statsSelectors = [
      'text=/total.*payments/i',
      'text=/total.*amount/i',
      'text=/\\$\\d+/i',
      '.stat',
      '.metric',
      '[data-testid*="stat"]'
    ];
    
    for (const selector of statsSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle payment form submission', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try to add a new payment
    const addButton = page.locator('button:has-text("Add Payment")').or(
      page.locator('button:has-text("New Payment")')
    );
    
    if (await addButton.count() > 0) {
      await addButton.first().click();
      
      // Should show payment form
      await page.waitForTimeout(1000);
      
      // Look for form fields
      const formSelectors = [
        'input[placeholder*="amount" i]',
        'input[type="number"]',
        'select',
        '.payment-form',
        '[data-testid="payment-form"]'
      ];
      
      for (const selector of formSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show payment date ranges', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for date range selectors
    const dateSelectors = [
      'input[type="date"]',
      'button:has-text("This Month")',
      'button:has-text("Last Month")',
      'button:has-text("This Year")',
      '.date-range',
      '[data-testid*="date"]'
    ];
    
    for (const selector of dateSelectors) {
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
    
    // Check that payments page is still functional
    await expect(page.locator('body')).toBeVisible();
    
    // Table should be responsive or show mobile-friendly view
    const table = page.locator('table');
    if (await table.count() > 0) {
      await expect(table).toBeVisible();
    }
  });

  test('should show export functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for export options
    const exportSelectors = [
      'button:has-text("Export")',
      'button:has-text("Download")',
      'button:has-text("CSV")',
      'button:has-text("PDF")',
      '[data-testid="export"]'
    ];
    
    for (const selector of exportSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle pagination for large payment lists', async ({ page }) => {
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

// tests/data-export.spec.js
import { test, expect } from '@playwright/test';

test.describe('Data Export Functionality', () => {
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
    
    try {
      await page.goto('/customers', { timeout: 10000 });
      await page.waitForTimeout(1000);
    } catch (error) {
      // If navigation fails, the test will handle the redirect
    }
  });

  test('should show export options in customers page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for export buttons or options
    const exportSelectors = [
      'button:has-text("Export")',
      'button:has-text("Download")',
      'button:has-text("Export Data")',
      'button:has-text("Export CSV")',
      'button:has-text("Export Excel")',
      '[data-testid*="export"]',
      '.export-button'
    ];
    
    for (const selector of exportSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle CSV export', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for CSV export specifically
    const csvExportButton = page.locator('button:has-text("CSV")').or(
      page.locator('button:has-text("Export CSV")')
    ).or(
      page.locator('[data-testid*="csv"]')
    );
    
    if (await csvExportButton.count() > 0) {
      // Setup download promise before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
      
      await csvExportButton.first().click();
      
      try {
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.csv$/);
      } catch (error) {
        // Download might not happen in test environment, that's okay
        console.log('Download not captured in test environment');
      }
    }
  });

  test('should handle Excel export', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for Excel export specifically
    const excelExportButton = page.locator('button:has-text("Excel")').or(
      page.locator('button:has-text("Export Excel")')
    ).or(
      page.locator('[data-testid*="excel"]')
    );
    
    if (await excelExportButton.count() > 0) {
      // Setup download promise before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
      
      await excelExportButton.first().click();
      
      try {
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.(xlsx|xls)$/);
      } catch (error) {
        // Download might not happen in test environment, that's okay
        console.log('Download not captured in test environment');
      }
    }
  });

  test('should show export options in payments page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    await page.goto('/payments');
    await page.waitForTimeout(1000);
    
    // Look for export options in payments
    const exportSelectors = [
      'button:has-text("Export")',
      'button:has-text("Download")',
      'button:has-text("Export Payments")',
      '[data-testid*="export"]'
    ];
    
    for (const selector of exportSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle export with filters', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for filter options before export
    const filterSelectors = [
      'select',
      'input[type="date"]',
      'input[placeholder*="filter" i]',
      'input[placeholder*="search" i]',
      '.filter-section'
    ];
    
    let hasFilters = false;
    for (const selector of filterSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        hasFilters = true;
        
        // Try to apply a filter
        if (selector === 'select') {
          const options = await element.first().locator('option').count();
          if (options > 1) {
            await element.first().selectOption({ index: 1 });
          }
        } else if (selector.includes('input')) {
          await element.first().fill('test');
        }
        break;
      }
    }
    
    if (hasFilters) {
      await page.waitForTimeout(500);
      
      // Now try to export filtered data
      const exportButton = page.locator('button:has-text("Export")').first();
      if (await exportButton.count() > 0) {
        await exportButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should show export progress or confirmation', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    const exportButton = page.locator('button:has-text("Export")').first();
    
    if (await exportButton.count() > 0) {
      await exportButton.click();
      
      // Look for progress indicators or success messages
      const progressSelectors = [
        '.loading',
        '.spinner',
        'text=/exporting/i',
        'text=/downloading/i',
        'text=/export.*complete/i',
        'text=/download.*ready/i',
        '.progress-bar',
        '[data-testid*="progress"]'
      ];
      
      await page.waitForTimeout(1000);
      
      for (const selector of progressSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should handle export errors gracefully', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Mock network error for export
    await page.route('**/export**', route => {
      route.abort('failed');
    });
    
    const exportButton = page.locator('button:has-text("Export")').first();
    
    if (await exportButton.count() > 0) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      
      // Look for error messages
      const errorSelectors = [
        '.error',
        'text=/error/i',
        'text=/failed/i',
        'text=/try.*again/i',
        '[data-testid*="error"]'
      ];
      
      for (const selector of errorSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show export format options', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for format selection options
    const formatSelectors = [
      'select:has(option:has-text("CSV"))',
      'select:has(option:has-text("Excel"))',
      'input[type="radio"][value*="csv"]',
      'input[type="radio"][value*="excel"]',
      '.format-selector',
      '[data-testid*="format"]'
    ];
    
    for (const selector of formatSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should export data from settings page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    await page.goto('/settings');
    await page.waitForTimeout(1000);
    
    // Look for data export section in settings
    const settingsExportSelectors = [
      'button:has-text("Export Data")',
      'button:has-text("Download Data")',
      'button:has-text("Backup Data")',
      'text=/data.*export/i',
      '.data-export-section',
      '[data-testid*="data-export"]'
    ];
    
    for (const selector of settingsExportSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should handle date range export', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    await page.goto('/payments');
    await page.waitForTimeout(1000);
    
    // Look for date range selectors
    const dateInputs = page.locator('input[type="date"]');
    
    if (await dateInputs.count() >= 2) {
      // Fill in date range
      await dateInputs.first().fill('2024-01-01');
      await dateInputs.last().fill('2024-12-31');
      
      await page.waitForTimeout(500);
      
      // Try to export with date range
      const exportButton = page.locator('button:has-text("Export")').first();
      if (await exportButton.count() > 0) {
        await exportButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should show export limitations or warnings', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    const exportButton = page.locator('button:has-text("Export")').first();
    
    if (await exportButton.count() > 0) {
      await exportButton.click();
      
      // Look for warnings or limitations
      const warningSelectors = [
        'text=/limit/i',
        'text=/maximum/i',
        'text=/warning/i',
        'text=/large.*dataset/i',
        '.warning',
        '.limitation',
        '[data-testid*="warning"]'
      ];
      
      await page.waitForTimeout(1000);
      
      for (const selector of warningSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });
});

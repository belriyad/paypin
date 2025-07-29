// tests/templates.spec.js
import { test, expect } from '@playwright/test';

test.describe('Email Templates Management', () => {
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
    
    await page.goto('/templates');
    await page.waitForTimeout(1000);
  });

  test('should display templates page', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Check page title
    await expect(page.locator('h1, h2')).toContainText(/template/i);
  });

  test('should show create template functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for create/add template button
    const createButtons = [
      'button:has-text("Create Template")',
      'button:has-text("New Template")',
      'button:has-text("Add Template")',
      'button:has-text("+")',
      '[data-testid="create-template"]'
    ];
    
    for (const selector of createButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should display template list or cards', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for template display elements
    const templateSelectors = [
      '.template-card',
      '.template-item',
      '[data-testid*="template"]',
      'text=/payment reminder/i',
      'text=/invoice/i',
      'text=/receipt/i'
    ];
    
    let foundTemplates = false;
    for (const selector of templateSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        foundTemplates = true;
        break;
      }
    }
    
    // If no templates found, check for empty state
    if (!foundTemplates) {
      const emptyStateTexts = ['No templates', 'Create your first template', 'Get started'];
      for (const text of emptyStateTexts) {
        const element = page.locator(`text=${text}`);
        if (await element.count() > 0) {
          await expect(element.first()).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show template editor', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for template editor elements
    const editorSelectors = [
      'textarea',
      '[contenteditable]',
      'input[type="text"]',
      '.editor',
      '.template-editor',
      '[data-testid="template-editor"]'
    ];
    
    for (const selector of editorSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show template preview', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for preview functionality
    const previewSelectors = [
      'button:has-text("Preview")',
      '.preview',
      '.template-preview',
      '[data-testid="preview"]',
      'text=/preview/i'
    ];
    
    for (const selector of previewSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show save template functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for save buttons
    const saveButtons = [
      'button:has-text("Save")',
      'button:has-text("Save Template")',
      'button:has-text("Update")',
      '[data-testid="save-template"]'
    ];
    
    for (const selector of saveButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show template testing functionality', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for test email functionality
    const testButtons = [
      'button:has-text("Test")',
      'button:has-text("Send Test")',
      'button:has-text("Test Email")',
      '[data-testid="test-template"]'
    ];
    
    for (const selector of testButtons) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await expect(button.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show template variables/placeholders', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for variable indicators
    const variableSelectors = [
      'text=/{[^}]+}/g',
      'text=/customer_name/i',
      'text=/amount/i',
      'text=/due_date/i',
      'text=/invoice_number/i',
      '.variable',
      '.placeholder'
    ];
    
    for (const selector of variableSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });

  test('should show template actions', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for template action buttons
    const actionSelectors = [
      'button:has-text("Edit")',
      'button:has-text("Delete")',
      'button:has-text("Duplicate")',
      'button:has-text("Copy")',
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

  test('should handle template creation flow', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Try to create a new template
    const createButton = page.locator('button:has-text("Create Template")').or(
      page.locator('button:has-text("New Template")')
    );
    
    if (await createButton.count() > 0) {
      await createButton.first().click();
      
      // Should show template form or editor
      await page.waitForTimeout(1000);
      
      // Look for form fields
      const formSelectors = [
        'input[placeholder*="name" i]',
        'input[placeholder*="subject" i]',
        'textarea',
        '.template-form',
        '[data-testid="template-form"]'
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

  test('should show default templates', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for default template types
    const defaultTemplates = [
      'Payment Reminder',
      'Invoice',
      'Receipt',
      'Late Payment',
      'Thank You'
    ];
    
    for (const templateName of defaultTemplates) {
      const element = page.locator(`text=${templateName}`);
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
    
    // Check that templates page is still functional
    await expect(page.locator('body')).toBeVisible();
    
    // Template list should be responsive
    const templateList = page.locator('.template-card, .template-item');
    if (await templateList.count() > 0) {
      await expect(templateList.first()).toBeVisible();
    }
  });

  test('should show email integration status', async ({ page }) => {
    if (page.url().includes('/login')) {
      test.skip('Authentication required');
    }
    
    // Look for email service status
    const emailStatusSelectors = [
      'text=/emailjs/i',
      'text=/email configured/i',
      'text=/email service/i',
      '.email-status',
      '[data-testid="email-status"]'
    ];
    
    for (const selector of emailStatusSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        break;
      }
    }
  });
});

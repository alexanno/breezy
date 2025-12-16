import { test, expect } from '@playwright/test';

test.describe('Breezy PWA - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Breezy');
  });

  test('should display main header', async ({ page }) => {
    const header = page.locator('header h1');
    await expect(header).toContainText('⛵ Breezy');
  });

  test('should display all main buttons', async ({ page }) => {
    await expect(page.locator('#btnStart')).toBeVisible();
    await expect(page.locator('#btnTrack')).toBeVisible();
    await expect(page.locator('#btnExport')).toBeVisible();
    await expect(page.locator('#btnLog')).toBeVisible();
  });

  test('should display navigation metrics headings', async ({ page }) => {
    // Check that the metric headings exist using more specific selectors
    await expect(page.locator('h3:text("Heading (sann)")')).toBeVisible();
    await expect(page.locator('h3:text("SOG")')).toBeVisible();
    await expect(page.locator('h3:text("COG")')).toBeVisible();
    await expect(page.locator('h3:text-is("Bearing → mål")')).toBeVisible();
    await expect(page.locator('h3:text-is("VMG → mål")')).toBeVisible();
  });

  test('should have map container', async ({ page }) => {
    const mapElement = page.locator('#map');
    await expect(mapElement).toBeVisible();
  });

  test('should display permission status indicators', async ({ page }) => {
    await expect(page.locator('#permLocation')).toBeVisible();
    await expect(page.locator('#permOri')).toBeVisible();
    await expect(page.locator('#permWake')).toBeVisible();
  });

  test('should show initial metric values as placeholders', async ({ page }) => {
    await expect(page.locator('#headingTrue')).toContainText('°');
    await expect(page.locator('#sog')).toContainText('kn');
    await expect(page.locator('#cog')).toContainText('°');
  });

  test('should have waypoint input fields', async ({ page }) => {
    const latInput = page.locator('#wpLat');
    const lonInput = page.locator('#wpLon');
    
    await expect(latInput).toBeVisible();
    await expect(lonInput).toBeVisible();
    
    await expect(latInput).toHaveAttribute('type', 'number');
    await expect(lonInput).toHaveAttribute('type', 'number');
  });

  test('should show initial status message', async ({ page }) => {
    const status = page.locator('#status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Status:');
  });
});

test.describe('Breezy PWA - Waypoint Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should accept manual waypoint coordinates', async ({ page }) => {
    const latInput = page.locator('#wpLat');
    const lonInput = page.locator('#wpLon');
    const setButton = page.locator('#btnSetWp');

    await latInput.fill('59.9139');
    await lonInput.fill('10.7522');
    await setButton.click();
    
    // Verify values are set (they get formatted to 6 decimal places)
    const latValue = await latInput.inputValue();
    const lonValue = await lonInput.inputValue();
    expect(latValue).toContain('59.9139');
    expect(lonValue).toContain('10.7522');
  });

  test('should display set waypoint button', async ({ page }) => {
    const setButton = page.locator('#btnSetWp');
    await expect(setButton).toBeVisible();
    await expect(setButton).toContainText('Sett mål');
  });
});

test.describe('Breezy PWA - User Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display tracking button with initial text', async ({ page }) => {
    const trackButton = page.locator('#btnTrack');
    await expect(trackButton).toBeVisible();
    await expect(trackButton).toContainText('Start sporing');
  });

  test('should have tracking button that is enabled', async ({ page }) => {
    const trackButton = page.locator('#btnTrack');
    
    // Initial state
    await expect(trackButton).toContainText('Start sporing');
    await expect(trackButton).toBeEnabled();
    
    // Verify button is clickable
    await expect(trackButton).toBeVisible();
  });

  test('should have clickable export button', async ({ page }) => {
    const exportButton = page.locator('#btnExport');
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toBeEnabled();
  });

  test('should have clickable log button', async ({ page }) => {
    const logButton = page.locator('#btnLog');
    await expect(logButton).toBeVisible();
    await expect(logButton).toBeEnabled();
  });
});

test.describe('Breezy PWA - Responsive Layout', () => {
  test('should display properly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('header h1')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#map')).toBeVisible();
  });

  test('should display properly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.locator('header h1')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#map')).toBeVisible();
  });
});

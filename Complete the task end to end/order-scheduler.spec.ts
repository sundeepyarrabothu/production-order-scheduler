import { test, expect } from '@playwright/test';

test.describe('Production Order Scheduler E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('http://localhost:3000');
  });

  test('Order Creation: Successfully create a Pending order with valid data', async ({ page }) => {
    // Navigate to Orders page
    await page.click('text=Orders');
    
    // Click on Create New Order button
    await page.click('text=Create New Order');
    
    // Fill in the form with valid data
    await page.fill('input[id="name"]', 'Test Order 1');
    await page.fill('textarea[id="description"]', 'This is a test order description');
    await page.selectOption('select[id="status"]', 'Pending');
    
    // Submit the form
    await page.click('button:has-text("Create Order")');
    
    // Verify the order appears in the table
    await expect(page.locator('text=Test Order 1')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('Order Creation: Show validation errors for invalid data', async ({ page }) => {
    // Navigate to Orders page
    await page.click('text=Orders');
    
    // Click on Create New Order button
    await page.click('text=Create New Order');
    
    // Submit the form without filling required fields
    await page.click('button:has-text("Create Order")');
    
    // Verify validation errors appear
    await expect(page.locator('text=Name must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Description must be at least 5 characters')).toBeVisible();
  });

  test('Order Editing & Scheduling: Edit and schedule an existing order', async ({ page }) => {
    // Navigate to Orders page
    await page.click('text=Orders');
    
    // Create a new order first if needed
    if (await page.locator('text=No orders found').isVisible()) {
      await page.click('text=Create New Order');
      await page.fill('input[id="name"]', 'Order to Edit');
      await page.fill('textarea[id="description"]', 'This order will be edited and scheduled');
      await page.selectOption('select[id="status"]', 'Pending');
      await page.click('button:has-text("Create Order")');
    }
    
    // Click Edit on the first order
    await page.click('text=Edit', { timeout: 5000 });
    
    // Update the order details and schedule it
    await page.fill('input[id="name"]', 'Updated Order');
    await page.selectOption('select[id="status"]', 'Scheduled');
    
    // Select a resource
    await page.selectOption('select[id="resource-select"]', { index: 1 });
    
    // Set start and end times
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const startTime = today.toISOString().slice(0, 16);
    const endTime = tomorrow.toISOString().slice(0, 16);
    
    await page.fill('input[id="startTime"]', startTime);
    await page.fill('input[id="endTime"]', endTime);
    
    // Submit the form
    await page.click('button:has-text("Update Order")');
    
    // Verify the updated order appears in the table
    await expect(page.locator('text=Updated Order')).toBeVisible();
    await expect(page.locator('text=Scheduled')).toBeVisible();
  });

  test('Scheduling Validation: Prevent scheduling if End Time is not after Start Time', async ({ page }) => {
    // Navigate to Orders page
    await page.click('text=Orders');
    
    // Click on Create New Order button
    await page.click('text=Create New Order');
    
    // Fill in the form with valid data but invalid scheduling
    await page.fill('input[id="name"]', 'Invalid Schedule Test');
    await page.fill('textarea[id="description"]', 'Testing schedule validation');
    await page.selectOption('select[id="status"]', 'Scheduled');
    
    // Select a resource
    await page.selectOption('select[id="resource-select"]', { index: 1 });
    
    // Set invalid times (end time before start time)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const startTime = today.toISOString().slice(0, 16);
    const endTime = yesterday.toISOString().slice(0, 16);
    
    await page.fill('input[id="startTime"]', startTime);
    await page.fill('input[id="endTime"]', endTime);
    
    // Submit the form
    await page.click('button:has-text("Create Order")');
    
    // Verify validation error appears
    await expect(page.locator('text=End time must be after start time')).toBeVisible();
  });

  test('Table Interaction: Filter orders by status', async ({ page }) => {
    // Navigate to Orders page
    await page.click('text=Orders');
    
    // Create orders with different statuses if needed
    if (await page.locator('text=No orders found').isVisible()) {
      // Create a Pending order
      await page.click('text=Create New Order');
      await page.fill('input[id="name"]', 'Pending Order');
      await page.fill('textarea[id="description"]', 'This is a pending order');
      await page.selectOption('select[id="status"]', 'Pending');
      await page.click('button:has-text("Create Order")');
      
      // Create a Scheduled order
      await page.click('text=Create New Order');
      await page.fill('input[id="name"]', 'Scheduled Order');
      await page.fill('textarea[id="description"]', 'This is a scheduled order');
      await page.selectOption('select[id="status"]', 'Scheduled');
      await page.selectOption('select[id="resource-select"]', { index: 1 });
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const startTime = today.toISOString().slice(0, 16);
      const endTime = tomorrow.toISOString().slice(0, 16);
      
      await page.fill('input[id="startTime"]', startTime);
      await page.fill('input[id="endTime"]', endTime);
      await page.click('button:has-text("Create Order")');
    }
    
    // Click on the Pending filter button
    await page.click('button:has-text("Pending")');
    
    // Verify only Pending orders are shown
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Scheduled')).not.toBeVisible();
    
    // Click on the Scheduled filter button
    await page.click('button:has-text("Scheduled")');
    
    // Verify only Scheduled orders are shown
    await expect(page.locator('text=Scheduled')).toBeVisible();
    await expect(page.locator('text=Pending')).not.toBeVisible();
    
    // Click on All to reset filter
    await page.click('button:has-text("All")');
    
    // Verify all orders are shown
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Scheduled')).toBeVisible();
  });

  test('Dashboard Display: Verify charts render and reflect data state', async ({ page }) => {
    // Navigate to Dashboard page
    await page.click('text=Dashboard');
    
    // Verify the Order Status chart is visible
    await expect(page.locator('text=Order Status')).toBeVisible();
    
    // Verify the Resource Utilization chart is visible
    await expect(page.locator('text=Resource Utilization')).toBeVisible();
    
    // Verify summary cards are visible
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Scheduled')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
  });
});

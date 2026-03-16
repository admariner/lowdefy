/*
  Copyright 2020-2026 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { test, expect } from '@playwright/test';
import { getBlock, navigateToTestPage } from '@lowdefy/block-dev-e2e';

test.describe('DropdownButton Block', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTestPage(page, 'dropdown_button');
  });

  test('renders button with title and icon', async ({ page }) => {
    const block = getBlock(page, 'db_basic');
    await expect(block).toBeVisible();
    await expect(block.locator('.ant-btn')).toContainText('Actions');
  });

  test('opens menu on click', async ({ page }) => {
    const block = getBlock(page, 'db_basic');
    await block.locator('.ant-btn').click();
    const dropdown = page.locator('.ant-dropdown').first();
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toContainText('Edit');
    await expect(dropdown).toContainText('Duplicate');
    await expect(dropdown).toContainText('Delete');
  });

  test('fires named event per item', async ({ page }) => {
    const block = getBlock(page, 'db_basic');
    await block.locator('.ant-btn').click();
    const item = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Delete' });
    await item.click();
    const display = getBlock(page, 'db_basic_display');
    await expect(display).toContainText('delete');
  });

  test('handles danger items', async ({ page }) => {
    const block = getBlock(page, 'db_danger');
    await block.locator('.ant-btn').click();
    const dangerItem = page
      .locator('.ant-dropdown-menu-item')
      .filter({ hasText: 'Dangerous Action' });
    await expect(dangerItem).toHaveClass(/ant-dropdown-menu-item-danger/);
  });

  test('handles disabled items', async ({ page }) => {
    const block = getBlock(page, 'db_disabled');
    await block.locator('.ant-btn').click();
    const disabledItem = page
      .locator('.ant-dropdown-menu-item')
      .filter({ hasText: 'Edit (no access)' });
    await expect(disabledItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
  });

  test('renders dividers', async ({ page }) => {
    const block = getBlock(page, 'db_basic');
    await block.locator('.ant-btn').click();
    const dropdown = page.locator('.ant-dropdown').first();
    const divider = dropdown.locator('.ant-dropdown-menu-item-divider');
    await expect(divider).toBeVisible();
  });

  test('fires onOpenChange', async ({ page }) => {
    const block = getBlock(page, 'db_openchange');
    await block.scrollIntoViewIfNeeded();
    await block.locator('.ant-btn').click();
    const display = getBlock(page, 'db_openchange_display');
    await expect(display).toContainText('Open changed!');
  });

  test('renders button with icon', async ({ page }) => {
    const block = getBlock(page, 'db_icon');
    await block.scrollIntoViewIfNeeded();
    await expect(block.locator('.ant-btn')).toContainText('Export');
    await expect(block.locator('.ant-btn .anticon, .ant-btn svg')).toBeVisible();
  });
});

test.describe('DropdownButton split mode', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTestPage(page, 'dropdown_button');
  });

  test('renders two buttons in Space.Compact', async ({ page }) => {
    const block = getBlock(page, 'db_split');
    await block.scrollIntoViewIfNeeded();
    const compact = block.locator('.ant-space-compact');
    await expect(compact).toBeVisible();
    const buttons = compact.locator('button');
    await expect(buttons).toHaveCount(2);
  });

  test('left button fires onClick', async ({ page }) => {
    const block = getBlock(page, 'db_split');
    await block.scrollIntoViewIfNeeded();
    const leftButton = block.locator('.ant-space-compact button').first();
    await leftButton.click();
    const display = getBlock(page, 'db_split_display');
    await expect(display).toContainText('primary_click');
  });

  test('right arrow opens dropdown', async ({ page }) => {
    const block = getBlock(page, 'db_split');
    await block.scrollIntoViewIfNeeded();
    const arrowButton = block.locator('.ant-space-compact button').last();
    await arrowButton.click();
    const dropdown = page.locator('.ant-dropdown').first();
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toContainText('Save as Draft');
    await expect(dropdown).toContainText('Save & Publish');
  });

  test('split dropdown item fires named event', async ({ page }) => {
    const block = getBlock(page, 'db_split');
    await block.scrollIntoViewIfNeeded();
    const arrowButton = block.locator('.ant-space-compact button').last();
    await arrowButton.click();
    const item = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Save as Draft' });
    await item.click();
    const display = getBlock(page, 'db_split_display');
    await expect(display).toContainText('draft');
  });
});

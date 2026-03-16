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

test.describe('DropdownMenu Block', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTestPage(page, 'dropdown_menu');
  });

  test('renders trigger content', async ({ page }) => {
    const trigger = getBlock(page, 'dm_click_trigger');
    await expect(trigger).toBeVisible();
    await expect(trigger.locator('.ant-btn')).toHaveText('Click Menu');
  });

  test('opens on click trigger', async ({ page }) => {
    const trigger = getBlock(page, 'dm_click_trigger');
    await trigger.click();
    const dropdown = page.locator('.ant-dropdown').first();
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('.ant-dropdown-menu-item').first()).toContainText('Item One');
  });

  test('opens on hover trigger', async ({ page }) => {
    const trigger = getBlock(page, 'dm_hover_trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.hover();
    const dropdown = page.locator('.ant-dropdown').filter({ hasText: 'Hover A' });
    await expect(dropdown).toBeVisible();
  });

  test('displays menu items with icons', async ({ page }) => {
    const trigger = getBlock(page, 'dm_icons_trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dropdown = page.locator('.ant-dropdown').filter({ hasText: 'With Icon' });
    await expect(dropdown).toBeVisible();
    const iconItem = dropdown.locator('.ant-dropdown-menu-item').filter({ hasText: 'With Icon' });
    await expect(iconItem.locator('.anticon, svg')).toBeVisible();
  });

  test('fires onClick with correct key', async ({ page }) => {
    const trigger = getBlock(page, 'dm_click_trigger');
    await trigger.click();
    const item = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Item One' });
    await item.click();
    const display = getBlock(page, 'dm_click_display');
    await expect(display).toContainText('dm_click_item1');
  });

  test('handles disabled items', async ({ page }) => {
    const trigger = getBlock(page, 'dm_disabled_trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dropdown = page.locator('.ant-dropdown').filter({ hasText: 'Disabled' });
    await expect(dropdown).toBeVisible();
    const disabledItem = dropdown
      .locator('.ant-dropdown-menu-item')
      .filter({ hasText: 'Disabled' });
    await expect(disabledItem).toHaveClass(/ant-dropdown-menu-item-disabled/);
  });

  test('renders groups and dividers', async ({ page }) => {
    const trigger = getBlock(page, 'dm_groups_trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dropdown = page.locator('.ant-dropdown').filter({ hasText: 'Navigation' });
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toContainText('Other');
  });

  test('fires onOpenChange', async ({ page }) => {
    const trigger = getBlock(page, 'dm_openchange_trigger');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const display = getBlock(page, 'dm_openchange_display');
    await expect(display).toContainText('Open changed!');
  });

  test('closes on item selection', async ({ page }) => {
    const trigger = getBlock(page, 'dm_click_trigger');
    await trigger.click();
    const dropdown = page.locator('.ant-dropdown').first();
    await expect(dropdown).toBeVisible();
    const item = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Item Two' });
    await item.click();
    await expect(dropdown).toBeHidden();
  });

  test('renders danger items with correct styling', async ({ page }) => {
    const trigger = getBlock(page, 'dm_click_trigger');
    await trigger.click();
    const dangerItem = page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Danger Item' });
    await expect(dangerItem).toHaveClass(/ant-dropdown-menu-item-danger/);
  });
});

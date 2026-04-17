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

test.describe('DataDiff Block', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToTestPage(page, 'data-diff');
  });

  test('renders empty state when before and after are identical', async ({ page }) => {
    const block = getBlock(page, 'datadiff_empty');
    await expect(block).toBeVisible();
    await expect(block.locator('.ant-empty')).toBeVisible();
    await expect(block).toContainText('Nothing to show here.');
  });

  test('renders a basic Changed row with old and new values', async ({ page }) => {
    const block = getBlock(page, 'datadiff_basic');
    await expect(block).toBeVisible();
    await expect(block.locator('.ant-descriptions')).toBeVisible();
    await expect(block).toContainText('member');
    await expect(block).toContainText('admin');
    await expect(block).toContainText('Changed');
  });

  test('applies labels map to remap field names', async ({ page }) => {
    const block = getBlock(page, 'datadiff_labels');
    await expect(block).toContainText('Email address');
    await expect(block).not.toContainText('email:');
  });

  test('hides paths matching a prefix.* pattern', async ({ page }) => {
    const block = getBlock(page, 'datadiff_hide');
    await expect(block).toContainText('a@example.com');
    await expect(block).toContainText('b@example.com');
    await expect(block).not.toContainText('traceId');
  });

  test('renders boolean formatter with custom yes/no labels', async ({ page }) => {
    const block = getBlock(page, 'datadiff_boolean');
    await expect(block).toContainText('Enabled');
    await expect(block).toContainText('Disabled');
  });

  test('renders enum formatter with colored tags', async ({ page }) => {
    const block = getBlock(page, 'datadiff_enum');
    await expect(block).toContainText('Pending');
    await expect(block).toContainText('Paid');
  });

  test('renders Added and Removed change types', async ({ page }) => {
    const block = getBlock(page, 'datadiff_add_remove');
    await expect(block).toContainText('Added');
    await expect(block).toContainText('Removed');
  });

  test('groups changes under multiple root keys in a collapse', async ({ page }) => {
    const block = getBlock(page, 'datadiff_grouped');
    const collapses = block.locator('.ant-collapse > .ant-collapse-item');
    await expect(collapses).toHaveCount(2);
    await expect(block).toContainText('Profile');
    await expect(block).toContainText('Address');
  });

  test('shows unchanged rows when showUnchanged is true', async ({ page }) => {
    const block = getBlock(page, 'datadiff_unchanged');
    await expect(block).toContainText('Unchanged');
    await expect(block).toContainText('Changed');
  });

  test('renders sideBySide with two Descriptions inside a Row', async ({ page }) => {
    const block = getBlock(page, 'datadiff_side_by_side');
    await expect(block).toBeVisible();
    await expect(block.locator('.ant-row').first()).toBeVisible();
    const descriptions = block.locator('.ant-row .ant-descriptions');
    expect(await descriptions.count()).toBeGreaterThanOrEqual(2);
    await expect(block).toContainText('member');
    await expect(block).toContainText('admin');
    await expect(block).toContainText('Sarah');
    await expect(block).toContainText('Sarah Johnson');
  });

  test('renders timeline with one item per change', async ({ page }) => {
    const block = getBlock(page, 'datadiff_timeline');
    await expect(block.locator('.ant-timeline')).toBeVisible();
    await expect(block.locator('.ant-timeline-item')).toHaveCount(3);
  });

  test('array-of-objects sub-groups render per-item subheaders', async ({ page }) => {
    const block = getBlock(page, 'datadiff_orders_array');
    await expect(block).toContainText('Order 1');
    await expect(block).toContainText('Order 3');
    await expect(block).toContainText('~1');
    await expect(block).toContainText('+1');
  });

  test('deep path row uses breadcrumb label', async ({ page }) => {
    const block = getBlock(page, 'datadiff_deep_path');
    await expect(block).toContainText('Settings');
    await expect(block).toContainText('Display');
    await expect(block).toContainText('Theme');
    await expect(block).toContainText('Mode');
  });

  test('maxDepth collapses deep changes', async ({ page }) => {
    const block = getBlock(page, 'datadiff_max_depth');
    await expect(block.locator('pre').first()).toBeVisible();
    await expect(block).toContainText('Settings');
    await expect(block).toContainText('Display');
    await expect(block).toContainText('Theme');
    await expect(block).toContainText('"mode": "light"');
    await expect(block).toContainText('"mode": "dark"');
  });

  test('gitDiff renders +/- lines', async ({ page }) => {
    const block = getBlock(page, 'datadiff_git_diff');
    await expect(block.locator('pre')).toBeVisible();
    const lines = await block.locator('pre > span').allTextContents();
    expect(lines.some((line) => line.startsWith('+ '))).toBe(true);
    expect(lines.some((line) => line.startsWith('- '))).toBe(true);
    const joined = lines.join('\n');
    expect(joined).toContain('status');
  });
});

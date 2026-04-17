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
});

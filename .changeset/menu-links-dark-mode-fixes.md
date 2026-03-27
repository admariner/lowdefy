---
'@lowdefy/operators-js': minor
'@lowdefy/blocks-antd': minor
'@lowdefy/blocks-basic': patch
'@lowdefy/blocks-markdown': patch
'@lowdefy/build': patch
'@lowdefy/client': patch
'@lowdefy/server-dev': patch
'@lowdefy/server': patch
---

feat: `_menu` operator returns links array directly with dot-path access.

**`_menu` Operator (`@lowdefy/operators-js`)**

- `_menu: menuId` now returns the `links` array directly instead of the full menu object
- Supports dot-path access: `_menu: profile_menu.0.pageId`
- `_menu: true` and `{ all: true }` still return the full menus array

**Dark Mode Fixes (`@lowdefy/blocks-antd`, `@lowdefy/server-dev`, `@lowdefy/server`)**

- Notification, Message, and ConfirmModal now render with correct dark mode colors (migrated to `App.useApp()` hooks)
- Mobile menu drawer background matches the drawer theme
- 404 page and loading state use theme-aware backgrounds
- `getDarkMode()` uses single source of truth from `useDarkMode` hook

**Profile & Notifications (`@lowdefy/blocks-antd`)**

- Added `notifications.link` property for navigation (replaces `onNotificationClick` event)
- Removed `onNotificationClick` and `onProfileClick` events
- Removed `collapsible` and `initialCollapsed` from PageSiderMenu sider
- Fixed Search block keyboard navigation with grouped results
- Removed horizontal menu border from PageHeaderMenu header

**Build Error Messages (`@lowdefy/build`)**

- Schema validation errors now include the property name (e.g., `"properties" must be object`)
- Style/class errors suggest dot-prefixed CSS slot keys when applicable
- YAML parse errors surface immediately instead of crashing on null entries

**Gallery Dark Mode (`@lowdefy/blocks-basic`, `@lowdefy/blocks-markdown`)**

- Replaced hardcoded hex colors with `var(--ant-*)` tokens in Html, DangerousHtml, Markdown, and MarkdownWithCode gallery examples

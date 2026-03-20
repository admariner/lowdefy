---
'@lowdefy/blocks-antd': minor
---

feat: Add PageSidebarLayout block

New full-page layout block with a full-height sidebar, no top-level header, and mobile drawer navigation. The sider spans the entire viewport height with the logo pinned at the bottom.

**PageSidebarLayout**

- Full-height collapsible sider with inline menu
- Sider collapse state persists in localStorage (configurable key via `siderStorageKey`)
- Cascading `theme` property — set `theme: dark` to apply dark mode to sider, menu, headers, and mobile drawer. Individual overrides (`sider.theme`, `header.theme`, `mobileHeader.theme`) take precedence. As an object, applies Ant Design design tokens to all child components
- Responsive logo: full logo when sider is expanded, square logo when collapsed
- 8 content slots: content, footer, header, siderOpen, siderClosed, mobileExtra, mobileDrawerContent, mobileDrawerFooter

**Drawer**

- Added `footer` content slot and `styles.footer` passthrough

**MobileMenu**

- Added `logo` property for drawer header branding
- Added `drawerContent` and `drawerFooter` content slots
- Changed category from `display` to `container` to support slot resolution
- Dark drawer theme applied automatically when `theme: dark`

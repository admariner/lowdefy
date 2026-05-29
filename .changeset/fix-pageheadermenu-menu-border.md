---
'@lowdefy/blocks-antd': patch
---

fix: PageHeaderMenu active menu item underline now sits on the header's bottom border.

The horizontal menu was vertically centered in the 64px header, so the active item's underline floated above the header's bottom border (two disconnected lines). The menu now fills the header height (`lineHeight: var(--ant-layout-header-height, 64px)`) so the active underline aligns with the header divider, matching the single-border look of Sider / PageSiderMenu.

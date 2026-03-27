---
'@lowdefy/blocks-antd': patch
'@lowdefy/server': patch
'@lowdefy/docs': patch
---

fix: Date selectors, production Tailwind CSS, dark mode icons, and new Calendar block.

**Date Selector Fix (`@lowdefy/blocks-antd`)**

- Fixed `e.utc is not a function` error in production builds. Antd v6 bundles its own dayjs without the UTC plugin — date selector onChange and disabledDate callbacks now wrap antd's dayjs instances with the extended dayjs before calling `.utc()`.
- Affected blocks: DateSelector, DateTimeSelector, DateRangeSelector, WeekSelector, MonthSelector, and the shared disabledDate utility.

**Dark Mode Toggle Icons (`@lowdefy/blocks-antd`)**

- Swapped dark/light mode toggle icons so dark mode shows the moon and light mode shows the sun.

**New Calendar Block (`@lowdefy/blocks-antd`)**

- Added Calendar block with full-size and compact modes, date selection events (onChange, onSelect, onPanelChange), disabled dates, valid range, and date cell badge data.

**Production Tailwind CSS (`@lowdefy/server`)**

- Fixed Tailwind utility classes missing in production builds. The `postcss.config.js` file was not included in the published npm package, so Next.js skipped the Tailwind PostCSS plugin entirely.

**Docs (`@lowdefy/docs`)**

- Added Calendar block documentation page.

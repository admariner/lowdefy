---
'@lowdefy/build': patch
'@lowdefy/server-dev': patch
---

fix(build): Dev server now discovers icons referenced only in page content.

Icons that were only used inside page blocks (e.g., `icon: IoAddCircle` on a Button) were not imported during the dev server's incremental build, causing a fallback icon to render. The JIT page builder now detects missing icon references when a page is compiled and regenerates the icon import file automatically.

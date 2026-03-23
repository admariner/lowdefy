---
'@lowdefy/blocks-aggrid': minor
---

AG Grid blocks now auto-detect dark mode via `prefers-color-scheme` media query. Light theme blocks (AgGridAlpine, AgGridBalham, AgGridMaterial, and their Input variants) automatically switch to their dark theme counterpart when the user's system is in dark mode. The explicit dark variant blocks (AgGridAlpineDark, AgGridBalhamDark, AgGridInputAlpineDark, AgGridInputBalhamDark) have been removed as they are no longer needed.

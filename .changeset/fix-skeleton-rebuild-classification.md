---
'@lowdefy/build': patch
'@lowdefy/server-dev': patch
---

fix(build,server-dev): Improved accuracy of dev server skeleton rebuild detection.

The dev server previously used a path-based heuristic to decide which file changes required a skeleton rebuild. This could miss changes to API endpoints referenced from page directories, and unnecessarily rebuild for non-skeleton page templates. Skeleton rebuild classification now uses the build's ref map as the source of truth, ensuring only the correct file changes trigger skeleton rebuilds.

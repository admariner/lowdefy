---
'@lowdefy/ai-utils': minor
---

feat(ai-utils): Add agent `generateTitle` option to auto-generate conversation titles.

Set `generateTitle: true` (or `generateTitle: { model: '<cheaper-model>' }`) on an AISDKAgent to generate a short title from the first user message on the first turn. The title is produced with a one-shot `generateText` call that runs concurrently with the response and emits a `data-chat-title` data part, which fires the `AgentChat` block's `onTitleGenerated` event. Off by default; title-generation failures are non-fatal (logged, the turn continues).

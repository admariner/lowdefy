---
'@lowdefy/blocks-antd-x': minor
---

feat(blocks-antd-x): `AgentChat` auto-mints a `conversationId` and emits `onConversationStart`.

When no `conversationId` property is set, `AgentChat` now mints a stable session id at mount and uses it for every request, so a turn sent before the app assigns an id (e.g. clicking a welcome prompt) no longer posts with an undefined id. The effective id is surfaced once per conversation, on its first user message, via a new `onConversationStart` event so apps can persist or track with a guaranteed id. App-supplied `conversationId` values remain authoritative.

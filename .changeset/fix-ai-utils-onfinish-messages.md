---
'@lowdefy/ai-utils': patch
---

fix(ai-utils): Include the generated assistant reply in the agent `onFinish` hook payload `messages`.

Previously the `onFinish` hook payload's `messages` array contained only the request input, so a `save-conversation`-style hook persisted the user's turns but never the assistant's reply (a first-turn save stored a single message). `handleAgentChat` now captures the final UI message list (input plus the generated assistant message, including tool parts) from the stream's `onFinish` and uses it in the payload, falling back to the input only when the stream errors or aborts before completing. This repairs server-side conversation persistence.

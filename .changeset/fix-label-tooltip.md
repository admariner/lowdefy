---
'@lowdefy/blocks-antd': minor
---

Label and input blocks no longer show an unwanted browser tooltip duplicating the label, which previously leaked raw HTML markup on hover when the label title contained HTML. Tooltips are now opt-in: set the new `tooltip` property (supports HTML) to show a help icon beside the label with an accessible Ant Design tooltip. This applies to all label-based inputs (ButtonSelector, Selector, CheckboxSelector, RadioSelector, etc.).

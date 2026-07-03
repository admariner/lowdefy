## Group mentions

Beyond the flat mention list, `TiptapMentionInput` can treat some mention options as **groups** — an app-defined kind such as a role, a team, a queue, or a saved segment. A group mention:

- sits under its own heading in the suggestion menu (`tag.section`),
- renders as a distinctly coloured chip (`tag.color` / `mentions.groupColors`), and
- shows the group's current members in a hover popover in the live editor (`mentions.groupMembers`).

The block hardcodes no group. Your app decides which groups exist, what they are called, how they are coloured, and who belongs to them — the block only reflects that data onto the chip and the menu.

### Presentation lives on `tag`, storage lives on `value`

Each mention option is an object of the form `{ label, value, tag }`:

- `label` — the text matched against what the author types (unchanged).
- `value` — the **opaque payload** stored on the mention node and emitted in the block's `mentions` value. Its shape is entirely yours; the block never reads it for presentation.
- `tag` — the presentation fields the block reads to render the chip and menu.

All group behaviour is driven from `tag`, never from `value`. This keeps `value` free to hold whatever your app needs to expand the mention later (a role slug, a queue id, a segment query), while the block stays a pure presentation layer.

The `tag` fields are not listed in the properties table above, because `options` has no per-item schema. They are:

| Field         | Purpose                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `tag.title`   | Chip text — `@Finance` renders from `tag.title: Finance`. Falls back to `label`.                                    |
| `tag.section` | Menu heading this option sits under. Options without a section render flat, with no heading.                        |
| `tag.group`   | Marks this option a **group** chip. An opaque, app-defined string — it becomes the chip class, the `data-mention-group` attribute, and the hover lookup key. |
| `tag.color`   | Chip colour for this option. Overrides `mentions.groupColors` for the option's group.                               |

An individual-person option simply omits `section`, `group`, and `color`, and renders exactly as before.

Sections and groups are **orthogonal**: a section is a menu heading, a group is a chip identity. You may put several group options under one "Roles" section, give each group its own section, or use sections purely to group people with no group chips at all.

### `mentions.limit`

`limit` (integer, default `5`) caps how many suggestions the menu shows. When at least one visible option declares a `tag.section`, the cap is applied **per section**, so a large "People" section can't crowd every "Roles" option out of the list. When no option declares a section, the same limit caps the flat list, matching the pre-group behaviour.

### `mentions.groupColors` — static, available at mount

`groupColors` is a `{ '<group>': '<cssColor>' }` map that colours every chip of a given group in one place:

```yaml
mentions:
  groupColors:
    finance: '#722ed1'
    devs: '#13c2c2'
```

The resolved colour is written as an inline `style` on the chip, so it travels with the saved HTML — a group chip looks right anywhere the stored content is rendered, with no per-app stylesheet.

> **`groupColors` must be static config available when the block mounts.** It is read once, where the mention extension is created, and is **not** refreshed afterwards. A `groupColors` map loaded from a request that resolves after the block mounts will produce uncoloured chips. Supply it as static config (a colour palette is naturally static). For any colour that arrives dynamically, use per-option `tag.color` instead — it rides on the selected option, so it is always current. The same mount-time capture applies to `mentions.limit` and `mentions.char`.

### `mentions.groupMembers` — may be async

`groupMembers` is a `{ '<group>': [{ name, email }] }` map. Hovering a group chip in the **live editor** shows a popover listing that group's current members:

```yaml
mentions:
  groupMembers:
    finance:
      - { name: Jane Doe, email: jane@example.com }
    devs:
      - { name: Ada Lovelace, email: ada@example.com }
```

Unlike `groupColors`, `groupMembers` **may be loaded from a request** — it is read live, at hover time, so it does not need to be present at mount. This asymmetry is intentional: colour is captured once when the editor is created, member lists are looked up on each hover.

Hover is scoped to the live editor only. If the group has no entry in `groupMembers`, no popover shows.

### `getHref` — nullish renders a `<span>`

`getHref` is an optional `_function` that receives the selected option and returns an href. Its **return value** decides the element:

- a non-nullish return renders the mention as an `<a>`;
- a nullish return (`null`/`undefined`) renders a plain `<span>`.

Return `null` for group options — a group has no profile page — and a URL for people.

> Return `null` or `undefined`, **not** an empty string. `''` is not nullish, so `getHref` returning `''` still renders `<a href="">`.

### Emitted chip markup

A group chip renders as:

```html
<span class="tiptap-mention tiptap-mention-group" data-mention-group="finance" style="color: #722ed1">@Finance</span>
```

(or an `<a>` with the same classes and attributes when `getHref` returns a link). The colour is inlined via `style`, and the group key is exposed as `data-mention-group`. An app that renders saved comment HTML elsewhere — a comment timeline, a notification email — can style these chips or attach its own hover behaviour by targeting the `data-mention-group` attribute. The block's own hover popover is live-editor-only, so any hover on saved content is the app's to build against the same attribute.

### Worked example

A mixed `options` array — people with no group alongside group options carrying `tag.section`, `tag.group`, and optionally `tag.color` — a `groupColors` map, a `groupMembers` map, and a `getHref` that returns `null` for groups:

```yaml
- id: comment
  type: TiptapMentionInput
  properties:
    mentions:
      char: '@'
      limit: 8 # per-section result cap
      getHref:
        _function:
          # people carry value.contact_id and link to a profile;
          # groups don't → null href → chip renders as a <span>
          __if:
            test:
              __type:
                type: string
                on:
                  __args: 0.value.contact_id
            then:
              __string.concat: ['/contacts?_id=', __args: 0.value.contact_id]
            else: null
      options:
        - label: Jane Doe # person — no tag.group, links to a profile
          value:
            contact_id: c_001
          tag:
            title: Jane Doe
            section: People
        - label: Ada Lovelace
          value:
            contact_id: c_002
          tag:
            title: Ada Lovelace
            section: People
        - label: Finance # group — no profile link, coloured chip, hover members
          value:
            type: role
            role: finance-admin
          tag:
            title: Finance
            section: Roles
            group: finance
            color: '#722ed1' # overrides groupColors.finance for this option
        - label: Developers
          value:
            type: role
            role: developers
          tag:
            title: Developers
            section: Roles
            group: devs
      groupColors: # colour each group once; tag.color overrides per option
        finance: '#722ed1'
        devs: '#13c2c2'
      groupMembers: # shown on chip hover in the live editor; may come from a request
        finance:
          - { name: Jane Doe, email: jane@example.com }
        devs:
          - { name: Ada Lovelace, email: ada@example.com }
```

`options` and `groupMembers` are typically populated from requests (`_request: mention_options`, `_request: group_members`). How that data is built, and how the stored `value` is later expanded to notification recipients, are entirely app-side — the block only records the mention.

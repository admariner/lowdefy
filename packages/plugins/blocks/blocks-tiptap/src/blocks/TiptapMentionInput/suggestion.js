/*
  Copyright 2020-2026 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { ReactRenderer } from '@tiptap/react';
import { type } from '@lowdefy/helpers';
import tippy from 'tippy.js';

import MentionList from './MentionList.js';
import itemSection from './itemSection.js';

function suggestion({ methods, char = '@', allowSpaces = true, limit = 5 }) {
  return {
    // `char` must be set explicitly: Mention.configure does a shallow merge
    // on its options.suggestion, replacing the extension's default `@`.
    char,
    allowSpaces,
    items: ({ query, editor }) => {
      const itemsList = editor.options.editorProps.items ?? [];
      const filtered = itemsList.filter((item) => {
        if (type.isString(item)) {
          return item.toLowerCase().includes(query.toLowerCase());
        }
        if (type.isString(item?.label)) {
          return item.label.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });
      // no option declares a section → flat list capped at limit (today's behaviour)
      if (!filtered.some((item) => !type.isNone(itemSection(item)))) {
        return filtered.slice(0, limit);
      }
      const counts = new Map();
      return filtered.filter((item) => {
        const section = itemSection(item);
        const n = counts.get(section) ?? 0;
        if (n >= limit) return false;
        counts.set(section, n + 1);
        return true;
      });
    },

    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
            props: { ...props, methods },
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          component.updateProps(props);
          if (!props.clientRect) return;
          popup[0].setProps({ getReferenceClientRect: props.clientRect });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}

export default suggestion;

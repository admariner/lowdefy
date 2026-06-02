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

import React from 'react';
import { ConfigProvider, Radio } from 'antd';
import { renderHtml, withBlockDefaults } from '@lowdefy/block-utils';
import { type } from '@lowdefy/helpers';

import Label from '../Label/Label.js';
import getSelectedIndex from '../../getSelectedIndex.js';
import useSelectorOptions from '../../useSelectorOptions.js';
import getContrastTextColor from '../../getContrastTextColor.js';
import getOptionColorStyle from '../../getOptionColorStyle.js';
import withTheme from '../withTheme.js';

const ButtonSelector = ({
  blockId,
  classNames = {},
  components,
  events,
  loading,
  properties,
  required,
  styles = {},
  validation,
  value,
  methods,
}) => {
  const uniqueValueOptions = useSelectorOptions({ properties, methods });
  // `variant` (solid | outlined) matches the Button block. `buttonStyle` is a
  // deprecated alias kept for backward compatibility.
  const variant =
    properties.variant ?? (properties.buttonStyle === 'outline' ? 'outlined' : 'solid');
  const isOutline = variant === 'outlined';
  const selectedIndex = type.isNone(value)
    ? undefined
    : getSelectedIndex(value, uniqueValueOptions, { properties });
  const contrastColor = getContrastTextColor(properties.color);
  const themeConfig = { token: { colorPrimary: properties.color } };
  if (contrastColor) {
    themeConfig.components = { Radio: { buttonSolidCheckedColor: contrastColor } };
  }
  const radioGroup = (
    <Radio.Group
      id={`${blockId}_input`}
      className={classNames.element}
      disabled={properties.disabled || loading}
      size={properties.size}
      buttonStyle={isOutline ? 'outline' : 'solid'}
      style={styles.element}
      onChange={(event) => {
        const value = type.isPrimitive(uniqueValueOptions[event.target.value])
          ? uniqueValueOptions[event.target.value]
          : uniqueValueOptions[event.target.value].value;
        methods.setValue(value);
        methods.triggerEvent({ name: 'onChange', event: { value } });
      }}
      value={type.isNone(value) ? undefined : getSelectedIndex(value, uniqueValueOptions, { properties })}
    >
      {uniqueValueOptions.map((opt, i) => {
        const isSelected = `${i}` === selectedIndex;
        const optColor = type.isPrimitive(opt) ? undefined : opt.color;
        let selectedStyle;
        if (isSelected && optColor) {
          // A selected option with its own color overrides the block-level color.
          selectedStyle = getOptionColorStyle({ color: optColor, isOutline });
        } else if (isSelected && isOutline) {
          // Block-level outline tint follows currentColor (the active colorPrimary).
          selectedStyle = { backgroundColor: 'color-mix(in srgb, currentColor 12%, transparent)' };
        }
        return type.isPrimitive(opt) ? (
          <Radio.Button
            id={`${blockId}_${i}`}
            key={i}
            value={`${i}`}
            disabled={properties.disabled || loading}
            style={selectedStyle}
          >
            {renderHtml({ html: `${opt}`, methods })}
          </Radio.Button>
        ) : (
          <Radio.Button
            id={`${blockId}_${i}`}
            key={i}
            value={`${i}`}
            disabled={opt.disabled || properties.disabled || loading}
            style={{ ...opt.style, ...selectedStyle }}
          >
            {type.isNone(opt.label)
              ? renderHtml({ html: `${opt.value}`, methods })
              : renderHtml({ html: opt.label, methods })}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
  return (
    <Label
      blockId={blockId}
      classNames={classNames}
      components={components}
      events={events}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      validation={validation}
      required={required}
      styles={styles}
      content={{
        content: () =>
          properties.color ? (
            <ConfigProvider theme={themeConfig}>{radioGroup}</ConfigProvider>
          ) : (
            radioGroup
          ),
      }}
    />
  );
};

export default withTheme('Radio', withBlockDefaults(ButtonSelector));

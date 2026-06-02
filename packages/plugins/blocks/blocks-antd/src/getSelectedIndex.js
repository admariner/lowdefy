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

import { get, serializer, type } from '@lowdefy/helpers';

// Maps the current block value to the index (or indices) of the matching entry built by
// getSelectorOptions. Matching is by identity: `primaryKey` (falling back to `valueKey`) names the
// field compared on both sides, so a stored key OR a whole row both resolve to the right option.
// With neither key set the whole value is compared (the original `value` behaviour). Key resolution
// mirrors getSelectorOptions: `options` mode defaults `valueKey` to "value"; `data` mode keeps it raw
// (omitted => the whole row is the value/identity).
const serialize = (x) => serializer.serializeToString(x, { stable: true });

const getSelectedIndex = (value, entries, { properties = {}, multiple } = {}) => {
  const usingData = type.isArray(properties.data);
  const valueKey = usingData ? properties.valueKey : properties.valueKey ?? 'value';
  const effKey = type.isString(properties.primaryKey) ? properties.primaryKey : valueKey;

  const idOfValue = (v) => (type.isString(effKey) && type.isObject(v) ? get(v, effKey) : v);
  const idOfEntry = (entry) => {
    if (type.isPrimitive(entry)) return entry;
    if (type.isString(effKey)) return get(entry, effKey);
    return entry.value;
  };

  const findIndex = (v) => {
    const target = serialize(idOfValue(v));
    for (let i = 0; i < entries.length; i += 1) {
      if (serialize(idOfEntry(entries[i])) === target) return `${i}`;
    }
    return undefined;
  };

  if (multiple) {
    return (type.isArray(value) ? value : []).map((v) => findIndex(v));
  }
  return findIndex(value);
};

export default getSelectedIndex;

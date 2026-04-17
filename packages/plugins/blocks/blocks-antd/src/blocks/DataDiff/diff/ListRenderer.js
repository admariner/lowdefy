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
import { Collapse, Descriptions, Space, Tag, Typography } from 'antd';

import ChangeTypeTag from './ChangeTypeTag.js';
import ValueCell from './ValueCell.js';
import { humaniseSegment, pathLabel } from './pathUtils.js';
import { GROUP_ROOT } from './constants.js';

const { Text } = Typography;

function resolveGroupLabel(group, labels) {
  if (!group.label) return '';
  return pathLabel([group.key], labels) || humaniseSegment(group.key);
}

function SummaryChips({ summary }) {
  const chips = [];
  if (summary.added > 0) {
    chips.push(
      <Tag key="added" color="success" style={{ marginInlineEnd: 0 }}>
        {`+${summary.added}`}
      </Tag>
    );
  }
  if (summary.removed > 0) {
    chips.push(
      <Tag key="removed" color="error" style={{ marginInlineEnd: 0 }}>
        {`−${summary.removed}`}
      </Tag>
    );
  }
  if (summary.changed > 0) {
    chips.push(
      <Tag key="changed" color="warning" style={{ marginInlineEnd: 0 }}>
        {`~${summary.changed}`}
      </Tag>
    );
  }
  if (summary.unchanged > 0) {
    chips.push(
      <Tag key="unchanged" style={{ marginInlineEnd: 0 }}>
        {`·${summary.unchanged}`}
      </Tag>
    );
  }
  if (chips.length === 0) return null;
  return (
    <Space size={4} wrap>
      {chips}
    </Space>
  );
}

function ArraySummary({ summary }) {
  const parts = [];
  if (summary.added > 0) parts.push(`+${summary.added} added`);
  if (summary.removed > 0) parts.push(`−${summary.removed} removed`);
  if (summary.changed > 0) parts.push(`~${summary.changed} changed`);
  if (parts.length === 0) return null;
  return (
    <Text type="secondary" style={{ fontSize: '0.85em', paddingInlineStart: 4 }}>
      {parts.join(' · ')}
    </Text>
  );
}

function buildDescriptionItems(changes, { classNames, changeTypeLabels, collapseNested }) {
  return changes.map((change, index) => ({
    key: change.pathStr || `row-${index}`,
    label: (
      <Space size={8} align="center" wrap>
        <span className={classNames?.row}>{change.label || change.displayPath}</span>
        <ChangeTypeTag type={change.type} labels={changeTypeLabels} className={classNames?.tag} />
      </Space>
    ),
    children: <ValueCell change={change} collapseNested={collapseNested} />,
  }));
}

function GroupBody({ group, classNames, changeTypeLabels, collapseNested }) {
  const items = buildDescriptionItems(group.changes, {
    classNames,
    changeTypeLabels,
    collapseNested,
  });
  return (
    <Space direction="vertical" size={8} style={{ display: 'flex', width: '100%' }}>
      {group.summary.hasArrayIndices && <ArraySummary summary={group.summary} />}
      <Descriptions
        size="small"
        column={1}
        colon={false}
        bordered
        items={items}
        className={classNames?.group}
      />
    </Space>
  );
}

function ListRenderer({
  model,
  classNames = {},
  styles = {},
  collapseNested = true,
  changeTypeLabels,
  labels,
}) {
  const meaningful = model.groups.filter((group) => group.changes.length > 0);
  if (meaningful.length === 0) return null;

  const rootGroup = meaningful.find((group) => group.key === GROUP_ROOT);
  const namedGroups = meaningful.filter((group) => group.key !== GROUP_ROOT);

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      {rootGroup && (
        <GroupBody
          group={rootGroup}
          classNames={classNames}
          changeTypeLabels={changeTypeLabels}
          collapseNested={collapseNested}
        />
      )}
      {namedGroups.length === 1 && (
        <div className={classNames?.group} style={styles?.group}>
          <Space size={8} align="center" style={{ marginBottom: 8 }}>
            <Text strong>{resolveGroupLabel(namedGroups[0], labels)}</Text>
            <SummaryChips summary={namedGroups[0].summary} />
          </Space>
          <GroupBody
            group={namedGroups[0]}
            classNames={classNames}
            changeTypeLabels={changeTypeLabels}
            collapseNested={collapseNested}
          />
        </div>
      )}
      {namedGroups.length > 1 && (
        <Collapse
          size="small"
          defaultActiveKey={namedGroups
            .filter(
              (group) => group.summary.added + group.summary.removed + group.summary.changed > 0
            )
            .map((group) => group.key)}
          items={namedGroups.map((group) => ({
            key: group.key,
            label: (
              <Space size={8} align="center" wrap>
                <Text strong>{resolveGroupLabel(group, labels)}</Text>
                <SummaryChips summary={group.summary} />
              </Space>
            ),
            children: (
              <GroupBody
                group={group}
                classNames={classNames}
                changeTypeLabels={changeTypeLabels}
                collapseNested={collapseNested}
              />
            ),
          }))}
          className={classNames?.group}
          style={styles?.group}
        />
      )}
    </Space>
  );
}

export default ListRenderer;

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

import React, { useMemo } from 'react';
import { Empty, Space, Typography } from 'antd';
import { renderHtml, withBlockDefaults } from '@lowdefy/block-utils';

import ListRenderer from './diff/ListRenderer.js';
import buildDiffModel from './diff/buildDiffModel.js';
import withTheme from '../withTheme.js';

const { Title } = Typography;

const DataDiffBlock = ({ blockId, classNames = {}, properties, methods, styles = {} }) => {
  const {
    before,
    after,
    title,
    emptyText = 'No changes',
    labels,
    hide,
    show,
    format,
    showUnchanged = false,
    groupByRoot = true,
    collapseNested = true,
    changeTypeLabels,
  } = properties;

  const model = useMemo(
    () =>
      buildDiffModel({
        before,
        after,
        options: { labels, hide, show, format, showUnchanged, groupByRoot },
      }),
    [before, after, labels, hide, show, format, showUnchanged, groupByRoot]
  );

  return (
    <div id={blockId} className={classNames.element} style={styles.element}>
      <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
        {title && (
          <Title level={5} className={classNames.title} style={{ margin: 0, ...styles.title }}>
            {renderHtml({ html: title, methods })}
          </Title>
        )}
        {model.empty ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyText}
            style={{ padding: '16px 0' }}
          />
        ) : (
          <ListRenderer
            model={model}
            classNames={classNames}
            styles={styles}
            collapseNested={collapseNested}
            changeTypeLabels={changeTypeLabels}
            labels={labels}
          />
        )}
      </Space>
    </div>
  );
};

export default withTheme('Descriptions', withBlockDefaults(DataDiffBlock));

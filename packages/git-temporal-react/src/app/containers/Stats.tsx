import React from 'react';
// @ts-ignore
import { useSelector } from 'react-redux';

import { style } from 'app/styles';
import { getAuthorDateRange } from 'app/selectors/commits';
import { StackedLabel } from 'app/components/StackedLabel';
import { EpochSpan } from 'app/components/EpochSpan';
import { ExplodeOnChange } from 'app/components/ExplodeOnChange';

const outerStyle = {
  _extends: ['flexRow'],
  marginBottom: '@margins.medium+px',
  paddingLeft: '@margins.medium+px',
  flexShrink: 0,
};

export const Stats: React.FC = (): React.ReactElement => {
  const { minAuthorDate, maxAuthorDate } = useSelector(getAuthorDateRange);

  return (
    <div style={style(outerStyle)}>
      <StackedLabel label="Selected Time Span">
        <ExplodeOnChange value={minAuthorDate + maxAuthorDate}>
          <EpochSpan
            firstEpochTime={minAuthorDate}
            secondEpochTime={maxAuthorDate}
          />
        </ExplodeOnChange>
      </StackedLabel>
      <StackedLabel label="Last Commit">
        <div>
          <ExplodeOnChange value={maxAuthorDate}>
            <EpochSpan
              firstEpochTime={maxAuthorDate}
              secondEpochTime={Date.now() / 1000}
            />
            <span> ago</span>
          </ExplodeOnChange>
        </div>
      </StackedLabel>
    </div>
  );
};

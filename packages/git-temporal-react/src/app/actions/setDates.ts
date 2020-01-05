import { fetchDiff } from 'app/actions/diff';
import { debug } from 'app/utilities/logger';

import { setStartDate, setEndDate } from 'app/actions';
import { dateFilteredCommits } from 'app/selectors/dates';
import { commits } from 'app/reducers/commits';

export const setDates = (_startDate: number, _endDate: number | Date) => (
  dispatch,
  getState
) => {
  const [startDate, endDate] =
    _startDate === _endDate
      ? [_startDate, _endDate + 1]
      : !_endDate || _startDate < _endDate
        ? [_startDate, _endDate]
        : [_endDate, _startDate];

  const epochStartDate = startDate && Math.floor((startDate as number) / 1000);
  const epochEndDate = endDate && Math.floor((endDate as number) / 1000);

  debug('actions: setDates', startDate, endDate, epochStartDate, epochEndDate);

  dispatch(setStartDate(epochStartDate));
  dispatch(setEndDate(epochEndDate));

  const { commits, selectedPath } = getState();
  const leftCommit =
    (startDate && commits.find(c => c.authorDate < epochStartDate)) || null;
  const rightCommit =
    (endDate && commits.find(c => c.authorDate < epochEndDate)) || null;

  dispatch(fetchDiff(selectedPath, leftCommit, rightCommit));
};

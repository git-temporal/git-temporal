import { fetchDiff } from 'app/actions/diff';
import { debug } from 'app/utilities/logger';

import { setStartDate, setEndDate } from 'app/actions';
import { dateFilteredCommits } from 'app/selectors/dates';
import { commits } from 'app/reducers/commits';

export const setDates = (startDate: number, endDate: number | Date) => (
  dispatch,
  getState
) => {
  const epochStartDate = Math.floor(startDate / 1000);
  const epochEndDate = endDate && Math.floor((endDate as number) / 1000);

  const [newStartDate, newEndDate] =
    epochStartDate === epochEndDate
      ? [epochStartDate, null]
      : !epochEndDate || epochStartDate < epochEndDate
        ? [epochStartDate, epochEndDate]
        : [epochEndDate, epochStartDate];

  debug(
    'actions: setDates',
    startDate,
    endDate,
    epochStartDate,
    epochEndDate,
    newStartDate,
    newEndDate
  );

  dispatch(setStartDate(newStartDate));
  dispatch(setEndDate(newEndDate));

  const { commits, selectedPath } = getState();
  const leftCommit =
    (newStartDate && commits.find(c => c.authorDate < newStartDate)) || null;
  const rightCommit =
    (newEndDate && commits.find(c => c.authorDate < newEndDate)) || null;

  dispatch(fetchDiff(selectedPath, leftCommit, rightCommit));
};

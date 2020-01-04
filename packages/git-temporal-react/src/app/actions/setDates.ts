import { fetchDiff } from 'app/actions/diff';
import { debug } from 'app/utilities/logger';

import { setStartDate, setEndDate } from 'app/actions';
import {
  getDefaultedStartDate,
  getDefaultedEndDate,
  dateFilteredCommits,
} from 'app/selectors/dates';

export const setDates = (startDate: number, endDate: number | Date | null) => (
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

  const state = getState();
  const commitsForDates = dateFilteredCommits(
    state.commits,
    newStartDate,
    newEndDate
  );

  dispatch(
    fetchDiff(
      state.selectedPath,
      commitsForDates[commitsForDates.length - 1],
      commitsForDates[0]
    )
  );
};

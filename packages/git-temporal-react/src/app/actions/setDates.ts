import { fetchDiff } from 'app/actions/diff';
import { debug } from '@git-temporal/logger';

import { setStartDate, setEndDate } from 'app/actions';
import { defaultStartDate, defaultEndDate } from 'app/selectors/dates';

export const setDates = (startDate: number, endDate: number | Date | null) => (
  dispatch,
  getState
) => {
  const epochStartDate = Math.floor(startDate / 1000);
  const epochEndDate = endDate && Math.floor((endDate as number) / 1000);

  debug('actions: setDates', startDate, epochStartDate, endDate, epochEndDate);
  const [newStartDate, newEndDate] =
    epochStartDate === epochEndDate
      ? [epochStartDate, null]
      : !epochEndDate || epochStartDate < epochEndDate
        ? [epochStartDate, epochEndDate]
        : [epochEndDate, epochStartDate];

  dispatch(setStartDate(newStartDate));
  dispatch(setEndDate(newEndDate));

  const { path, commits } = getState();
  dispatch(
    fetchDiff(
      path,
      commits,
      defaultStartDate(newStartDate, commits),
      defaultEndDate(newEndDate, commits)
    )
  );
};

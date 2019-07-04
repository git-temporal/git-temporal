import { debug } from '@git-temporal/logger';

import { setStartDate, setEndDate } from 'app/actions';
import { fetchDiff } from 'app/actions/diff';
import { ICommit } from 'app/interfaces';

export function setDates(
  dispatch: (args: any) => void,
  commits: ICommit[],
  selectedPath: string,
  startDate: number,
  endDate: number | Date | null
) {
  const epochStartDate = Math.floor(startDate / 1000);
  const epochEndDate = endDate && Math.floor((endDate as number) / 1000);

  debug('Timeplot: setDates', startDate, epochStartDate, endDate, epochEndDate);
  const [newStartDate, newEndDate] =
    epochStartDate === epochEndDate
      ? [epochStartDate, null]
      : !epochEndDate || epochStartDate < epochEndDate
        ? [epochStartDate, epochEndDate]
        : [epochEndDate, epochStartDate];

  dispatch(setStartDate(newStartDate));
  dispatch(setEndDate(newEndDate));
  dispatch(fetchDiff(selectedPath, commits, newStartDate, newEndDate));
}

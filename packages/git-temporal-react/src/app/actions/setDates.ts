import { ICommit } from 'app/interfaces';
import { setStartDate, setEndDate } from 'app/actions';
import { fetchDiff } from 'app/actions/diff';

export function setDates(
  dispatch,
  selectedPath: string,
  commits: ICommit[],
  startDate: number,
  endDate: number,
  preferEndDate: boolean,
  date: number
) {
  const epochDate = Math.floor(date / 1000);
  let newStartDate = null;
  let newEndDate = null;
  if (!startDate && !endDate) {
    newStartDate = epochDate;
  } else if (startDate) {
    if (preferEndDate) {
      if (epochDate < startDate) {
        newStartDate = epochDate;
        newEndDate = startDate;
      } else {
        newEndDate = epochDate;
      }
    } else {
      if (endDate && epochDate > endDate) {
        newStartDate = endDate;
        newEndDate = epochDate;
      } else {
        newStartDate = epochDate;
      }
    }
  }
  dispatch(setStartDate(newStartDate));
  dispatch(setEndDate(newEndDate));
  dispatch(fetchDiff(selectedPath, commits, newStartDate, newEndDate));
}

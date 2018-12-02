import { setStartDate, setEndDate } from 'app/actions';

export function setDates(dispatch, startDate, endDate, preferEndDate, date) {
  const epochDate = Math.floor(date / 1000);
  if (!startDate && !endDate) {
    dispatch(setStartDate(epochDate));
  } else if (startDate) {
    if (preferEndDate) {
      if (epochDate < startDate) {
        dispatch(setEndDate(startDate));
        dispatch(setStartDate(epochDate));
      } else {
        dispatch(setEndDate(epochDate));
      }
    } else {
      if (endDate && epochDate > endDate) {
        dispatch(setStartDate(endDate));
        dispatch(setEndDate(epochDate));
      } else {
        dispatch(setStartDate(epochDate));
      }
    }
  }
}

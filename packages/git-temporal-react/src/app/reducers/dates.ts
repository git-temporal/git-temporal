import { ActionTypes } from 'app/actions/ActionTypes';

export const startDate = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_START_DATE:
      return action.startDate;
  }
  return state;
};

export const endDate = (state = null, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_END_DATE:
      return action.endDate;
  }
  return state;
};

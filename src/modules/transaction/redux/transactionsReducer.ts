import { IPayroll } from './../../../models/payroll';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';

export const setPayrolls = createCustomAction('setPayrolls', (data: IPayroll[]) => ({
  data,
}));

export const actions = { setPayrolls };

type Action = ActionType<typeof actions>;

export default function reducer(state: IPayroll[] = [], action: Action) {
  switch (action.type) {
    case getType(setPayrolls):
      return action.data;
    default:
      return state;
  }
}

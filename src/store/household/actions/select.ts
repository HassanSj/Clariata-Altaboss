import {action, Action} from 'easy-peasy';
import {Household} from 'types/api/household';

const select: Action<Household> = action((state: any, payload: any) => {
  state.selectedHousehold = payload;
});

export default select;

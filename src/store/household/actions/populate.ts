import {action, Action} from 'easy-peasy';
import {Household} from 'types/api/household';

const populate: Action<Household[]> = action((state: any, payload: any) => {
  state.households = payload;
});

export default populate;

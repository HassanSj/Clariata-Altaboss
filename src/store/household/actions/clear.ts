import {action, Action} from 'easy-peasy';
import {Household} from 'types/api/household';

const clear: Action<Household[]> = action((state: any, payload: any) => {
    state.households = [];
});

export default clear;

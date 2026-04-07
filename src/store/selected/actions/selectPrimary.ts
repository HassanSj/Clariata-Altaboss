import {action, Action} from 'easy-peasy';
import { Household } from '~/types/api/household';

const selectPrimary: Action<any> = action((state: any, payload: any) => {
    state.primary1Id = payload.PrimaryPerson1ID;
    state.primary2Id = payload.PrimaryPerson2ID;
});

export default selectPrimary;

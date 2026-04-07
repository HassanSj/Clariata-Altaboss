import {action, Action} from 'easy-peasy';

const selectHousehold: Action<any> = action((state: any, payload: any) => {
    state.householdId = payload;
    state.primary1Id = payload.PrimaryPerson1ID;
    state.primary2Id = payload.PrimaryPerson2ID;
});

export default selectHousehold;

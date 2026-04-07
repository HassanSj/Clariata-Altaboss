import {action, Action} from 'easy-peasy';

const selectDeepenPriority: Action<any> = action((state: any, payload: any) => {
    state.deepenPriorityId = payload;
});

export default selectDeepenPriority;

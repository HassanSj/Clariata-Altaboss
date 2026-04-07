import {action, Action} from 'easy-peasy';

const selectDeepenActionItem: Action<any> = action((state: any, payload: any) => {
    state.deepenActionItemId = payload;
});

export default selectDeepenActionItem;

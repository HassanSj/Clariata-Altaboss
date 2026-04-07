import {action, Action} from 'easy-peasy';

const selectContact: Action<any> = action((state: any, payload: any) => {
    state.contactId = payload;
});

export default selectContact;

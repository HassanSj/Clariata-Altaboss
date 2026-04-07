import { action, Action } from 'easy-peasy';

const clearPhoneNumbers: Action<any> = action((state: any, payload: any) => {
    let s = state.phoneNumbers;
    state.phoneNumbers = undefined;
    console.log('state.addresses', state.phoneNumbers);

});

export default clearPhoneNumbers;
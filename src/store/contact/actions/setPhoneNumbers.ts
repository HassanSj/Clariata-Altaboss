import { action, Action } from 'easy-peasy';

const setPhoneNumbers: Action<any> = action((state: any, payload: any) => {
    let s = state.phoneNumbers;
    state.phoneNumbers = [...s, payload] 
    console.log('state.phoneNumbers', state.phoneNumbers);

});

export default setPhoneNumbers;
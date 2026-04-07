import { action, Action } from 'easy-peasy';

const clearAddresses: Action<any> = action((state: any, payload: any) => {
    let s = state.addresses;
    state.addresses = undefined;
    console.log('state.addresses', state.addresses);

});

export default clearAddresses;
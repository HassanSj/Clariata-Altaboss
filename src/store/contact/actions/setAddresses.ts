import { action, Action } from 'easy-peasy';

const setAddresses: Action<any> = action((state: any, payload: any) => {
    let s = state.addresses;
    state.addresses = [...s, payload] 
    console.log('state.addresses', state.addresses);

});

export default setAddresses;
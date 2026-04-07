import { action, Action } from 'easy-peasy';

interface IPayload {
    destinyGlobalItems: any;
    DevelopmentPlans: any;
}

const setAddedItems: Action<any> = action((state: any, payload: any) => {
    // state.SelectedPersonItemsAdded = null;
    state.SelectedPersonItemsAdded = payload;
});

export default setAddedItems
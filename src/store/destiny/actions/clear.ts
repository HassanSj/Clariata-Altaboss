import { action, Action } from 'easy-peasy';

interface IPayload {
    destinyGlobalItems: any;
    DevelopmentPlans: any;
}

const clear: Action<any> = action((state: any) => {
    // state.destinyGlobalItems = [];
    // state.DevelopmentPlans = [];
    state.planMemberItems = [];
    state.selectedFamilyPerson = null;
    state.SelectedPersonItemsAdded = null;
});

export default clear;
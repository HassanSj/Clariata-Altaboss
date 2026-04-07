import { action, Action } from 'easy-peasy';

interface IPayload {
    destinyGlobalItems: any;
    DevelopmentPlans: any;
}

const selectPerson: Action<any> = action((state: any, payload: any) => {
    state.selectedFamilyPerson = payload;
});

export default selectPerson;
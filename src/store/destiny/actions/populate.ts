import { action, Action } from 'easy-peasy';

interface IPayload {
    destinyGlobalItems: any;
    DevelopmentPlans: any;
}

const populate: Action<any> = action((state: any, payload: any) => {
    state.destinyGlobalItems = payload.destinyGlobalItems;
    state.DevelopmentPlans = payload.DevelopmentPlans;
});

export default populate;
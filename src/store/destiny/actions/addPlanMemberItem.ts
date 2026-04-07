import { action, Action } from 'easy-peasy';
import { PlanMember } from '~/types/api/destinyGlobalItem';

// interface IPayload {
//     destinyGlobalItems: any;
//     DevelopmentPlans: any;
// }

const addPlanMemberItem: Action<any> = action((state: any, payload: any) => {
    // state.planMemberItems = state.planMemberItems ? [state.planMemberItems] : [];
    let s = state.planMemberItems;
    state.planMemberItems = [...s, payload] 
    console.log('state.planMemberItem', state.planMemberItems);

});

export default addPlanMemberItem;
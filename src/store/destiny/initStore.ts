
interface InitStore {
    destinyGlobalItems?: any[];
    planMemberItems?: any[];
    DevelopmentPlans?: any[];
}

const initStore: InitStore = {
    planMemberItems: [],
    DevelopmentPlans: [],
    destinyGlobalItems: []
};

export default initStore;

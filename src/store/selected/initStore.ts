
interface InitStore {
  householdId: number;
  primary1Id: number;
  primary2Id: number;
  contactId: number;
  discoverInterviewId: number;
  dreamInterviewId: number;
  deepenActionItemId: number;
  deepenPriorityId: number;
}

const initStore: InitStore = {
    householdId: 0,
    primary1Id: 0,
    primary2Id: 0,
    contactId: 0,
    discoverInterviewId: 0,
    dreamInterviewId: 0,
    deepenActionItemId: 0,
    deepenPriorityId: 0
};

export default initStore;

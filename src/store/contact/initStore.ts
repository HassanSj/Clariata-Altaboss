interface InitStore {
  phoneNumbers: any[],
  addresses: any[],
  unsaved: boolean
}

const initStore: InitStore = {
    phoneNumbers: [],
    addresses: [],
    unsaved: false
};

export default initStore;
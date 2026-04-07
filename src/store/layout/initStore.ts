interface InitStore {
  isLoading: boolean;
  isSideBarOpen: boolean;
  navigation: {};
}

const initStore: InitStore = {
  isLoading: false,
  isSideBarOpen: false,
  navigation: {},
};

export default initStore;

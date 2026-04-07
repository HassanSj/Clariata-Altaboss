import {Household} from "~/types/api/household";

interface InitStore {
  selectedHousehold?: Household;
  households?: Household[];
}

const initStore: InitStore = {
  households: [],
};

export default initStore;

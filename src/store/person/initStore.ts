import {Person} from "~/types/api/person";

interface InitStore {
  persons: Person[];
}

const initStore: InitStore = {
  persons: []
};

export default initStore;

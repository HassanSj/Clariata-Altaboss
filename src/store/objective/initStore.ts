import {Objective} from "~/types/api/objective";
import {ActionItem} from "~/types/api/actionItem";

interface InitStore {
  objectives: Objective[];
  actionItems: ActionItem[];
}

const initStore: InitStore = {
  objectives: [],
  actionItems: []
};

export default initStore;

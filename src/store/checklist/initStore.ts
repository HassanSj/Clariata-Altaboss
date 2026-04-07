import { Checklist } from "~/types/api/checklist";

interface InitStore {
  discoverChecklist?: Checklist,
  dreamChecklist?: Checklist,
  directionChecklist?: Checklist,
  deepenChecklist?: Checklist,
  destinyChecklist?: Checklist,
}

const initStore: InitStore = {
  discoverChecklist: undefined,
  dreamChecklist: undefined,
  directionChecklist: undefined,
  deepenChecklist: undefined,
  destinyChecklist: undefined,
};

export default initStore;

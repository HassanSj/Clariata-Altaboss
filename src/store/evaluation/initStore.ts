import {ClientEvaluation} from "~/types/api/clientEvaluation";

interface InitStore {
  selectedEvaluation?: ClientEvaluation;
  evaluations?: ClientEvaluation[];
}

const initStore: InitStore = {
  evaluations: [],
};

export default initStore;

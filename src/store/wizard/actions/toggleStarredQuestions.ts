import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const toggleStarredQuestions: Action<IWizardStoreModel, boolean> = action((state: any, payload: boolean) => {
  state.showStarredQuestionsOnly = payload;
});

export default toggleStarredQuestions;

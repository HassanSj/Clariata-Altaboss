import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const toggleShowSubQuestions: Action<IWizardStoreModel, boolean> = action((state: any, payload: boolean) => {
  state.showSubQuestions = payload;
});

export default toggleShowSubQuestions;

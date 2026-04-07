import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onToggleStarredQuestions: Thunk<IWizardStoreModel, boolean> = thunk(async ({ toggleStarredQuestions }, payload: boolean) => {
  toggleStarredQuestions(payload);
});

export default onToggleStarredQuestions;

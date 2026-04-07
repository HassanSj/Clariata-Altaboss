import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onToggleShowSubQuestions: Thunk<IWizardStoreModel, boolean> = thunk(async ({ toggleShowSubQuestions }, payload: boolean) => {
  toggleShowSubQuestions(payload);
});

export default onToggleShowSubQuestions;

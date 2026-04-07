import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onToggleShowResponseForm: Thunk<IWizardStoreModel, boolean> = thunk(async ({ toggleShowResponseForm }, payload: boolean) => {
  toggleShowResponseForm(payload);
});

export default onToggleShowResponseForm;

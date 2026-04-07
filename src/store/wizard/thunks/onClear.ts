import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onClear: Thunk<IWizardStoreModel> = thunk(async ({ clear }) => {
  clear(null);
});

export default onClear;

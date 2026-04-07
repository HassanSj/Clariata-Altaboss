import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onReset: Thunk<IWizardStoreModel> = thunk(async ({ clear }) => {
    clear(null);
});

export default onReset;

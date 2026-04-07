import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onToggleExpanded: Thunk<IWizardStoreModel> = thunk(async ({ setSingleExpanded }, payload: any) => {
    setSingleExpanded(payload);
});

export default onToggleExpanded;
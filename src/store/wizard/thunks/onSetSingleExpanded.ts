import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onSetSingleExpanded: Thunk<IWizardStoreModel> = thunk(async ({ setSingleExpanded }, payload: any) => {
    setSingleExpanded(payload);
});

export default onSetSingleExpanded;
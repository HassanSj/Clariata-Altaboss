import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const onToggleStarredResponses: Thunk<IWizardStoreModel, boolean> = thunk(async ({ toggleStarredResponses }, payload: boolean) => {
  toggleStarredResponses(payload);
});

export default onToggleStarredResponses;

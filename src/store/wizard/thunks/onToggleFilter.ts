import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onToggleFilter: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ toggleFilter }, payload: IInterviewUpdatePayload) => {
  toggleFilter(payload);
});

export default onToggleFilter;
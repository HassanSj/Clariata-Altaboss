import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onToggleHiddenResponse: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ toggleHiddenResponse }, payload: IInterviewUpdatePayload) => {
  toggleHiddenResponse(payload);
});

export default onToggleHiddenResponse;
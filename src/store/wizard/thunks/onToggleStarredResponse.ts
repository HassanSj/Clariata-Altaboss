import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onToggleStarredResponse: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ toggleStarredResponse }, payload: IInterviewUpdatePayload) => {
  toggleStarredResponse(payload);
});

export default onToggleStarredResponse;
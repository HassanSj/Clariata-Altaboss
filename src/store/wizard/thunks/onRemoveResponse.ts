import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onRemoveResponse: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ removeResponse }, payload: IInterviewUpdatePayload) => {
  try {
    removeResponse(payload);
  } catch (err) {
    processServerError(err, 'wizard.onRemoveResponse');
  }
});

export default onRemoveResponse;

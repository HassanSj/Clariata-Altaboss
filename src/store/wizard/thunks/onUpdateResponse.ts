import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onUpdateResponse: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ updateResponse }, payload: IInterviewUpdatePayload) => {
  try {
    updateResponse(payload);
  } catch (err) {
    processServerError(err, 'wizard.onUpdateResponse');
  }
});

export default onUpdateResponse;

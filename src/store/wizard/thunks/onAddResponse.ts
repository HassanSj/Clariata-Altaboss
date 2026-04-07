import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onAddResponse: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ addResponse }, payload: IInterviewUpdatePayload) => {
  try {
    addResponse(payload);
  } catch (err) {
    processServerError(err, 'wizard.onAddResponse');
  }
});

export default onAddResponse;

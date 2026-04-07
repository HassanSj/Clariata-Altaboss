import {thunk, Thunk} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const onToggleStarredQuestion: Thunk<IWizardStoreModel, IInterviewUpdatePayload> = thunk(async ({ toggleStarredQuestion }, payload: IInterviewUpdatePayload) => {
  toggleStarredQuestion(payload);
});

export default onToggleStarredQuestion;

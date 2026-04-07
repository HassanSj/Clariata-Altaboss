import {action, Action} from 'easy-peasy';
import {IInterviewPayload, InterviewDataType} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";

const setIsSaved: Action<IInterviewStoreModel, IInterviewPayload> = action((state: any, payload: IInterviewPayload) => {

  if(payload.type === InterviewDataType.FORM) {
      state.isUnsaved = payload?.saved;
  }
});

export default setIsSaved;
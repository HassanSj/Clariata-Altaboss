import {action, Action} from 'easy-peasy';
import {IInterviewPayload, InterviewDataType, InterviewType} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";

const select: Action<IInterviewStoreModel, IInterviewPayload> = action((state: any, payload: IInterviewPayload) => {
  switch(payload.type){
    case InterviewDataType.INTERVIEW:
      state.selectedInterview = payload?.data;
      state.selectedInterviewType = (payload?.data?.InterviewTemplate?.InterviewTemplateID === InterviewType.DISCOVER)
        ? InterviewType.DISCOVER
        : InterviewType.DREAM;
      break;
    case InterviewDataType.INTERVIEW_TEMPLATE:
      state.selectedInterviewTemplate = payload?.data;
      break;
    case InterviewDataType.INTERVIEW_QUESTION:
      state.selectedQuestion = payload?.data;
      break;
    case InterviewDataType.INTERVIEW_RESPONSE:
      state.selectedResponse = payload?.data;
      break;
    case InterviewDataType.OBJECTIVE:
      state.selectedObjective = payload?.data;
      break;
  }
});

export default select;

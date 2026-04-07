import {action, Action} from 'easy-peasy';
import {IInterviewPayload, InterviewDataType} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";

const populate: Action<IInterviewStoreModel, IInterviewPayload> = action((state: any, payload: IInterviewPayload) => {
  if (payload.type !== InterviewDataType.ALL){
    switch(payload.type){
      case InterviewDataType.INTERVIEW:
        state.interviews = payload?.data;
        state.dreamInterviewId = payload?.dreamInterviewId;
        state.discoverInterviewId = payload?.discoverInterviewId;
        break;
      case InterviewDataType.INTERVIEW_TEMPLATE:
        state.interviewTemplates = payload?.data;
        break;
      case InterviewDataType.INTERVIEW_QUESTION:
        state.questions = payload?.data;
        break;
      case InterviewDataType.INTERVIEW_RESPONSE:
        state.responses = payload?.data;
        break;
      case InterviewDataType.OBJECTIVE:
        state.objectives = payload?.data;
        break;
    }
  }
  else {
    state.interviews = payload?.interviews;
    state.dreamInterviewId = payload?.dreamInterviewId;
    state.discoverInterviewId = payload?.discoverInterviewId;
    state.templates = payload?.templates;
  }

});

export default populate;

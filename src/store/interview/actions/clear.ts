import {action, Action} from 'easy-peasy';
import {IInterviewPayload, InterviewDataType} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";

const clear: Action<IInterviewStoreModel, IInterviewPayload> = action((state: any, payload: IInterviewPayload) => {
  if (payload.type !== InterviewDataType.ALL) {
    switch(payload.type){
      case InterviewDataType.INTERVIEW:
        state.selectedInterview = null;
        state.interviews = null;
        break;
      case InterviewDataType.INTERVIEW_TEMPLATE:
        state.selectedInterviewTemplate = null;
        state.interviewTemplates = null;
        break;
      case InterviewDataType.INTERVIEW_QUESTION:
        state.selectedQuestion = null;
        state.questions = null;
        break;
      case InterviewDataType.INTERVIEW_RESPONSE:
        state.selectedResponse = null;
        state.responses = null;
        break;
      case InterviewDataType.OBJECTIVE:
        state.selectedObjective = null;
        state.objectives = null;
        break;
    }
  }
  else {
    // Reset selected
    state.selectedInterview = null;
    state.selectedInterviewTemplate = null;
    state.selectedQuestion = null;
    state.selectedResponse = null;
    state.selectedObjective = null;
    // Reset lists
    state.interviews = [];
    state.interviewTemplates = [];
    state.questions = [];
    state.responses = [];
    state.objectives = null;
  }

});

export default clear;

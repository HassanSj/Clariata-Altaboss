import {action, Action} from 'easy-peasy';
import {IInterviewUpdatePayload} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";
import {InterviewFull} from "~/types/api/interviewFull";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";

const updateResponse: Action<IInterviewStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  const isTopLevelQuestion = (payload?.question?.Question?.ParentQuestionID === 0);

  // Locate parent index
  const parentIndex = state.selectedInterview.QuestionsAndResponses
    .findIndex((q: QuestionAndResponse) => q.Question.QuestionID === payload?.question?.Question?.ParentQuestionID);

  // Locate question index
  const questionIndex = isTopLevelQuestion ?
    // Top level question
    state.selectedInterview.QuestionsAndResponses
      .findIndex((q: QuestionAndResponse) => q.Question.QuestionID === payload?.question?.Question?.QuestionID) :
    // Sub question
    state.selectedInterview.QuestionsAndResponses[parentIndex].SubQuestions
      .findIndex((q: QuestionAndResponse) => q.Question.QuestionID === payload?.question?.Question?.QuestionID);

  // Locate interview index
  const interviewIndex = state.interviews
    .findIndex((i: InterviewFull) => i.Interview.InterviewID === payload?.interviewId);

  // Update question w/ responses in selected interview
  if (isTopLevelQuestion) {
    state.selectedInterview.QuestionsAndResponses[questionIndex] = payload.question;
  } else {
    state.selectedInterview.QuestionsAndResponses[parentIndex].SubQuestions[questionIndex] = payload.question;
  }
  state.selectedInterview.Progress = payload.progress;

  // Update question w/ responses in list of interviews
  state.interviews.forEach((i: InterviewFull) => {
    if (i.Interview.InterviewID === payload?.interviewId) {
      if (i.QuestionsAndResponses) {
        if (isTopLevelQuestion) {
          i.QuestionsAndResponses[questionIndex] = payload.question;
        } else {
          // @ts-ignore
          i.QuestionsAndResponses[parentIndex].SubQuestions[questionIndex] = payload.question;
        }
      }
      i.Progress = payload.progress;
      if(payload.additionalCategoryProgress)
        i.AdditionalCategoryProgressList = payload.additionalCategoryProgress;
    }
  })

});

export default updateResponse;

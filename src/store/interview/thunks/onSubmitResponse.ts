import {thunk, Thunk} from 'easy-peasy';
import {IInterviewStoreModel} from "~/types/interview/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";

const onSubmitResponse: Thunk<IInterviewStoreModel, IInterviewUpdatePayload> = thunk(async ({ select, populate, clear, updateResponse }, payload: IInterviewUpdatePayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();

  // Objective adjustments
  try {
    // TODO
  } catch (err) {
    processServerError(err, 'interview.onSubmitResponse');
  }

  // Interview and wizard store adjustments
  try {

    // Fetch updated question w/ responses
    const responsesResponse: AxiosResponse = await api.interviewresponse.list(payload.householdId,payload.interviewId, payload.questionId);

    // Fetch updated progress
    const progressResponse: AxiosResponse = await api.interviewprogress.get(payload.householdId,payload.interviewId);

    const categoryProgressResponse: AxiosResponse = await api.interviewprogress.getDiscoverAdditional(payload?.householdId, payload?.interviewId);

    // Create new question object w/ updated responses
    const questionAndResponse = {
      Question: payload?.question?.Question,
      Responses: responsesResponse.data,
      SubQuestions: payload?.question?.SubQuestions
    };

    // Create updated payload
    const adjustedPayload = {
      ...payload,
      interview: store.interview.selectedInterview,
      question: questionAndResponse,
      progress: progressResponse.data,
      additionalCategoryProgress: categoryProgressResponse.data
    };

    // Update wizard
    actions.wizard.updateResponse(adjustedPayload);

    // Update interview
    updateResponse(adjustedPayload);

  } catch (err) {
    processServerError(err, 'interview.onSubmitResponse');
  }

});

export default onSubmitResponse;

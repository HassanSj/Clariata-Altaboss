import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IInterviewPayload, InterviewDataType, InterviewType} from "~/ui/constants/interview";
import {IInterviewStoreModel} from "~/types/interview/store";
import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {InterviewFull} from "~/types/api/interviewFull";

const onPopulate: Thunk<IInterviewStoreModel, IInterviewPayload> = thunk(async ({ populate }, payload: IInterviewPayload, helpers) => {
  const store: any = helpers.getStoreState();

  const actionPayload: IInterviewPayload = {
    type: payload?.type
  };

  if (payload.type === InterviewDataType.ALL) {

    // Templates
    let templates: InterviewTemplate[] = [];
    try {
      const res: AxiosResponse = await api.interviewtemplate.list();
      templates = res.data;
      if (payload.type === InterviewDataType.ALL) {
        actionPayload.templates = res.data;
      } else {
        actionPayload.data = res.data;
      }
    } catch (err) {
      processServerError(err, 'interview.onPopulate.interview_template');
    }

    // Interviews
    try {
      if (!payload?.householdId) return;
      const interviews = await api.interview.listFull(payload.householdId);

      if (payload.type === InterviewDataType.ALL) {
        actionPayload.interviews = interviews;

        // Set interview IDs
        if (interviews) {
          const dreamInterview = interviews.find((i: InterviewFull) =>
            i.Interview?.InterviewTemplateID === InterviewType.DREAM);
          const discoverInterview = interviews.find((i: InterviewFull) =>
            i.Interview?.InterviewTemplateID === InterviewType.DISCOVER);
          actionPayload.dreamInterviewId = dreamInterview?.Interview?.InterviewID;
          actionPayload.discoverInterviewId = discoverInterview?.Interview?.InterviewID;
        }
      } else {
        actionPayload.data = interviews;
      }
    } catch (err) {
      processServerError(err, 'interview.onPopulate.interview');
    }

  }
  if (payload.type === InterviewDataType.INTERVIEW_RESPONSE) {
    try {
      if (!payload?.householdId || !payload?.interviewId || !payload?.interviewQuestionId) return;
      const res: AxiosResponse = await api.interviewresponse.list(payload.householdId, payload.interviewId, payload.interviewQuestionId);
      actionPayload.data = res.data;
    } catch (err) {
      processServerError(err, 'interview.onPopulate.response');
    }
  }
  if (payload.type === InterviewDataType.OBJECTIVE) {
    try {
      if (!payload?.householdId || !payload?.interviewId) return;
      const res: AxiosResponse = await api.objective.list(payload.householdId, payload.interviewId);
      actionPayload.data = res.data;
    } catch (err) {
      processServerError(err, 'interview.onPopulate.response');
    }
  }

  // Dispatch action
  populate(actionPayload);

  return actionPayload;
});

export default onPopulate;

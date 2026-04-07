import {thunk, Thunk} from 'easy-peasy';
import {IInterviewStoreModel} from "~/types/interview/store";
import {IInterviewPayload, InterviewDataType} from "~/ui/constants/interview";
import paths from "~/ui/constants/paths";
import {getInterviewWizard} from "~/services/interview";

import {InterviewFull} from "~/types/api/interviewFull";

const { INTERVIEW } = paths;


const onSelect: Thunk<IInterviewStoreModel, IInterviewPayload> = thunk(async ({ select, populate, clear }, payload: IInterviewPayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();

  // Populate interview details
  if (payload.type === InterviewDataType.INTERVIEW) {

    // Clear previous interview details
    clear({type: InterviewDataType.INTERVIEW_QUESTION});
    clear({type: InterviewDataType.INTERVIEW_RESPONSE});

    const interview: InterviewFull = payload?.data;

    if (!interview) return;

    // Dispatch action
    select({
      type: payload.type,
      data: interview
    });

    

    // Setup wizard
    actions.wizard.onPopulate(getInterviewWizard(interview,
        store.constants.discoverCategories,
        store.household.selectedHousehold?.Persons,
        store.constants.metricsOfSuccess,
        store.constants.dimensionsOfLife));

  }
  else {
    // Dispatch action
    select({
      type: payload.type,
      data: payload.data
    });
  }



});

export default onSelect;

import {action, Action} from 'easy-peasy';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";


const addResponse: Action<IWizardStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  const wizard = state.wizard;

  // Create new response objective
  const newResponse = {
    InterviewID: payload?.interviewId,
    InterviewQuestionID: payload?.questionId,
    ResponseText: '',
    WhyIsThisImportant: '',
    AppliesTo: payload?.appliesTo
  };

  // Add new response
  if (isNullOrUndefined(payload.parentIndex)) {
    if (payload?.responseIndex === 0) {
      state.wizard.steps[wizard.activeStepIndex]
        .steps[wizard.activeSubStepIndex]
        .questions[payload.questionIndex]
        .Responses = [];
    }
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.questionIndex]
      .Responses.push(newResponse)
  } else {
    if (payload?.responseIndex === 0) {
      state.wizard.steps[wizard.activeStepIndex]
        .steps[wizard.activeSubStepIndex]
        .questions[payload.parentIndex]
        .SubQuestions[payload.questionIndex]
        .Responses = [];
    }
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.parentIndex]
      .SubQuestions[payload.questionIndex]
      .Responses.push(newResponse);
  }

  // Set as active
  state.activeQuestion = payload?.question;
  state.activeQuestionId = payload?.question?.Question?.QuestionID;
  state.activeQuestionIndex = payload?.questionIndex;
  state.activeResponse = newResponse;
  state.activeResponseIndex = payload?.responseIndex;

  // Update steps
  state.activeStep = state.wizard.steps[wizard.activeStepIndex];
  state.activeSubStep = state.wizard.steps[wizard.activeStepIndex].steps[wizard.activeSubStepIndex];

  // Show inline edit
  state.showResponseForm = true;

});

export default addResponse;

import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";

interface IPayload {
  index: number;
  parentIndex?: number;
  question?: QuestionAndResponse
}

const selectQuestion: Action<IWizardStoreModel, IPayload> = action((state: any, payload: IPayload) => {
  state.activeQuestion = payload?.question;
  state.activeQuestionIndex = payload?.index;
  state.activeQuestionId = payload?.question?.Question?.QuestionID;
  state.activeParentQuestionIndex = payload?.parentIndex;
  state.activeParentQuestionId = (payload?.question?.Question?.ParentQuestionID !== 0) ? payload?.question?.Question?.ParentQuestionID : undefined;
});

export default selectQuestion;

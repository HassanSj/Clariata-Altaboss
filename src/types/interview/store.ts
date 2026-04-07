import {Action, Thunk} from "easy-peasy";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {Objective} from "~/types/api/objective";
import {Question} from "~/types/api/question";
import {InterviewFull} from "~/types/api/interviewFull";
import {InterviewType} from "~/ui/constants/interview";

export interface IInterviewStoreModel {
  selectedInterviewType: InterviewType;
  selectedInterviewTemplate: InterviewTemplate;
  templates: InterviewTemplate[];
  selectedQuestion: Question;
  questions: Question[];
  selectedInterview: InterviewFull;
  interviews: InterviewFull[];
  dreamInterviewId: number;
  discoverInterviewId: number;
  selectedResponse: InterviewResponse;
  responses: InterviewResponse[];
  selectedObjective: Objective;
  objectives: Objective[];
  isUnsaved: boolean;

  populate: Action<IInterviewStoreModel, unknown>;
  onPopulate: Thunk<IInterviewStoreModel, unknown>;
  select: Action<IInterviewStoreModel, unknown>;
  onSelect: Thunk<IInterviewStoreModel, unknown>;
  clear: Action<IInterviewStoreModel, unknown>;
  onClear: Thunk<IInterviewStoreModel, unknown>;
  updateResponse: Action<IInterviewStoreModel, unknown>;
  onSubmitResponse: Thunk<IInterviewStoreModel, unknown>;
  setIsSaved: Action<IInterviewStoreModel, unknown>;
  onSetIsSaved: Thunk<IInterviewStoreModel, unknown>;
}



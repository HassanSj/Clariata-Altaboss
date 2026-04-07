import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {Interview} from "./interview";
import {InterviewTemplate} from "./interviewTemplate";
import {InterviewProgress} from "~/types/api/interviewProgress";
import { InterviewCategoryProgress } from "./interviewCategoryProgress";

export interface InterviewFull {
  Interview: Interview;
  InterviewTemplate?: InterviewTemplate;
  QuestionsAndResponses?: QuestionAndResponse[];
  Progress?: InterviewProgress;
  AdditionalCategoryProgressList?: InterviewCategoryProgress[];
}
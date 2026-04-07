import {Interview} from "~/types/api/interview";
import {InterviewCategoryProgress} from "~/types/api/interviewCategoryProgress";
import { Objective } from "~/types/api/objective";

export interface InterviewProgress {
  Interview?: Interview;
  TotalInterviewQuestionsAnswered?: number;
  TotalInterviewQuestionCount?: number;
  CategoryProgressList?: InterviewCategoryProgress[];
  ProgressPercentage?: number;
  ObjectiveList?: Objective[];
}

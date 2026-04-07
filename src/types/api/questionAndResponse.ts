import {InterviewResponse} from "~/types/api/interviewResponse";
import {Question} from "./question";

export interface QuestionAndResponse {
  Question: Question;
  Responses: InterviewResponse[] | undefined;
  IsComplete?: boolean;
  index?: number;
  SubQuestions?: QuestionAndResponse[] | undefined;

}
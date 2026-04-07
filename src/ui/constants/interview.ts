import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {NextRouter} from "next/router";
import {InterviewFull} from "~/types/api/interviewFull";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {InterviewProgress} from "~/types/api/interviewProgress";
import { InterviewCategoryProgress } from "~/types/api/interviewCategoryProgress";
import { ReportType } from "./reports";

export enum InterviewType {
  DREAM = 1,
  DISCOVER = 2
}

export enum InterviewDataType {
  ALL,
  INTERVIEW,
  INTERVIEW_TEMPLATE,
  INTERVIEW_RESPONSE,
  INTERVIEW_QUESTION,
  OBJECTIVE,
  STEP,
  FORM
}

export interface IInterviewPayload {
  type: InterviewDataType;
  data?: any;
  interviews?: InterviewFull[];
  templates?: InterviewTemplate[];
  householdId?: number;
  interviewId?: number;
  interviewTemplateId?: number;
  interviewResponseId?: number;
  interviewQuestionId?: number;
  dreamInterviewId?: number;
  discoverInterviewId?: number;
  router?: NextRouter;
  saved?: boolean;
}

export interface IInterviewUpdatePayload {
  householdId: number;
  interviewId: number;
  interview: InterviewFull;
  questionId: number;
  question: QuestionAndResponse;
  questionIndex: number;
  response: InterviewResponse;
  responseIndex: number;
  parentIndex: number;
  progress: InterviewProgress;
  starred?: boolean;
  hidden?: boolean;
  additionalCategoryProgress?: InterviewCategoryProgress[];
  sections?: number[];
  reportType?: ReportType;
  hideClarifying?: boolean;
  appliesTo?: number;
}

export const dimensionsOfSuccessStyles = {
  '1': { name: 'Self', icon: 'person' },
  '2': { name: 'Family', icon: 'people' },
  '3': { name: 'Workplace', icon: 'work' },
  '4': { name: 'Community', icon: 'public' },

  '6': { name: 'The Story of Us', icon: 'group' },
  '7': { name: 'Growing Up/Education', icon: 'school' },
  '8': { name: 'The Story of Work', icon: 'work' },
  '9': { name: 'Our Family', icon: 'family_restroom' },
  '10': { name: 'Extended Family', icon: 'account_tree' },
  '11': { name: 'Rituals and Traditions', icon: 'beenhere' },
  '12': { name: 'Our Life Lessons', icon: 'alt_route' },
  '13': { name: 'Giving Back', icon: 'redeem' },
  '14': { name: 'Giving Thanks', icon: 'volunteer_activism' },
  '15': { name: 'Vision, Mission, Values', icon: 'fingerprint' },

}

export const metricsOfSuccessStyles = {
  '1': { name: 'Experience', icon: 'psychology' },
  '2': { name: 'Achievements', icon: 'emoji_events' },
  '3': { name: 'Contribute', icon: 'wifi' },
  '4': { name: 'Perpetuate', icon: 'schedule' },
  '5': { name: 'Other', icon: 'folder' },
}

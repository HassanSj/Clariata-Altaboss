import {InterviewTemplate} from "./interviewTemplate";

export interface Interview {
  InterviewID: number;
  InterviewTemplateID: number;
  InterviewName?: string;
  ClientID?: number;
  HouseholdID: number;
  PersonID?: number;
  InterviewStatusID?: number;
  BookmarkQuestionID?: number;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;

  InterviewTemplate?: InterviewTemplate;
}

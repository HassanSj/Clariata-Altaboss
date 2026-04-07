export interface InterviewResponse {
  InterviewResponseID?: number;
  InterviewID?: number;
  InterviewResponseStatusID?: number;
  InterviewQuestionID?: number;
  AppliesTo?: number;
  ResponseText?: string;
  WhyIsThisImportant?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
  Starred?: boolean;
  Hidden?: boolean;
  AppliesToFullName?: string;
  Paragraph?: boolean;

  ObjectiveHeadline?: string;
}

export interface InterviewQuestion {
  InterviewQuestionID?: number;
  InterviewID?: number;
  InterviewQuestionStatusID?: number;
  PreviousQuestionID?: number;
  QuestionID?: number;
  NextQuestionID?: number;
  Duplicate?: boolean;
  DimensionOfLifeID?: number;
  MetricOfSuccessID?: number;
  CustomSelfDOS?: string;
  QuestionText?: string;
  ResponseTypeID?: number;
  ResponseBoolean?: boolean;
  ResponseNumeric?: number;
  ResponseText?: string;
  CommentSetID?: number;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
}

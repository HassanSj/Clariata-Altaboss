import {InterviewResponse} from "~/types/api/interviewResponse";
import {FormInputType} from "~/ui/constants/forms";
import {IFormInputOption} from "~/types/forms";

export interface Question {
  QuestionID: number;
  InterviewTemplateID?: number;
  ParentQuestionID?: number;
  DimensionOfLifeID?: number;
  MetricOfSuccessID?: number;
  SortOrder?: number;
  QuestionName: string;
  QuestionText: string;
  Prompts?: string;
  ResponseTypeID: number;
  PotentialValues?: string;
  Starred?: boolean;
  Hidden?: boolean;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;

  InterviewResponse?: InterviewResponse;
  IsComplete?: boolean;
  Directions?: string;
  InputName: string;
  InputType: FormInputType;
  InputOptions?: IFormInputOption[];
}

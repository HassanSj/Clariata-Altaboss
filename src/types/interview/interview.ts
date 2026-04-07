import {InterviewResponse} from "~/types/api/interviewResponse";
import {Person} from "~/types/api/person";

export interface IInterviewPersonResponseStats {
  person: Person | undefined;
  responses?: InterviewResponse[];
  additionalPriorityCount?: number;
}
import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {Interview} from "~/types/api/interview";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {Question} from "~/types/api/question";

interface InitStore {
  templates: InterviewTemplate[];
  questions: Question[];
  interviews: Interview[];
  responses: InterviewResponse[];
  showResponseForm: boolean;
  isUnsaved: boolean;
}

const initStore: InitStore = {
  templates: [],
  questions: [],
  interviews: [],
  responses: [],
  showResponseForm: true,
  isUnsaved: false
};

export default initStore;

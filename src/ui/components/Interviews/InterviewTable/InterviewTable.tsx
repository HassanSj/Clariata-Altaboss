import React from "react";
import classnames from 'classnames';
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import Modal from "~/ui/components/Dialogs/Modal";
import {useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {InterviewFull} from "~/types/api/interviewFull";
import api from "~/services/api";
import {Question} from "~/types/api/question";
import {hasItems} from "~/ui/constants/utils";

interface IProps {
  interviewId: number;
  isOpen: boolean;
  onClose: () => unknown;
}

const InterviewTable = ({ interviewId, isOpen, onClose }: IProps) => {
  const { interviews } = useStoreState((state) => state.interview);
  const { selectedHousehold } = useStoreState(state => state.household);

  const [interview, setInterview] = React.useState<InterviewFull | undefined>();
  const [questions, setQuestions] = React.useState<Question[] | undefined>();

  const populate = async () => {
    // Fetch full interview and set
    const selected: InterviewFull = await api.interview.getFull(Number(selectedHousehold?.HouseholdID), Number(interviewId));
    setInterview(selected);
    // Extract questions
    const extractedQuestions: Question[] = [];
    selected?.QuestionsAndResponses?.forEach((q: QuestionAndResponse) => {
      extractedQuestions.push(q.Question);
      if (q.SubQuestions && hasItems(q.SubQuestions)) {
        extractedQuestions.push(...getQuestions(q.SubQuestions));
      }
    });
    setQuestions(extractedQuestions);
  }

  const getQuestions = (qs: QuestionAndResponse[]) => {
    const extractedQuestions: Question[] = [];
    qs?.forEach((q: QuestionAndResponse) => {
      extractedQuestions.push(q.Question);
    });

    return extractedQuestions;
  }



  useMountEvents({
    onMounted: async () => {
      populate();
    }
  });

  return (
    <>
      <Modal title="Interview Questions Table" isOpen={isOpen} handleClose={onClose} width="lg">

          <table id="interview_excel_report">
            <thead>
            <tr>
              <th className="excel_report_header">Question</th>
            </tr>
            </thead>
            <tbody>
            {questions?.map((q: any, index: number) => (
              <tr className={classnames({ "excel_report_row_alt": (index % index === 0) })}>
                <th className="excel_report_cell">{q?.Question?.QuestionText}</th>
              </tr>
            ))}
            </tbody>
          </table>

      </Modal>
    </>
  )
}

export default InterviewTable;
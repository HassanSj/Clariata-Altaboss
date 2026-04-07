import React from "react";
import {InterviewType} from "~/ui/constants/interview";
import {useStoreState} from "~/store/hooks";
import Wizard from "~/ui/components/Wizard/Wizard";
import {WizardType} from "~/ui/constants/wizard";
import InterviewStepContent from "~/ui/components/Wizard/Interviews/InterviewStepContent";
import { getAccessToken, getSelectedHouseholdId } from "~/services/auth";
import useSWR from "swr";
import { fetcher } from "~/types/api/fetcher";
import { InterviewFull } from "~/types/api/interviewFull";

interface IProps {
  id: number;
}

const InterviewWizard = ({ id }: IProps) => {
  //const { selectedInterview } = useStoreState((state) => state.interview);
  
  const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);
  console.log("InterviewID");
  console.log(id);
  const urlInterview = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${id}`;
  console.log(urlInterview);
  const {data: selectedInterview} = useSWR<InterviewFull>([urlInterview, getAccessToken()], fetcher);
  //console.log(selectedInterview);

  return (
    <>
      <Wizard id={id}
              type={(selectedInterview?.Interview?.InterviewTemplateID === InterviewType.DREAM) ? WizardType.DREAM_INTERVIEW : WizardType.DISCOVER_INTERVIEW}
              stepComponent={InterviewStepContent} />
    </>
  )
}

export default InterviewWizard;

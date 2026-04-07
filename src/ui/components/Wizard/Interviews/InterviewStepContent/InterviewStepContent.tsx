import React from "react";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import InterviewStepQuestion from "~/ui/components/Wizard/Interviews/InterviewStepQuestion";
import {useStoreState} from "~/store/hooks";
import {WizardType} from "~/ui/constants/wizard";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {findObjectivesForWizardStep} from "~/services/interview";
import {Objective} from "~/types/api/objective";
import { WizardStep } from "~/types/wizard/wizard";
import InterviewAdditionalPriority from "../InterviewAdditionalPriority";
import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";

const InterviewStepContent = () => {
  const { wizard, activeStep, activeSubStep, showStarredQuestionsOnly } = useStoreState((state) => state.wizard);
  const { objectives } = useStoreState((state) => state.objective);
  const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);
  console.log(wizard);
  //const { discoverInterviewId } = useStoreState((state) => state.selected);

  //const urlObjectives = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${discoverInterviewId}/objective/list`;
  //const {data: objectives} = useSWR<Objective[]>([urlObjectives, getAccessToken()], fetcher);

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);
  const [stepObjectives, setStepObjectives] = React.useState<Objective[] | undefined>();
  const [stepObjectivesWithNoQuestion, setStepObjectivesWithNoQuestion] = React.useState<Objective[] | undefined>();
  const [unsavedForm, setUnsavedForm] = React.useState<boolean>(false);

  const dimensionOfLifeID = activeSubStep?.dimensionOfLife?.DimensionOfLifeID;
  const metricOfSuccessID = activeSubStep?.metricOfSuccess?.MetricOfSuccessID;

  const findObjectivesWithNoQuestion = () => {
    const result = objectives?.filter((objective: Objective) => objective?.QuestionID == 0 && objective?.DimensionOfLifeID == dimensionOfLifeID && objective?.MetricOfSuccessID == metricOfSuccessID);
    setStepObjectivesWithNoQuestion(result);
  }

  const populateObjectives = () => {
    if (isDreamInterview) {
      const result = findObjectivesForWizardStep(activeStep, objectives as Objective[]);
      setStepObjectives(result);
      findObjectivesWithNoQuestion();
    }
  }

  useMountEvents({
    onMounted: async () => {
      populateObjectives();
    },
    onChange: async () => {
      populateObjectives();
    },
    watchItems: [activeStep, activeSubStep, objectives]
  });


  return (
    <>
      {activeSubStep?.questions ? activeSubStep?.questions?.map((question: QuestionAndResponse, index: number) => {
        return (
          <>
            {(!showStarredQuestionsOnly || (showStarredQuestionsOnly && Boolean(question?.Question?.Starred))) ?
              <InterviewStepQuestion key={question?.Question?.QuestionID}
                                     index={index}
                                     wizard={wizard}
                                     step={activeStep}
                                     subStep={activeSubStep}
                                     question={question} 
                                     setUnsavedProgress={setUnsavedForm}
                                     unsavedProgress={unsavedForm}/>
            : null}
          </>
        )
      }) : null }
      {stepObjectivesWithNoQuestion && stepObjectivesWithNoQuestion?.length > 0 ?
      <InterviewAdditionalPriority priorities={stepObjectivesWithNoQuestion} metricOfSuccessID={metricOfSuccessID as number} dimensionOfLifeID={dimensionOfLifeID as number}/>
                                     : null}
    </>
  )
}

export default InterviewStepContent;

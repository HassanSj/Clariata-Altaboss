import React from "react";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {useStoreState} from "~/store/hooks";
import EvaluationStepQuestion from "~/ui/components/Wizard/Evaluations/EvaluationStepQuestion";

const EvaluationStepContent = () => {
  const { wizard, activeStep, activeSubStep } = useStoreState((state) => state.wizard);

  return (
    <>
      {activeSubStep?.questions ? activeSubStep?.questions.map((question: QuestionAndResponse, index: number) => {
        return (
          <EvaluationStepQuestion key={index}
                                 index={index}
                                 wizard={wizard}
                                 step={activeStep}
                                 subStep={activeSubStep}
                                 question={question} />
        )
      }) : null }
    </>
  )
}

export default EvaluationStepContent;
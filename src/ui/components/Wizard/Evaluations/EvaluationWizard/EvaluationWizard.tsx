import React from 'react';
import Wizard from "~/ui/components/Wizard/Wizard";
import {WizardType} from "~/ui/constants/wizard";
import EvaluationStepContent from "~/ui/components/Wizard/Evaluations/EvaluationStepContent";

interface IProps {
  id?: number;
}

const EvaluationWizard = ({ id }: IProps) => {
  return (
    <>
      <Wizard id={id}
              type={WizardType.EVALUATION}
              stepComponent={EvaluationStepContent} />
    </>
  )
};

export default EvaluationWizard;

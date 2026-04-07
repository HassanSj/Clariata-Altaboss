import React from 'react';
import EvaluationWizard from "~/ui/components/Wizard/Evaluations/EvaluationWizard";
import {useRouter} from "next/router";

const Evaluation = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <EvaluationWizard id={Number(id)} />
    </>
  );
};

export default Evaluation;

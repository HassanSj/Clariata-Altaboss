import React from 'react';
import InterviewWizard from "~/ui/components/Wizard/Interviews/InterviewWizard";
import {useRouter} from "next/router";

const Interview = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("ID: " + id);
  return (
    <>
      <InterviewWizard id={Number(id)}
                       key={String(id)} />
    </>
  );
};

export default Interview;

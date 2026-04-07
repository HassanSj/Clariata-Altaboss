import React from "react";
import styles from "./WizardNav.module.scss";
import {List} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import StepLink from "~/ui/components/Wizard/WizardNav/components/StepLink";
import {WizardStepType} from "~/ui/constants/wizard";
import useOnChange from "~/ui/hooks/useOnChange";

interface IProps {
  onSelectSubStep: (index: number) => unknown;
}

const WizardNav = ({ onSelectSubStep }: IProps) => {
  const { wizard, activeStep, activeSubStep } = useStoreState((state) => state.wizard);

  let firstStep = 0;

  useOnChange({
    onChange: () => {
      if(wizard?.filtered) firstStep = 0;;
    },
    values: [wizard?.filtered]
  });


  const handleSelectOnce = (index: number) => {
    if(firstStep === 0) {
      firstStep++;
      onSelectSubStep(index);
    }
  }

  return (
    <>
      <div className={styles.wizard_left}>
        <div className={styles.wizard_nav}>
          <List>
            {activeStep?.steps ? activeStep.steps.map((step, index) => (
              <StepLink key={index}
                        index={index}
                        step={step}
                        type={WizardStepType.SUB_STEP}
                        onSelect={onSelectSubStep}
                        handleSelectOnce={handleSelectOnce}/>
            )) : null}
          </List>
        </div>
      </div>
    </>
  )
}

export default WizardNav;

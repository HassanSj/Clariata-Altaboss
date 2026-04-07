import React from "react";
import {WizardStep} from "~/types/wizard/wizard";
import classnames from "classnames";
import styles from "~/ui/components/Wizard/WizardHeader/WizardHeader.module.scss";
import StepLabel from "@material-ui/core/StepLabel";
import StepIcon from "~/ui/components/Wizard/WizardNav/components/StepIcon";
import Step from "@material-ui/core/Step";
import {WizardStepCompletionStatus, WizardStepStatus, WizardStepValidityStatus} from "~/ui/constants/wizard";
import {Icon} from "@material-ui/core";
import {getWizardStepAvatarClasses, getWizardStepClasses, updateStepStatuses} from "~/services/interview";
import useOnChange from "~/ui/hooks/useOnChange";
import {useStoreState} from "~/store/hooks";

interface IProps {
  step: WizardStep;
  index: number;
  onSelectStep: (idx: number) => unknown;
}

const StepHeaderLink = ({ step, index, onSelectStep }: IProps) => {
  const { wizard, activeStepIndex } = useStoreState((state) => state.wizard);
  const [classes, setClasses] = React.useState(getWizardStepClasses(step));
  const [avatarClasses, setAvatarClasses] = React.useState(getWizardStepAvatarClasses(step));

  const updateClasses = () => {
    const updatedStep = updateStepStatuses(wizard, step);
    setClasses(getWizardStepClasses(updatedStep));
    setAvatarClasses(getWizardStepAvatarClasses(updatedStep));
  }

  const changeEvent = useOnChange({
    values: [activeStepIndex],
    onChange: () => {
      updateClasses();
    }
  });

  const getStepIconProps = () => {
    return {
      active: Boolean(step.status === WizardStepStatus.ACTIVE),
      classes: {},
      completed: Boolean(step.completionStatus === WizardStepCompletionStatus.COMPLETED),
      error: Boolean(step.validityStatus === WizardStepValidityStatus.INVALID),
      icon: <Icon>error</Icon>,
    }
  }

  const getProgress = () => {
    return `${step?.completedStepsCount?.toFixed(0)} of ${step?.totalStepsCount?.toFixed(0)} steps`;
  }

  return (
    <Step onClick={() => onSelectStep(step.index)} key={index} className={classnames(styles.wizard_step, step.classes)}>
      <StepLabel StepIconComponent={StepIcon}
                 StepIconProps={getStepIconProps()}
                 className={styles.wizard_step_label}>
        <div className={styles.wizard_header_stepper_label}>
          {step.title}
        </div>
        <div className={styles.wizard_subheader_stepper_label}>
          {getProgress()}
        </div>
      </StepLabel>
    </Step>
  )
}

export default StepHeaderLink;

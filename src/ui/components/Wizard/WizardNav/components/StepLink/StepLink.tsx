import React from "react";
import {WizardStep} from "~/types/wizard/wizard";
import classnames from "classnames";
import styles from "./StepLink.module.scss";
import {Avatar, Badge, Icon, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {WizardStepType, WizardStepValidityStatus, WizardType} from "~/ui/constants/wizard";
import {useStoreState, useStoreActions} from "~/store/hooks";
import useOnChange from "~/ui/hooks/useOnChange";
import {
  computeStepResponseCount,
  getWizardStepAvatarClasses,
  getWizardStepClasses,
  updateStepStatuses
} from "~/services/interview";
import useMountEvents from "~/ui/hooks/useMountEvents";
import UnsavedPopup from "~/ui/components/Dialogs/UnsavedPopup";
import { InterviewDataType } from "~/ui/constants/interview";
import { ReportTypes } from "~/ui/constants/reports";

interface IProps {
  index: number;
  step: WizardStep;
  type: WizardStepType;
  onSelect: (index: number) => unknown;
  handleSelectOnce?: (index: number) => unknown;
}

const StepLink = ({ index, step, type, onSelect, handleSelectOnce }: IProps) => {
  const { selectedInterview, isUnsaved } = useStoreState((state) => state.interview);
  const { wizard, activeStep, activeStepIndex, activeSubStep, activeSubStepIndex } = useStoreState((state) => state.wizard);
  const { objectives } = useStoreState((state) => state.objective);
  const { onSetIsSaved } = useStoreActions(actions => actions.interview);

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);

  const [classes, setClasses] = React.useState(getWizardStepClasses(step));
  const [avatarClasses, setAvatarClasses] = React.useState(getWizardStepAvatarClasses(step));
  const [responseCount, setResponseCount] = React.useState(isDreamInterview ? computeStepResponseCount(step, objectives) : computeStepResponseCount(step));
  const [showConfirmUnsaved, setShowConfirmUnsaved] = React.useState<boolean>(false);


  const handleSelect = () => {
    onSelect(step.index);
  }

  const updateClasses = () => {
    const updatedStep = updateStepStatuses(wizard, step);
    setClasses(getWizardStepClasses(updatedStep));
    setAvatarClasses(getWizardStepAvatarClasses(updatedStep));
  }

  const doRender = () => {
    // if ((wizard?.onlyUnanswered && step?.completedQuestionsCount! < step?.totalQuestionsCount! 
    if ((wizard?.filtered 
      && ((!isDreamInterview && wizard.selectedSections && wizard?.selectedSections?.some(s => s == step?.discoveryCategory?.DimensionOfLifeID)) || !wizard?.selectedSections) 
      && ((!isDreamInterview && wizard.selectedReport && step?.questions?.some(q => ReportTypes[wizard.selectedReport!].questionIds!?.indexOf(q?.Question?.QuestionID!) >= 0)) || !wizard?.selectedReport)) 
      || !wizard?.filtered ) return true;

      return false
  }

  useOnChange({
    onChange: () => {
      updateClasses();
    },
    values: [activeSubStepIndex]
  });

  useOnChange({
    onChange: () => {
      if(wizard?.filtered && doRender() && handleSelectOnce) handleSelectOnce(step?.index);
    },
    values: [wizard?.filtered]
  });

  useMountEvents({
    onChange: async () => {
      setResponseCount(isDreamInterview ? computeStepResponseCount(step, objectives) : computeStepResponseCount(step));
    },
    watchItems: [step]
  });

  return (
    <>
      {doRender() ?
      <>
        <ListItem button
                  onClick={() => {
                    if(!isUnsaved) handleSelect();
                    else setShowConfirmUnsaved(isUnsaved);
                  }}
                  className={classnames(classes)}>
          <ListItemText>
            <div className={styles.step_link_header}>
              {step.title}
            </div>
            <div className={styles.step_link_subheader}>
              {responseCount} responses
            </div>
          </ListItemText>

          { step.validityStatus === WizardStepValidityStatus.INVALID ?
            <Badge badgeContent={4} color="error">
              <Icon>report_problem</Icon>
            </Badge>
            : null }
        </ListItem>
        <UnsavedPopup isOpen={showConfirmUnsaved}
                      onCancel={() => setShowConfirmUnsaved(false)} 
                      onConfirm={async () => {
                        setShowConfirmUnsaved(false);
                        handleSelect();
                        await onSetIsSaved({
                          type: InterviewDataType.FORM,
                          saved: false
                        })
                      }}/>
      </>
      : null }
    </>
  );
}

export default StepLink;

import React, { FunctionComponent, useState } from "react";
import styles from "./WizardContent.module.scss";
import classnames from 'classnames';
import { Box, Button, Grid } from "@material-ui/core";
import { useStoreActions, useStoreState } from "~/store/hooks";
import { WizardType, WizardViewType } from "~/ui/constants/wizard";
import { ReportTypes } from "~/ui/constants/reports";

interface IProps {
  stepComponent: FunctionComponent;
  selectedView: WizardViewType;
  onSelectStep: (idx: number) => unknown;
  onSelectSubStep: (idx: number) => unknown;
}

const WizardContent = ({ stepComponent, selectedView }: IProps) => {
  const { activeStep, activeSubStep, wizard } = useStoreState((state) => state.wizard);
  const { onToggleExpanded, toggleExpanded, setSingleExpanded } = useStoreActions((actions) => actions.wizard);
  const [toggles, setToggles] = React.useState<boolean>(false)

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);

  return (
    <>
      <div className={classnames(styles.wizard_right, { [styles.wizard_right_drawer]: (selectedView === WizardViewType.WIZARD) })}>
        <div className={styles.wizard_progress}>
          {/* {(wizard?.filtered && activeSubStep?.completedQuestionsCount! < activeSubStep?.totalQuestionsCount!  */}
          {(wizard?.filtered
            && ((!isDreamInterview && wizard.selectedSections && wizard?.selectedSections?.some(s => s == activeSubStep?.discoveryCategory?.DimensionOfLifeID)) || !wizard?.selectedSections)
            && ((!isDreamInterview && wizard.selectedReport && activeSubStep?.questions?.some(q => ReportTypes[wizard.selectedReport!].questionIds!?.indexOf(q?.Question?.QuestionID!) >= 0)) || !wizard?.selectedReport))
            || !wizard?.filtered ?
            <>
            <Grid container>
              <Grid container item xs={8}>
                <Box className={styles.wizard_progress_item}>
                  <b>{activeSubStep?.title}</b>
                </Box>
              </Grid>
              <Grid container item xs={4} justifyContent="flex-end">                
                <Box className={styles.wizard_progress_item}>
                  <b>{activeSubStep?.questions?.length}</b> {activeSubStep?.questions?.length === 1 ? 'question' : 'questions'}
                </Box>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container item xs={12} justifyContent="flex-end">
                  <Box className={styles.wizard_progress_item}>
                      <Button className={styles.wizard_header_menu_button}
                      color="secondary"
                      variant="contained" onClick={() => {
                        setSingleExpanded("all")
                        toggleExpanded(!wizard?.toggleExpanded)
                      }}>{!wizard?.toggleExpanded ? "Expand" : "Collapse"} All</Button>
                    </Box>
                </Grid>
            </Grid>
            </>
            : 'There are no unanswered questions left here'}
        </div>
        <div className={styles.wizard_content}>
          {React.createElement(stepComponent, { key: `${activeStep?.index}-${activeSubStep?.index}` })}
        </div>
      </div>
    </>
  )
}

export default WizardContent;

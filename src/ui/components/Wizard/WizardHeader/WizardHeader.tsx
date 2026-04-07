import React from "react";
import styles from "./WizardHeader.module.scss";
import classnames from 'classnames';
import {ButtonGroup, CardContent, Grid, Icon, IconButton, Menu, MenuItem, Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {toPercentage} from "~/ui/constants/utils";
import Stepper from "@material-ui/core/Stepper";
import StepIconConnector from "~/ui/components/Wizard/WizardNav/components/StepIconConnector";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepIcon from "~/ui/components/Wizard/WizardNav/components/StepIcon";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {WizardStep} from "~/types/wizard/wizard";
import ReportsModal from "~/ui/components/Reports/ReportsModal";
import {
  WizardStepCompletionStatus,
  WizardStepValidityStatus,
  WizardType,
  WizardViewType
} from "~/ui/constants/wizard";
import {computeStepResponseCount} from "~/services/interview";
import UnsavedPopup from "../../Dialogs/UnsavedPopup";
import { InterviewDataType } from "~/ui/constants/interview";
import InterviewReportFilter from "../Interviews/InterviewReportFilter";
import InterviewResponseFilter from "../Interviews/InterviewResponseFilter";

enum WizardHeaderMenuLinks {
  DIMENSION,
  METRIC,
  TOP,
  BACK,
  NEXT,
  GRIDNAV,
  GRID,
  WIZARD,
  STAR
}

interface IProps {
  title?: string;
  subtitle?: string;
  totalQuestionsCount?: number;
  totalCompletedQuestionsCount?: number;
  onExport?: () => unknown,
  onExportWithResponses?: () => unknown,
  onExportExcel?: () => unknown,
  onExportWithResponsesExcel?: () => unknown,
  onReview?: () => unknown;
  onSelectStep: (index: number, subIndex: number) => unknown;
  onSelectSubStep: (index: number) => unknown;
  onPreviousSubStep: () => unknown;
  onNextSubStep: () => unknown;
  onToggleGrid?: () => unknown;
  hideNav?: boolean;
  selectedView?: string;
  onToggleView?: (view: WizardViewType) => unknown;
  onToggleGridNav: (visible: boolean) => unknown;
}

const WizardHeader = ({ title,
                        subtitle,
                        totalQuestionsCount,
                        totalCompletedQuestionsCount,
                        onExport,
                        onExportWithResponses,
                        onExportExcel,
                        onExportWithResponsesExcel,
                        onReview,
                        onSelectStep,
                        onSelectSubStep,
                        onPreviousSubStep,
                        onNextSubStep,
                        onToggleGrid,
                        hideNav = false,
                        selectedView,
                        onToggleView,
                        onToggleGridNav
}: IProps) => {
  const { wizard, activeStep, activeStepIndex, activeSubStep, activeSubStepIndex, showStarredResponsesOnly } = useStoreState((state) => state.wizard);
  const { objectives } = useStoreState((state) => state.objective);
  const { isUnsaved } = useStoreState((state) => state.interview);

  const { onToggleStarredResponses } = useStoreActions(actions => actions.wizard);
  const { onSetIsSaved } = useStoreActions(actions => actions.interview);

  const [showReportsDialog, setShowReportsDialog] = React.useState(false);

  const [reportsMenuEl, setReportsMenuEl] = React.useState(null);
  const [stepMenuEl, setStepMenuEl] = React.useState(null);
  const [subStepMenuEl, setSubStepMenuEl] = React.useState(null);
  const [showConfirmUnsaved, setShowConfirmUnsaved] = React.useState<boolean>(false);

  const [lastClickType, setLastClickType] = React.useState<WizardHeaderMenuLinks>();
  const [clickedStepIndex, setClickedStepIndex] = React.useState<number>();

  const isInterview = (wizard?.type === WizardType.DREAM_INTERVIEW || wizard?.type === WizardType.DISCOVER_INTERVIEW);
  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);

  const progress = toPercentage(totalCompletedQuestionsCount, totalQuestionsCount);
  const isLastStep = (wizard?.activeStepIndex && wizard?.activeSubStepIndex && activeStep?.steps) ?
    (wizard?.activeStepIndex === (wizard?.steps?.length - 1)) && (wizard?.activeSubStepIndex === (activeStep?.steps?.length - 1)) :
    false;

  const handleConfirm = () => {
    switch(lastClickType) {
      case WizardHeaderMenuLinks.DIMENSION: {
        if(clickedStepIndex) {
          setStepMenuEl(null); 
          onSelectStep(clickedStepIndex, activeSubStep.index); 
        }
        break;
      }
      case WizardHeaderMenuLinks.METRIC: {
        if(clickedStepIndex) {
          setSubStepMenuEl(null); 
          onSelectSubStep(clickedStepIndex); 
        }
        break;
      }
      case WizardHeaderMenuLinks.TOP: {
        if(clickedStepIndex) {
          onSelectStep(clickedStepIndex, activeSubStep.index)
        }
        break;
      }
      case WizardHeaderMenuLinks.BACK: {
        onPreviousSubStep();
        break;
      }
      case WizardHeaderMenuLinks.NEXT: {
        onNextSubStep();
        break;
      }
      case WizardHeaderMenuLinks.GRIDNAV: {
        onToggleGridNav(true);
        break;
      }
      case WizardHeaderMenuLinks.GRID: {
        toggleView(WizardViewType.GRID);
        break;
      }
      case WizardHeaderMenuLinks.WIZARD: {
        toggleView(WizardViewType.WIZARD);
        break;
      }
      case WizardHeaderMenuLinks.STAR: {
        toggleStarredResponsesOnly();
        break;
      }
      default: break;
    }
  }

  const getStepIconProps = (step: WizardStep) => {
    return {
      active: Boolean(step?.index === activeStepIndex),
      classes: {},
      completed: Boolean(step.completionStatus === WizardStepCompletionStatus.COMPLETED),
      error: Boolean(step.validityStatus === WizardStepValidityStatus.INVALID),
      icon: <Icon>error</Icon>,
    }
  }

  const getProgress = (step: WizardStep) => {
    return `${step?.percentCompleted?.toFixed(0)}% complete (${step?.completedStepsCount?.toFixed(0)} of ${step?.totalStepsCount?.toFixed(0)} ${step?.totalStepsCount === 1 ? 'step' : 'steps'})`;
  }

  const isActive = (index: number) => {
    return index === activeStepIndex;
  }

  const toggleGrid = () => {
    if (onToggleGrid) {
      onToggleGrid();
    }
  }

  const toggleView = (view: WizardViewType) => {
    if (onToggleView) {
      onToggleView(view);
    }
  }

  const toggleStarredResponsesOnly = () => {
    onToggleStarredResponses(!showStarredResponsesOnly);
  }

  const applyFilter = (sections: number[], clarifying: boolean) => {

  }

  return (
    <>
      <CardContent>
        {/* <div className={classnames(styles.headerImage,
            { [styles.discover]: !isDreamInterview },
            { [styles.dream]: isDreamInterview })}></div> */}
      </CardContent>
      <div className={styles.wizard_header}>
      {/* <Grid container spacing={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <InterviewReportFilter dreamInterview={isDreamInterview} />
        </Grid>
      </Grid> */}
        <Grid container>
          <Grid item xs={6}>
            <div className={styles.wizard_title}>
              {title}
            </div>
            { totalCompletedQuestionsCount && totalQuestionsCount ?
              <div className={styles.wizard_subtitle}>
                <b>{totalCompletedQuestionsCount}</b> of <b>{totalQuestionsCount}</b> questions
                ({progress?.toFixed(0)}%)
              </div>
              : null }
          </Grid>
          <Grid container item xs={6} justifyContent="flex-end">
            { isInterview ?
              <>
                  {isDreamInterview ?
                    <Tooltip title="Navigate back to navigation grid">
                      <Button className={styles.wizard_header_menu_button}
                              color="secondary"
                              variant="contained"
                              startIcon={<Icon>view_module</Icon>}
                              onClick={() => {
                                if(!isUnsaved) {
                                  onToggleGridNav(true);
                                }
                                else {
                                  setLastClickType(WizardHeaderMenuLinks.GRIDNAV);
                                  setShowConfirmUnsaved(isUnsaved);
                                }
                              }}>
                        Go to Dream Grid
                      </Button>
                    </Tooltip> : null }
                  {/* { isDreamInterview ? null
                  : <Button className={styles.reports_button}
                          variant="outlined"
                          size="large"
                          onClick={() => setShowReportsDialog(true)}>
                        Print Report
                  </Button>} */}
               
                  
                  { isDreamInterview ?
                  <ButtonGroup className={styles.wizard_header_menu_button}>
                  <Tooltip title="Wizard View">
                    <Button className={styles.wizard_header_menu_views_button}
                            variant={selectedView === WizardViewType.WIZARD ? 'contained' : 'outlined'}
                            color={selectedView === WizardViewType.WIZARD ? 'secondary' : 'default'}
                            value={WizardViewType.WIZARD}
                            onClick={() => {
                              if(!isUnsaved) {
                                toggleView(WizardViewType.WIZARD);
                              }
                              else {
                                setLastClickType(WizardHeaderMenuLinks.WIZARD);
                                setShowConfirmUnsaved(isUnsaved);
                              }
                            }}>
                      Wizard
                    </Button>
                  </Tooltip>
                  <Tooltip title="Grid View">
                    <Button className={styles.wizard_header_menu_views_button}
                            variant={selectedView === WizardViewType.GRID ? 'contained' : 'outlined'}
                            color={selectedView === WizardViewType.GRID ? 'secondary' : 'default'}
                            value={WizardViewType.GRID}
                            onClick={() => {
                              if(!isUnsaved) {
                                toggleView(WizardViewType.GRID);
                              }
                              else {
                                setLastClickType(WizardHeaderMenuLinks.GRID);
                                setShowConfirmUnsaved(isUnsaved);
                              }
                            }}>
                      Grid
                    </Button>
                  </Tooltip>
                  </ButtonGroup> : null}
                  {!isDreamInterview ? 
                  <>
                    <InterviewResponseFilter dreamInterview={false} applyFilter={applyFilter} onNextSubStep={onNextSubStep}/>
                  </> : null}
                
                <Menu
                  id="reports-menu"
                  anchorEl={reportsMenuEl}
                  keepMounted
                  open={Boolean(reportsMenuEl)}
                  onClose={() => setReportsMenuEl(null)}>
                  { onExport ? <MenuItem onClick={() => { setReportsMenuEl(null); onExport(); }}>View all Questions - PDF</MenuItem> : null }
                  { onExportWithResponses ? <MenuItem onClick={() => { setReportsMenuEl(null); onExportWithResponses(); }}>View all Responses - PDF</MenuItem> : null }
                  { onExportExcel ? <MenuItem onClick={() => { setReportsMenuEl(null); onExportExcel(); }}>View all Questions - Excel</MenuItem> : null }
                  { onExportWithResponsesExcel ? <MenuItem onClick={() => { setReportsMenuEl(null); onExportWithResponsesExcel(); }}>View all Responses - Excel</MenuItem> : null }
                </Menu>
              </>
            : null}
          </Grid>
          {!isDreamInterview ?
          <Grid container justifyContent="flex-end">
            {/* <Grid item xs={3}> */}
            <Tooltip title="Navigate back to navigation grid">
              <Button className={styles.wizard_header_menu_button}
                      color="secondary"
                      variant="contained"
                      startIcon={<Icon>view_module</Icon>}
                      onClick={() => {
                        if(!isUnsaved) {
                          onToggleGridNav(true);
                        }
                        else {
                          setLastClickType(WizardHeaderMenuLinks.GRIDNAV);
                          setShowConfirmUnsaved(isUnsaved);
                        }
                      }}>
                Go to Discover Grid
              </Button>
            </Tooltip>
            {/* </Grid>
            <Grid item xs={3}></Grid> */}
          </Grid> : null }
         
          <ReportsModal isOpen={showReportsDialog}
                   onClose={() => setShowReportsDialog(false)}></ReportsModal>
        </Grid>
      </div>
      { (selectedView === WizardViewType.WIZARD) && (wizard?.steps?.length > 1) ?
        <div className={styles.wizard_header_progress}>
          <Stepper className={styles.wizard_header_stepper}
                   alternativeLabel
                   activeStep={wizard?.activeStepIndex}
                   connector={<StepIconConnector />}>
            {wizard?.steps ? wizard?.steps.map((step, index) => (
              <Step onClick={() => {
                      if(!isUnsaved) {
                        onSelectStep(step.index, activeSubStep.index)
                      }
                      else {
                        setClickedStepIndex(step.index);
                        setLastClickType(WizardHeaderMenuLinks.TOP);
                        setShowConfirmUnsaved(isUnsaved);
                      }
                    }}
                    key={index}
                    className={classnames({
                      [styles.wizard_header_step]: true,
                      [styles.wizard_header_step_active]: (activeStepIndex === index),
                      [styles.wizard_header_step_completed]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED)
                    })}>
                <StepLabel StepIconComponent={StepIcon}
                           StepIconProps={getStepIconProps(step)}
                           className={styles.wizard_step_label}>
                  <div className={styles.wizard_header_stepper_label}>
                    {step.title}
                  </div>
                  <div className={styles.wizard_subheader_stepper_label}>
                    {isDreamInterview ? computeStepResponseCount(step, objectives, true) : computeStepResponseCount(step)} responses
                  </div>
                </StepLabel>
              </Step>
            )) : null}
          </Stepper>
        </div>
        : null }
      <div className={styles.wizard_actions}>
        <Grid container>
          <Grid item xs={8}>
            { isDreamInterview ?
            <>
              <Button onClick={(e: any) => setStepMenuEl(e.currentTarget)}>
                {activeStep?.title}
                <Icon>expand_more</Icon>
              </Button>
              <Menu
                id="substep-menu"
                anchorEl={stepMenuEl}
                keepMounted
                open={Boolean(stepMenuEl)}
                onClose={() => setStepMenuEl(null)}>
                { wizard?.steps?.map((step: WizardStep, index: number) => (
                  <MenuItem key={index} onClick={() => { 
                    if(!isUnsaved) {
                      setStepMenuEl(null); 
                      onSelectStep(step.index, activeSubStep.index); 
                    }
                    else {
                      setClickedStepIndex(step.index);
                      setLastClickType(WizardHeaderMenuLinks.DIMENSION);
                      setShowConfirmUnsaved(isUnsaved);
                    }
                  }}>{step?.title}</MenuItem>
                ))}
              </Menu>
              /
              <Button onClick={(e: any) => setSubStepMenuEl(e.currentTarget)}>
                {activeSubStep?.title}
                <Icon>expand_more</Icon>
              </Button>
              <Menu
                id="substep-menu"
                anchorEl={subStepMenuEl}
                keepMounted
                open={Boolean(subStepMenuEl)}
                onClose={() => setSubStepMenuEl(null)}>
                { activeStep?.steps?.map((step: WizardStep, index: number) => (
                  <MenuItem key={index} onClick={() => { 
                    if(!isUnsaved) {
                      setSubStepMenuEl(null); 
                      onSelectSubStep(step.index); 
                    }
                    else {
                      setClickedStepIndex(step.index);
                      setLastClickType(WizardHeaderMenuLinks.METRIC);
                      setShowConfirmUnsaved(isUnsaved);
                    }
                  }}>{step?.title}</MenuItem>
                ))}
              </Menu>
            </>
            :
            <>
              <Button onClick={() => onSelectStep(activeStep?.index, activeSubStep.index)}>{activeStep?.title}</Button> / <Button onClick={() => onSelectSubStep(activeSubStep?.index)}>{activeSubStep?.title}</Button>
            </>
            }
          </Grid>
          <Grid container item xs={4} justifyContent="flex-end">
            { (selectedView === WizardViewType.WIZARD) ?
              <ButtonGroup fullWidth variant="text" aria-label="button group">
                <Button color="primary"
                        disabled={wizard?.activeStepIndex === 0 && wizard?.activeSubStepIndex === 0}
                        startIcon={<Icon>keyboard_arrow_left</Icon>}
                        onClick={() => {
                          if(!isUnsaved) {
                            onPreviousSubStep();
                          }
                          else {
                            setLastClickType(WizardHeaderMenuLinks.BACK);
                            setShowConfirmUnsaved(isUnsaved);
                          }
                        }}>
                  Back
                </Button>
                { isLastStep ? null :
                <Button color={isLastStep ? 'secondary' : 'primary'}
                        endIcon={<Icon>keyboard_arrow_right</Icon>}
                        onClick={() => {
                          if(!isUnsaved) {
                            onNextSubStep();
                          }
                          else {
                            setLastClickType(WizardHeaderMenuLinks.NEXT);
                            setShowConfirmUnsaved(isUnsaved);
                          }
                        }}>
                  {isLastStep ? 'Finish' : 'Next'}
                </Button>
                }
              </ButtonGroup>
            : null}
          </Grid>
        </Grid>
      </div>
      <UnsavedPopup isOpen={showConfirmUnsaved}
                    onCancel={() => setShowConfirmUnsaved(false)} 
                    onConfirm={async () => {
                      setShowConfirmUnsaved(false);
                      handleConfirm();
                      await onSetIsSaved({
                        type: InterviewDataType.FORM,
                        saved: false
                      })
                    }}/>


    </>
  )
}

export default WizardHeader;

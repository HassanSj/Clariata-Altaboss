import React from "react";
import {useRouter} from "next/router";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {WizardState} from "~/types/wizard/wizard";
import paths from "~/ui/constants/paths";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {WizardDataType, WizardType, WizardViewType} from "~/ui/constants/wizard";
import {InterviewDataType} from "~/ui/constants/interview";
import {InterviewFull} from "~/types/api/interviewFull";
import api from "~/services/api";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import useReports from "~/ui/hooks/useReports";
import {ReportType, ReportTypes} from "~/ui/constants/reports";
import { Alert } from "@material-ui/lab";
import useSWR from 'swr';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import { QuestionCategory } from "~/types/api/questionCategory";

const { DASHBOARD } = paths;

const useWizard = (type: WizardType, id?: number) => {
  const { toggleExpanded } = useStoreActions((actions) => actions.wizard);
  const notifications = useNotifications();
  const router = useRouter();
  const {
    selectedReport,
    selectedReportProps,
    selectedReportParams,
    selectedReportPath,
    showReport,
    viewReport,
    hideReport,
    downloadPdfReport,
    downloadExcelReport
  } = useReports();

  const [selectedView, setSelectedView] = React.useState(WizardViewType.WIZARD);
  const [showGridNav, setShowGridNav] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const { onPopulate, onSelect, onReset } = useStoreActions(actions => actions.wizard);
  const { wizard, activeStep, activeSubStep } = useStoreState((state) => state.wizard);
  const { selectedHousehold } = useStoreState((state) => state.household);
  const { selectedInterview, interviews } = useStoreState((state) => state.interview);
  const interviewActions = useStoreActions(actions => actions.interview);
  const evaluationActions = useStoreActions(actions => actions.evaluation);

  //const { discoverCategories } = useStoreState((state) => state.constants);
  const { data: discoverCategories } = useSWR<QuestionCategory[]>([`${process.env.NEXT_PUBLIC_API_URL}/discovercategory/list`, getAccessToken()], fetcher);

  /**
   * Initialize the wizard.
   */
  const initWizard = async () => {
    if (!selectedHousehold?.HouseholdID || !id || !type) {
      return;
    }
    setIsInitializing(true);
    showLoading("Loading wizard...");
    if (type===WizardType.DISCOVER_INTERVIEW || type===WizardType.DREAM_INTERVIEW) {
      const interview: InterviewFull = await api.interview.getFull(selectedHousehold.HouseholdID, Number(id));
      await interviewActions.onSelect({
        type: InterviewDataType.INTERVIEW,
        data: interview,
        router
      });
      if (router.query.showGrid === 'true') {
        setShowGridNav(true);
      }
    } else {
      let evaluation = null;
      if (!isNullOrUndefined(id)) {
        const evaluationResponse = await api.evaluation.get(Number(id));
        evaluation = evaluationResponse?.data;
      }
      await evaluationActions.onSelect({
        evaluation,
        router
      });
    }
    hideLoading();
    setIsInitializing(false);
  }

  /**
   * Update wizard state in store.
   * @param ws
   */
  const updateWizardState = (ws: WizardState) => {
    onPopulate(ws);
  }

  /**
   * Select a step by it's index.
   * @param step
   */
  const handleSelectStep = async (step: number, substep?: number) => {
    showLoading("Loading step...");
    const steps = (wizard?.steps ? (wizard?.steps?.length - 1) : 0);
    if (step < 0 || step > steps) return;
    wizard.activeStepIndex = step;
    wizard.activeSubStepIndex = substep ? substep : 0;
    await onSelect({
      type: WizardDataType.STEP,
      step: wizard.steps[step]
    });
    await onSelect({
      type: WizardDataType.SUB_STEP,
      step: wizard.steps[step]?.steps![substep ? substep : 0]
    });
    setShowGridNav(false);
    hideLoading();
  }

  /**
   * Select next step.
   */
  const handleNextStep = () => {
    const nextStep = wizard.activeStepIndex + 1;
    if (nextStep < wizard?.steps?.length) {
      handleSelectStep((nextStep < wizard?.steps?.length ? nextStep : wizard.activeStepIndex));
    }
    else {
      handleFinish();
    }
  };

  /**
   * Select a sub step of the current active step by it's index.
   * @param step
   */
  const handleSelectSubStep = (step: number) => {
    if (wizard.activeSubStepIndex === step) return;
    wizard.activeSubStepIndex = step;
    onSelect({
      type: WizardDataType.SUB_STEP,
      step: wizard.steps[wizard.activeStepIndex]?.steps![step]
    });
    setShowGridNav(false);
    toggleExpanded(false)
  }

  /**
   * Select next active sub step for the current step.
   */
  const handleNextSubStep = () => {
    if (!activeStep || !activeStep?.steps) return;
    const totalSteps = activeStep?.steps?.length;
    const nextSubStep = wizard.activeSubStepIndex + 1;
    if (nextSubStep < totalSteps) {
      handleSelectSubStep(nextSubStep);

      //filtered results handling
      const step = wizard?.steps[wizard.activeStepIndex]?.steps![nextSubStep];
      if(wizard?.filtered) {
        
        // if(step?.completedQuestionsCount! >= step?.totalQuestionsCount!) {
        //   handleNextSubStep(); 
        //   return; 
        // }
        if(wizard?.selectedSections && !wizard?.selectedSections?.some(s => s == step?.discoveryCategory?.DimensionOfLifeID)) {
          handleNextSubStep(); 
          return; 
        }
        if(wizard.selectedReport && !step?.questions?.some(q => ReportTypes[wizard.selectedReport!].questionIds!?.indexOf(q?.Question?.QuestionID!) >= 0)) {
          handleNextSubStep(); 
          return; 
        }
      }
    } else {
      handleNextStep();
    }
  };

  /**
   * Go back to previous sub step.
   */
  const handleBackSubStep = () => {
    const nextStep = wizard.activeStepIndex - 1;
    const nextSubStep = wizard.activeSubStepIndex - 1;
    if (nextSubStep < 0) {
      if (nextStep >= 0 && wizard?.steps[nextStep]?.steps) {
        handleSelectStep(nextStep);
      }
    } else {
      handleSelectSubStep((nextSubStep >= 0 ? nextSubStep : 0));

      //filtered results handling
      const step = wizard?.steps[wizard.activeStepIndex]?.steps![nextSubStep >= 0 ? nextSubStep : 0];
      if(wizard?.filtered) {
        if(step?.completedQuestionsCount! >= step?.totalQuestionsCount!) {
          handleBackSubStep(); 
          return; 
        }
        if(wizard?.selectedSections && !wizard?.selectedSections?.some(s => s == step?.discoveryCategory?.DimensionOfLifeID)) {
          handleBackSubStep(); 
          return; 
        }
        if(wizard.selectedReport && !step?.questions?.some(q => ReportTypes[wizard.selectedReport!].questionIds!?.indexOf(q?.Question?.QuestionID!) >= 0)) {
          handleBackSubStep(); 
          return; 
        }
      }
    }
  };

  /**
   * Select specific step and sub step.
   * @param step
   * @param subStep
   */
  const handleSelectStepAndSubStep = async (step: number, subStep: number) => {
    wizard.activeStepIndex = step;
    onSelect({
      type: WizardDataType.STEP,
      step: wizard.steps[step]
    });
    wizard.activeSubStepIndex = step;
    await onSelect({
      type: WizardDataType.SUB_STEP,
      step: wizard.steps[step]?.steps![subStep]
    });
    setShowGridNav(false);
  }

  /**
   * Restart the wizard.
   */
  const handleRestart = () => {
    wizard.activeStepIndex = 0;
    wizard.activeSubStepIndex = 0;
    updateWizardState(wizard);
  };

  /**
   * Submit finalized wizard questions.
   */
  const handleFinish = () => {
    // TODO - submit
    wizard.steps.some(step => step.completedStepsCount !== step.totalStepsCount) ?
    <Alert severity="error">Please complete all required questions! </Alert>
    : router.push(DASHBOARD);
    // router.push(DASHBOARD);
  };

  /**
   * Export wizard questions.
   */
  const handleExport = () => {
    if (isDreamInterview()) {
      downloadPdfReport(ReportType.DREAM_INTERVIEW);
    }
    else if (isDiscoverInterview()) {
      downloadPdfReport(ReportType.DISCOVER_INTERVIEW);
    }
  };

  /**
   * Export wizard questions.
   */
  const handleCustomExport = (type: ReportType) => {
    downloadPdfReport(type);
  };

  /**
   * Export wizard questions with answers.
   */
  const handleExportWithResponses = (hideUnansweredQuestions: boolean = false) => {
    if (isDreamInterview()) {
      downloadPdfReport(ReportType.DREAM_INTERVIEW);
    }
    else if (isDiscoverInterview()) {
      downloadPdfReport(ReportType.DISCOVER_INTERVIEW);
    }
  };

  /**
   * Export wizard questions.
   */
  const handleExportExcel = () => {
    if (isDreamInterview()) {
      downloadPdfReport(ReportType.DREAM_INTERVIEW);
    }
    else if (isDiscoverInterview()) {
      downloadPdfReport(ReportType.DISCOVER_INTERVIEW);
    }
  };

  /**
   * Export wizard questions with answers.
   */
  const handleExportWithResponsesExcel = (hideUnansweredQuestions: boolean = false) => {
    if (isDreamInterview()) {
      downloadPdfReport(ReportType.DREAM_INTERVIEW);
    }
    else if (isDiscoverInterview()) {
      downloadPdfReport(ReportType.DISCOVER_INTERVIEW);
    }
  };

  /**
   * Review all responses.
   */
  const handleReview = () => {
    // TODO - show review
    alert('TODO');
  };

  /**
   * Toggle to alernative view.
   */
  const handleToggleSelectedView = () => {
    setSelectedView(selectedView === WizardViewType.WIZARD ? WizardViewType.GRID : WizardViewType.WIZARD);
  };

  /**
   * Show loading indicator.
   * @param message
   */
  const showLoading = (message?: string) => {
    notifications.toggleLoading(true);
  }

  /**
   * Hide loading indicator.
   */
  const hideLoading = () => {
    notifications.toggleLoading(false);
  }

  /**
   * Update a specific setting.
   */
  const updateSetting = (dataType: WizardDataType, value: number) => {
    if (dataType === WizardDataType.STEP) {
      // TODO
    }
    if (dataType === WizardDataType.SUB_STEP) {
      // TODO
    }
  }

  /**
   * Check if wizard is an interview wizard.
   */
  const isInterview = () => {
    return type === WizardType.DISCOVER_INTERVIEW || type === WizardType.DREAM_INTERVIEW;
  };

  /**
   * Check if wizard is dream interview.
   */
  const isDreamInterview = () => {
    return isInterview() && type === WizardType.DREAM_INTERVIEW;
  };

  /**
   * Check if wizard is for discover interview.
   */
  const isDiscoverInterview = () => {
    return isInterview() && type === WizardType.DISCOVER_INTERVIEW;
  };

  useMountEvents({
    onMounted: async () => {
      initWizard();
    }
  });

  return {
    isLoading: notifications.isLoading,
    isInitializing,
    initWizard,
    updateWizardState,
    handleSelectStep,
    handleNextStep,
    handleSelectSubStep,
    handleNextSubStep,
    handleBackSubStep,
    handleSelectStepAndSubStep,
    handleRestart,
    handleFinish,
    handleExport,
    handleCustomExport,
    handleExportWithResponses,
    handleExportExcel,
    handleExportWithResponsesExcel,
    handleReview,
    selectedView,
    setSelectedView,
    handleToggleSelectedView,
    showGridNav,
    setShowGridNav
  };
}

export default useWizard;

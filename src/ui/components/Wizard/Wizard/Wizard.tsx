import React, {FunctionComponent, useRef} from 'react';
import styles from "./Wizard.module.scss";
import classnames from 'classnames';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {WizardType, WizardViewType} from "~/ui/constants/wizard";
import {useRouter} from "next/router";
import useWizard from "~/ui/hooks/useWizard";
import WizardHeader from "~/ui/components/Wizard/WizardHeader";
import WizardNav from "~/ui/components/Wizard/WizardNav";
import WizardContent from "~/ui/components/Wizard/WizardContent";
import InterviewGrid from "~/ui/components/Wizard/Interviews/InterviewGrid";
import useSWR from 'swr';
import { getInterviewWizard } from '~/services/interview';
import { Person } from '~/types/api/person';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import { QuestionCategory } from '~/types/api/questionCategory';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';
import { InterviewFull } from '~/types/api/interviewFull';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

interface IProps {
  id?: number;
  type: WizardType;
  stepComponent: FunctionComponent
}

const Wizard = ({ id,
                  type,
                  stepComponent
}: IProps) => {
  const router = useRouter();
  const classes = useStyles();
  const {
    isLoading,
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
  } = useWizard(type, id);


  //const { wizard } = useStoreState((state) => state.wizard);
  const { householdId } = useStoreState((state) => state.selected);

  const token = getAccessToken();

  const urlInterview =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/fullinterview/${id}`;
  const { data: interview } = useSWR<InterviewFull>([urlInterview, token], fetcher);
  console.log(interview);

  const urlPersons =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;
  console.log(urlPersons);
  const { data: persons} = useSWR<Person[]>([urlPersons, token], fetcher);
  console.log(persons);

  const { data: discoverCategories } = useSWR<QuestionCategory[]>([`${process.env.NEXT_PUBLIC_API_URL}/discovercategory/list`, token], fetcher);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, token], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, token], fetcher);

  const wizard = getInterviewWizard(interview as InterviewFull, discoverCategories as QuestionCategory[], persons as Person[], metricsOfSuccess as MetricOfSuccess[], dimensionsOfLife as DimensionOfLife[])
  console.log(wizard);
  const { onSelectQuestion } = useStoreActions((state) => state.wizard);

  const [hideNav, setHideNav] = React.useState(true);

  const toggleGrid = () => {
    setShowGridNav(!showGridNav);
  }

  const headerRef = useRef(null);

  console.log(wizard?.title);
  console.log(wizard?.totalCompletedQuestionsCount);
  console.log(wizard?.totalQuestionsCount);
  console.log(wizard?.totalSteps);

  return (
    <>
      { (!isInitializing && !showGridNav) ?
        <>
          <WizardHeader
            title={wizard?.title}
            totalCompletedQuestionsCount={wizard?.totalCompletedQuestionsCount}
            totalQuestionsCount={wizard?.totalQuestionsCount}
            onExport={handleExport}
            onExportWithResponses={handleExportWithResponses}
            onExportExcel={handleExportExcel}
            onExportWithResponsesExcel={handleExportWithResponsesExcel}
            onReview={handleReview}
            onSelectStep={handleSelectStep}
            onSelectSubStep={handleSelectSubStep}
            onPreviousSubStep={handleBackSubStep}
            onNextSubStep={handleNextSubStep}
            onToggleGrid={toggleGrid}
            onToggleView={(view) => setSelectedView(view)}
            onToggleGridNav={(visible) => setShowGridNav(visible)}
            selectedView={selectedView}
            hideNav={hideNav}
          />
          <div ref={headerRef} className={classnames({ [styles.wizard_container]: (selectedView === WizardViewType.WIZARD)})}>
            { (selectedView === WizardViewType.WIZARD) ? <WizardNav onSelectSubStep={(step:number) => {
              // @ts-ignore
              headerRef.current.scrollIntoView()
              onSelectQuestion({index:null})
              handleSelectSubStep(step)
            }} /> : null }
            <WizardContent stepComponent={stepComponent}
                           selectedView={selectedView}
                           onSelectStep={handleSelectStep}
                           onSelectSubStep={handleSelectSubStep} />
          </div>
        </>
      : null }
      { showGridNav ?
        <InterviewGrid
          id={id}
          isOpen={showGridNav}
          onClose={() => setShowGridNav(false)}
          onBack={() => setShowGridNav(false)}
          onSelectStep={handleSelectStep}
          onSelectSubStep={handleSelectSubStep}
          onSelectStepAndSubStep={handleSelectStepAndSubStep}
          onExport={handleExport}
          onExportWithResponses={handleExportWithResponses}
          onExportExcel={handleExportExcel}
          onExportWithResponsesExcel={handleExportWithResponsesExcel}
          onCustomExport={handleCustomExport}
          onToggleGridNav={(visible) => setShowGridNav(visible)}/>

        : null }
    </>
  );
};

export default Wizard;

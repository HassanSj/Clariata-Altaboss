import styles from "./InterviewGrid.module.scss";
import classnames from 'classnames';
import { useStoreState } from "~/store/hooks";
import React, { useState } from "react";
import { Box, Card, CardContent, Checkbox, Chip, Grid, Icon, Tooltip, Button as MuiButton, Divider } from "@material-ui/core";
import { WizardStep } from "~/types/wizard/wizard";
import { WizardType } from "~/ui/constants/wizard";
import { hasItems, isNullOrUndefined, toDateTimeShort } from "~/ui/constants/utils";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { BOTH_PERSONS_OPTION, getInterviewWizard, getStepResponsesByPerson } from "~/services/interview";
import { useRouter } from "next/router";
import paths from "~/ui/constants/paths";
import Button from "~/ui/components/Button";
import { ReportType } from "~/ui/constants/reports";
import InterviewReportFilter from "../InterviewReportFilter";
import Modal from "~/ui/components/Dialogs/Modal";
import Resource from "~/ui/components/Resource";
import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import { InterviewFull } from "~/types/api/interviewFull";
import { QuestionCategory } from "~/types/api/questionCategory";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import Link from "next/dist/client/link";

interface IStepProps {
  parent?: WizardStep;
  step: WizardStep;
  index: number;
  showChildrenOnly: boolean;
  isNestedStep: boolean;
  onSelectStep: (idx: number) => unknown;
  onSelectSubStep: (idx: number) => unknown;
  onSelectStepAndSubStep: (step: number, subStep: number) => unknown;
  selector?: boolean;
  selectSection?: (Id?: number) => unknown;
  selectorDream?: boolean;
}

export const InterviewGridStep = ({ parent, step, index, showChildrenOnly, isNestedStep, onSelectStep, onSelectSubStep, onSelectStepAndSubStep, selector, selectSection, selectorDream }: IStepProps) => {
  const { wizard, activeStep, activeSubStep } = useStoreState((state) => state.wizard);
  const { householdId } = useStoreState((state) => state.selected);
  //const { selectedHousehold } = useStoreState(state => state.household);

  const { data: selectedHousehold } = useSWR<Household>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`, getAccessToken()], fetcher);
  const { data: persons } = useSWR<Person[]>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`, getAccessToken()], fetcher);



  const { objectives } = useStoreState(state => state.objective);

  console.log("InterviewGridStep")

  const [responseStats, setResponseStats] = React.useState<any | undefined>();
  const [steps, setSteps] = React.useState(Object.assign([], step?.steps));
  const isInterview = (wizard?.type === WizardType.DREAM_INTERVIEW || wizard?.type === WizardType.DISCOVER_INTERVIEW);
  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);
  const isParentSelected = (!isNullOrUndefined(parent) && (parent?.index === activeStep?.index));
  const isSelected = (activeSubStep?.index === index) && isParentSelected;

  const onSelect = () => {
    if (parent) {
      onSelectStepAndSubStep(parent.index, step.index);
    }
  }

  const populateResponses = () => {
    if (isDreamInterview)
      setResponseStats(getStepResponsesByPerson(step, (persons && persons.length > 1) ? [...persons, BOTH_PERSONS_OPTION] : (persons && persons.length == 1) ? [persons[0]] : [BOTH_PERSONS_OPTION], objectives));
    else
      setResponseStats(getStepResponsesByPerson(step, (persons && persons.length > 1) ? [...persons, BOTH_PERSONS_OPTION] : (persons && persons.length == 1) ? [persons[0]] : [BOTH_PERSONS_OPTION]));
  }

  useMountEvents({
    onMounted: () => {
      populateResponses();
    },
  });

  return (
    <>
      {(!showChildrenOnly && !hasItems(step?.steps)) ?
        <Card className={classnames(styles.grid_item, { [styles.selected]: isSelected })}
          onClick={() => onSelect()}>
          <CardContent className={styles.grid_item_content}>
            <div className={styles.selected_icon_row}>
              {selector ?
                <Checkbox onChange={() => selectSection ? (!selector && isDreamInterview) || (selector && selectorDream) ? selectSection(step?.dimensionOfLife?.DimensionOfLifeID! * 4 + step?.metricOfSuccess?.MetricOfSuccessID!) : selectSection(step?.discoveryCategory?.DimensionOfLifeID) : null} />
                : isSelected ? <Icon className={styles.selected_icon}>check_circle</Icon> : null}
            </div>
            <div className={styles.grid_item_title}>
              {step.icon ? <Icon className={styles.grid_item_icon}>{step.icon}</Icon> : null}
              <b>{(!selector && isDreamInterview) || (selector && selectorDream) ? parent?.title : null}</b> {step.title}
            </div>
            {selector ? null :
              <div className={styles.grid_item_count_container}>
                {responseStats?.map((stats: any, sindex: number) => (
                  <div key={sindex} className={styles.grid_item_count}>
                    <Chip
                      className={styles.grid_item_count_item}
                      key={sindex}
                      size="small"
                      label={`${stats?.person?.FirstName}: ${stats?.responses?.length as Number + stats?.additionalPriorityCount as Number}`}
                    />
                  </div>
                ))}
              </div>}
          </CardContent>
        </Card>
        : null}
      {steps?.map((subStep: any, subIndex: number) => {
        
        return (
          <Grid key={`${index}-${subIndex}`} item xs={(!selector && isDreamInterview) || (selector && selectorDream) ? 12 : 3}>
            <Box key={subIndex} mb={1}>
              <InterviewGridStep key={subIndex}
                parent={step}
                step={subStep}
                index={subIndex}
                isNestedStep={true}
                showChildrenOnly={false}
                onSelectStep={onSelectStep}
                onSelectSubStep={onSelectSubStep}
                onSelectStepAndSubStep={onSelectStepAndSubStep}
                selector={selector}
                selectSection={selectSection}
                selectorDream={selectorDream} />
            </Box>
            {/* {
              subStep.index !== wizard?.steps?.at(-1)?.index
              ?
              <Grid item xs={12}>
                <div className={styles.separator} />
              </Grid>
              :
              null
            } */}
          </Grid>
        )
      })}
    </>

  )
}

interface IProps {
  id?: number;
  isOpen: boolean;
  onClose: () => unknown;
  onSelectStep: (idx: number) => unknown;
  onSelectSubStep: (idx: number) => unknown;
  onSelectStepAndSubStep: (step: number, subStep: number) => unknown;
  onBack: () => unknown;
  onExport?: () => unknown,
  onExportWithResponses?: (hideUnansweredQuestions?: boolean) => unknown,
  onExportExcel?: () => unknown,
  onExportWithResponsesExcel?: (hideUnansweredQuestions?: boolean) => unknown,
  onCustomExport?: (type: ReportType) => unknown,
  onToggleGridNav: (visible: boolean) => unknown;
}

const InterviewGrid = ({ 
  id,
  isOpen,
  onClose,
  onSelectStep,
  onSelectSubStep,
  onSelectStepAndSubStep,
  onBack,
  onExport,
  onExportWithResponses,
  onExportExcel,
  onExportWithResponsesExcel,
  onCustomExport,
  onToggleGridNav }: IProps) => {
  const router = useRouter();

  console.log( 'InterviewGrid ')
  
  //const { selectedInterview } = useStoreState((state) => state.interview);
  //const { wizard } = useStoreState((state) => state.wizard);
  //const { selectedHousehold } = useStoreState(state => state.household);

  //const { wizard } = useStoreState((state) => state.wizard);
  const token = getAccessToken();
  
  const { householdId } = useStoreState((state) => state.selected);

  const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;
  const {data: selectedHousehold} = useSWR<Household>([urlHousehold, token], fetcher);  

  const urlInterview =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/fullinterview/${id}`;
  const { data: selectedInterview } = useSWR<InterviewFull>([urlInterview, token], fetcher);

  const urlPersons =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;
  console.log(urlPersons);
  const { data: persons} = useSWR<Person[]>([urlPersons, token], fetcher);
  console.log(persons);

  const { data: discoverCategories } = useSWR<QuestionCategory[]>([`${process.env.NEXT_PUBLIC_API_URL}/discovercategory/list`, token], fetcher);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, token], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, token], fetcher);

  const wizard = getInterviewWizard(selectedInterview as InterviewFull, discoverCategories as QuestionCategory[], persons as Person[], metricsOfSuccess as MetricOfSuccess[], dimensionsOfLife as DimensionOfLife[])

  const [hideUnansweredQuestions, setHideUnansweredQuestions] = React.useState(false);
  const [onlyUnansweredQuestions, setOnlyUnansweredQuestions] = React.useState(false);
  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);
  const [steps, setSteps] = React.useState(Object.assign([], wizard?.steps));

  const [responsesReportType, setResponsesReportType] = React.useState<Number>(0);
  const [questionsReportType, setQuestionsReportType] = React.useState<Number>(0);
  const [reportType, setReportType] = React.useState<Number>(0);
  const [responseType, setResponseType] = React.useState<Number>(0);
  const [questionType, setQuestionType] = React.useState<Number>(0);
  const [showResourceModal, setShowResourceModal] = React.useState<boolean>(false);
  const [count, setCount] = useState<number>(0);


  const exportQuestions = () => {
    if (onCustomExport) {
      switch (questionsReportType) {
        case 0:
          onCustomExport(ReportType.DISCOVER_MAIN_QUESTIONS);
          break;
        case 1:
          onCustomExport(ReportType.DISCOVER_VMV_QUESTIONS);
          break;
        case 2:
          onCustomExport(ReportType.DISCOVER_INTERVIEW);
          break;
        case 3:
          onCustomExport(ReportType.DISCOVER_VMV_QUESTIONS_DETAILS);
          break;
      }
    }
  }

  const exportResponses = () => {
    if (onExportWithResponses) onExportWithResponses(hideUnansweredQuestions);
  }

  const dropdownResponse: string[] = isDreamInterview ?
    [
      'Review Priorities',
      'Review All Responses',
      'Review ' + selectedHousehold?.Persons?.find(person => person.PersonID == selectedHousehold.PrimaryPerson1ID)?.FullName + ' Responses',
      'Review ' + selectedHousehold?.Persons?.find(person => person.PersonID == selectedHousehold.PrimaryPerson2ID)?.FullName + ' Responses'
    ] : [
      'View All Responses',
      'Hide Unanswered Questions',
      'Only Unanswered Questions'
    ];

  const dropdownQuestion: string[] = isDreamInterview ?
    [
      'View Interview Grid – Client',
      'Export All Questions',
    ] : [
      'Interview Main Questions-Client',
      'VMV Questions- Client',
      'Interview Questions with Details– Advisor',
      'VMV Questions w/Details - Advisor'
    ];

  const dropdownReportTypes: string[] = isDreamInterview ?
    [

    ] : [
      'All Responses',
      'Grid Sections',
      'Story Reports',
    ];

  const dropdownResponseTypes: string[] = isDreamInterview ?
    [
      '',
      '',
    ] : [
      'All',
      'Answered',
      'Unanswered',
      'Starred',
      'Hidden'
    ];

  const dropdownQuestionTypes: string[] =
    [
      'Main',
      'Main and Clarifying',
    ];

  const [viewResponsesText, setViewResponsesText] = React.useState<string>(dropdownResponse[0]);
  const [viewQuestionsText, setViewQuestionsText] = React.useState<string>(dropdownQuestion[0]);

  console.log(steps);

  return (
    <>

      <Card>
        <CardContent>
          <div className={styles.headerWrapper}>
            <Grid container>
              <Grid item xs={3}>
              <div className={classnames(styles.headerImage,
                { [styles.discover]: !isDreamInterview },
                { [styles.dream]: isDreamInterview })} />
              </Grid>
              <Grid item xs={4}>
                <div className={classnames(styles.headerContent,
                { [styles.discover]: !isDreamInterview },
                { [styles.dream]: isDreamInterview })}>
                  <Grid container>
                    <Grid item xs={12}>
                      <h3 className={styles.family_header}>{selectedHousehold?.HouseholdName}</h3>
                    </Grid>
                    {/* <Grid item xs={3} className={styles.last_updated}>
                      Last updated <br />
                      {toDateTimeShort(selectedInterview?.Interview?.LastModifiedDate?.toString())}
                    </Grid> */}
                  </Grid>
                  <div className="instructions">
                    {isDreamInterview ?
                      <div>
                        <p>In thinking about the future let's explore what a well-lived life would look like for you. I would like you to think about this in the context of what you would want for yourself, your family, your business, and within your community. I am going to ask you a series of questions that will help you articulate what matters most to you.</p>
                      </div>
                      :
                      <div>
                        <p>Clariata begins with a values-based understanding of who you and your family are and what you care
                          about. You didn't just spring into existence today. You've come from somewhere, and that somewhere says a
                          lot about who you are.</p>
                        <p>Understanding where you've come from is an important step in living your life fully as you pursue what
                          matters most. It provides the historic context of what you stand for. Your life journey and that of your
                          family have helped form who you are. It gives meaning and purpose to how you make decisions.</p>
                        <p>What do you stand for? What do you believe? What of your values will others see as your legacy?</p>
                      </div>
                    }
                  </div>
                </div>
              </Grid>
              <Grid item xs={5} container direction="column">
                <div>
                <Grid item>
                  <InterviewReportFilter dreamInterview={isDreamInterview} />
                </Grid>
                <Grid item container justifyContent="flex-end">
                  {/* <Grid item xs={3}> */}
                 
                  <Tooltip title="Navigate back to navigation grid">
                    <MuiButton className={styles.wizard_header_menu_button}
                      color="secondary"
                      variant="contained"
                      startIcon={<Icon>view_module</Icon>}
                      size="large"
                      onClick={() => {
                        onToggleGridNav(false);
                      }}>
                      Go to {isDreamInterview ? 'Dream' : 'Discover'} Wizard
                    </MuiButton>
                  </Tooltip>
                  <div style={{textAlign: "right", marginLeft: "20px"}}>
                  <Link href={{
                    pathname: paths.MODULE_RESOURCES,
                    query: { module : isDreamInterview ? "Dream" : "Discover" },
                    }}
                    passHref
                  >
                    <a rel="noopener noreferrer" target="_blank">
                      <Button text="Checklist/Resources" color="primary" size="large" variant="contained" onClick={() => setShowResourceModal(true)} />
                    </a>
                    </Link>
                  </div>
                </Grid>
                </div>
                {
                  isDreamInterview
                  ?
                  <Divider style={{marginTop:"10px"}}/>
                  :
                  null
                }
              </Grid>
            </Grid>
            {isDreamInterview ?
            <Grid container spacing={1} style={{marginTop:"20px"}}>
              {wizard?.steps?.map((step: any, index: number) => {
                return (
                  <Grid key={index} item xs={3}>
                    <div className={styles.grid_header}>
                      {step?.title}
                    </div>
                  </Grid>
                )
              })}
            </Grid>
            : null}
          </div>
          <Grid container spacing={1}>
            {steps?.map((step: any, index: number) => {
              console.log("Steps :", steps)
              // setCount(prev => prev+1)
              return (
                <>
                  {isDreamInterview ? (
                    <>
                    <Grid key={index} item xs={3}>
                      <InterviewGridStep
                        key={index}
                        step={step}
                        index={index}
                        showChildrenOnly={wizard?.steps?.length === 1}
                        isNestedStep={false}
                        onSelectStep={onSelectStep}
                        onSelectSubStep={onSelectSubStep}
                        onSelectStepAndSubStep={onSelectStepAndSubStep}
                      />
                    </Grid>
                    {/* <Grid item xs={12}>
                    <div className={styles.separator} />
                    </Grid> */}
                    </>
                  ) : (
                    <>
                      <InterviewGridStep
                        key={index}
                        step={step}
                        index={index}
                        showChildrenOnly={wizard?.steps?.length === 1}
                        isNestedStep={false}
                        onSelectStep={onSelectStep}
                        onSelectSubStep={onSelectSubStep}
                        onSelectStepAndSubStep={onSelectStepAndSubStep}
                      />
                      {/* <Grid item xs={12}>
                      <div className={styles.separator} />
                      </Grid> */}
                    </>
                  )}
                  {/* {
                    steps[index].ste
                    ?
                    <Grid item xs={12}>
                      <div className={styles.separator} />
                    </Grid>
                    :
                    null
                  } */}
                </>
              );
            })}
          </Grid>
          <div className="m-t-15">
            <Button text="Back to Interview"
              size="large"
              color="primary" onClick={() => onClose()} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default InterviewGrid;

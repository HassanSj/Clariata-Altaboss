import React, { useEffect, useRef } from "react";
import { WizardState, WizardStep } from "~/types/wizard/wizard";
import { QuestionAndResponse } from "~/types/api/questionAndResponse";
import styles from "./InterviewStepQuestionUpdated.module.scss";
import classnames from "classnames";
import { useStoreActions, useStoreState } from "~/store/hooks";
import Typography from "@material-ui/core/Typography";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  Tooltip
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { hasItems, isNullOrUndefined } from "~/ui/constants/utils";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import InterviewStepQuestionResponseForm from "~/ui/components/Wizard/Interviews/InterviewStepQuestionResponseForm";
import InterviewStepQuestionResponse from "~/ui/components/Wizard/Interviews/InterviewStepQuestionResponse";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { InterviewDataType, InterviewType } from "~/ui/constants/interview";
import { computeQuestionResponseCount } from "~/services/interview";
import { AxiosResponse } from "axios";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { BooleanFilterCell } from "@progress/kendo-react-data-tools";
import Modal from "~/ui/components/Dialogs/Modal";
import UnsavedPopup from "~/ui/components/Dialogs/UnsavedPopup";
import { WizardType } from "~/ui/constants/wizard";
import { PrimaryPersonType, ReportType, ReportTypes } from "~/ui/constants/reports";

interface IProps {
  wizard: WizardState;
  step: WizardStep;
  subStep: WizardStep;
  question: QuestionAndResponse;
  index: number;
  parentIndex?: number;
  isForReport?: boolean;
  subQuestionsSelected?: boolean;
  setUnsavedProgress?: (unsaved: boolean) => any;
  unsavedProgress?: boolean;
}

export const questionWithResponse = (question: QuestionAndResponse) => {
  let valid = false;
  question?.Responses?.forEach(r => {
    if (r?.ResponseText && r?.ResponseText != "") valid = true
  });
  return valid;
}

const InterviewStepQuestion = ({ wizard, step, subStep, question, index, parentIndex, isForReport, subQuestionsSelected }: IProps) => {
  const { selectedInterview, isUnsaved } = useStoreState((state) => state.interview);
  const { selectedHousehold } = useStoreState((state) => state.household);
  const { onSetIsSaved } = useStoreActions(actions => actions.interview);
  const { activeQuestionIndex, activeParentQuestionIndex, showStarredQuestionsOnly } = useStoreState((state) => state.wizard);
  const { onSelectQuestion, onAddResponse, toggleExpanded ,setSingleExpanded} = useStoreActions(actions => actions.wizard);
  const SSS = useStoreState(state => state.wizard);
  // const [expandToggle, setExpandToggle] = React.useState<boolean | undefined>(SSS.wizard.toggleExpanded)
  console.log('expandToggle=>', SSS.wizard.singleExpanded, SSS.wizard.toggleExpanded)
  console.log('isExpanded=>', activeParentQuestionIndex, activeQuestionIndex, parentIndex, index)

  const isExpanded = (SSS.wizard.singleExpanded) ? isNullOrUndefined(activeParentQuestionIndex)
    ? (activeQuestionIndex === index && isNullOrUndefined(parentIndex))
    : (activeQuestionIndex === index && activeParentQuestionIndex === parentIndex) : SSS.wizard.toggleExpanded;

  const [expanded, setExpanded] = React.useState(isExpanded ? isExpanded : false);
  const [subQuestionsVisible, setSubQuestionsVisible] = React.useState(isExpanded);
  const [showEdit, setShowEdit] = React.useState(false);
  const isDiscoverInterview = (selectedInterview?.Interview?.InterviewTemplateID === InterviewType.DISCOVER);
  const [responseCount, setResponseCount] = React.useState(computeQuestionResponseCount(question));
  const [subQuestionCount, setSubQuestionCount] = React.useState(0);

  const [showConfirmUnsaved, setShowConfirmUnsaved] = React.useState<boolean>(false);
  const [lastClick, setLastClick] = React.useState<number>(0);

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);

  useEffect(() => {
    if (typeof subQuestionsSelected !== 'undefined') {
      setChecked(subQuestionsSelected);
    }
  }, [subQuestionsSelected]);

  useEffect(() => {
    setSubQuestionsVisible(wizard?.toggleExpanded)
  },[wizard?.toggleExpanded])

  // Handle add a new response
  const handleAddResponse = async () => {
    let PersonID = undefined;
    if (wizard?.filtered && wizard.selectedReport === ReportType.PERSONAL_STORY) PersonID = selectedHousehold?.PrimaryPerson1ID;
    if (wizard?.filtered && wizard.selectedReport === ReportType.PERSONAL_STORY_2) PersonID = selectedHousehold?.PrimaryPerson2ID;
    await onAddResponse({
      interviewId: selectedInterview?.Interview?.InterviewID,
      questionId: question?.Question?.QuestionID,
      question,
      parentIndex,
      questionIndex: index,
      responseIndex: question?.Responses ? (question?.Responses?.length + 1) : 0,
      appliesTo: PersonID,
    });
    await onSetIsSaved({
      type: InterviewDataType.FORM,
      saved: true
    })
  }

  const handleConfirm = async () => {

    if (lastClick !== 0) {
      if (lastClick === 1) {
        await handleAddResponse();
        setLastClick(0);
      }
      if (lastClick === 2) {
        await onExpand();
        setLastClick(0);
      }
    }
  }


  // Handle expand event
  const onExpand = async () => {
    // Set as selected question if it's not already expanded

    if (!expanded) {
      await onSelectQuestion({
        index,
        parentIndex,
        question
      });
    }
    setSingleExpanded("single")
    setExpanded(!expanded);
  }

  const computeSubQuestionCount = () => {
    if (showStarredQuestionsOnly) {
      const starred = question?.SubQuestions?.filter(q => q?.Question?.Starred);
      setSubQuestionCount(starred ? starred?.length : 0);
    } else {
      setSubQuestionCount(question?.SubQuestions ? question?.SubQuestions?.length : 0);
    }
  }

  // report changes for printing
  const [checked, setChecked] = React.useState(false);
  const handleCheck = () => {
    setChecked(!checked);
  }

  // Scroll to question if it's selected
  const questionRef = useRef(null);
  useMountEvents({
    onMounted: async () => {
      computeSubQuestionCount();
    },
    onChange: async () => {
      setResponseCount(computeQuestionResponseCount(question));
      computeSubQuestionCount();
    },
    watchItems: [question, activeQuestionIndex, activeParentQuestionIndex]
  });

  question.Responses?.sort((first, second) => {
    if (!first?.InterviewResponseID)
      return 1
    else if (!second?.InterviewResponseID)
      return -1
    else
      return (first?.InterviewResponseID!) < (second?.InterviewResponseID!) ? -1 : 1
  })

  return (
    <>
      {/* {(wizard?.filtered && !questionWithResponse(question))  */}
      {wizard?.filtered
        && ((!isDreamInterview && wizard.selectedReport && ReportTypes[wizard.selectedReport!].questionIds!?.indexOf(question?.Question?.QuestionID!) >= 0) || !wizard?.selectedReport)
        || !wizard?.filtered ?
        <>
          <Accordion className={styles.question_container} ref={questionRef} expanded={SSS.wizard.singleExpanded =="all" ? SSS.wizard.toggleExpanded: expanded  }>
            <AccordionSummary
              onClick={() => {
                if (!isUnsaved) onExpand().then();
                else {
                  setLastClick(2);
                  setShowConfirmUnsaved(isUnsaved);
                }
              }}
              className={classnames(styles.question_header, { [styles.child_question_header]: !isNullOrUndefined(parentIndex), [styles.parent_question_header]: hasItems(question.SubQuestions) })}
              expandIcon={<>{expanded ? <Icon>minimize</Icon> : <Icon>expand_more</Icon>}</>}
              aria-controls="panel1a-content"
              id="panel1a-header">
              {
                isForReport ?
                  <Checkbox
                    checked={checked}
                    onClick={(event) => event.stopPropagation()}
                    onChange={handleCheck}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  /> : null
              }
              <div className={styles.header_question}>
                <Typography className={styles.question_text}>{question?.Question?.QuestionText}</Typography>
              </div>
              <div className={styles.header_action}>
                {(responseCount > 0) ?
                  <Chip className={styles.header_action_chip} label={`${responseCount} ${responseCount === 1 ? 'response' : 'responses'}`}
                    color="default" />
                  :
                  <Chip className={styles.header_action_chip} label={`${responseCount} ${responseCount === 1 ? 'response' : 'responses'}`}
                    color="secondary" />
                }
              </div>
            </AccordionSummary>
            <AccordionDetails className={styles.responses_details}>
              <div className={styles.responses_wrapper}>
                <div className={styles.responses_container}>
                  <Grid container spacing={1}>
                    {isForReport ? <Grid item xs={1}><div className={styles.text_header}>Select</div></Grid> : null}
                    {/* <Grid item xs={2}>
                      <div className={styles.text_header}>Client</div>
                    </Grid> */}
                    {isDiscoverInterview ?
                    <Grid item xs={isDiscoverInterview ? (question.Question.QuestionID === 321 ? 5 : 7) : 5}>                      
                        <div className={styles.text_header}>{question.Question.QuestionID === 321 ? `Description` : `Response`}</div>
                    </Grid> : null }
                    {question.Question.QuestionID === 321 ?
                      <Grid item xs={4}>
                        <div className={styles.text_header}>Response</div>
                      </Grid>
                      : null}
                    {/* {!isDiscoverInterview ?
                      <Grid item xs={4}>
                        <div className={styles.text_header}>Why is it important?</div>
                      </Grid>
                      : null} */}
                    {!isForReport && isDiscoverInterview && question.Question.QuestionID !== 321 &&
                      <Grid item xs={2}>
                        <div className={styles.text_header}>Actions</div>
                      </Grid>
                    }
                  </Grid>
                  {question?.Responses && question?.Responses?.filter(r => wizard.selectedReport && ReportTypes[wizard.selectedReport].person ? (r?.AppliesTo == 0 || (ReportTypes[wizard.selectedReport!].person === PrimaryPersonType.Primary1 ? r?.AppliesTo == selectedHousehold?.PrimaryPerson1ID : (ReportTypes[wizard.selectedReport!].person === PrimaryPersonType.Primary2 ? r?.AppliesTo == selectedHousehold?.PrimaryPerson2ID : false))) : true).map((response, responseIndex) => {
                    return (
                      <InterviewStepQuestionResponse key={responseIndex}
                        wizard={wizard}
                        step={step}
                        subStep={subStep}
                        question={question}
                        questionIndex={index}
                        response={response}
                        responseIndex={responseIndex}
                        parentQuestionIndex={parentIndex}
                        isDiscoverInterview={isDiscoverInterview}
                        allSelected={checked}
                        isForReport={isForReport} />
                    )
                  })}
                  {(!question?.Responses || question?.Responses?.length === 0) ?
                    <EmptyContainer text="No responses found." />
                    : null}
                </div>
              </div>
            </AccordionDetails>
            {!isForReport ?
              <AccordionActions>
                <Button className={styles.question_header_action}
                  color="default"
                  variant="outlined"
                  startIcon={<Icon>add</Icon>}
                  onClick={() => {
                    if (!isUnsaved) handleAddResponse().then();
                    else {
                      setLastClick(1);
                      setShowConfirmUnsaved(isUnsaved);
                    }
                  }}>
                  Add Response
                </Button>
              </AccordionActions> : null}
          </Accordion>
          <InterviewStepQuestionResponseForm wizard={wizard}
            step={step}
            subStep={subStep}
            question={question}
            questionIndex={index}
            parentQuestionIndex={parentIndex}
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            isDiscoverInterview={isDiscoverInterview} />

          {wizard?.hideClarifying ? null :
            <>
              {hasItems(question?.SubQuestions) && subQuestionsVisible ?
                <div className={styles.subquestions_container}>
                  {question?.SubQuestions?.map((childQuestion: QuestionAndResponse, cindex: number) => {
                    return (
                      <>
                        {(!showStarredQuestionsOnly || (showStarredQuestionsOnly && Boolean(childQuestion?.Question?.Starred))) ?
                          <InterviewStepQuestion key={question?.Question?.QuestionID}
                            index={cindex}
                            wizard={wizard}
                            step={step}
                            subStep={subStep}
                            question={childQuestion}
                            parentIndex={index}
                            isForReport={isForReport}
                            subQuestionsSelected={checked} />
                          : null}
                      </>
                    )
                  })}
                </div>
                : null
              }
              {(subQuestionCount > 0) ?
                <div className={styles.subquestions_toggle}>
                  <Button
                    type="button"
                    color={subQuestionsVisible ? 'default' : 'default'}
                    variant="outlined"
                    onClick={() => setSubQuestionsVisible(!subQuestionsVisible)}>
                    {subQuestionsVisible ? 'Hide' : 'Show'} {subQuestionCount} clarifying questions
                  </Button>
                </div>
                : null}
            </>}
          <UnsavedPopup isOpen={showConfirmUnsaved}
            onCancel={() => setShowConfirmUnsaved(false)}
            onConfirm={async () => {
              setShowConfirmUnsaved(false);
              await handleConfirm();
              await onSetIsSaved({
                type: InterviewDataType.FORM,
                saved: false
              })
            }} />
        </> : null}
    </>
  );
}

export default InterviewStepQuestion;
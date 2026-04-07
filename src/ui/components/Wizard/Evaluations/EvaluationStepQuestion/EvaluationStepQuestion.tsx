import React from "react";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import styles from "./EvaluationStepQuestion.module.scss";
import {useStoreActions, useStoreState} from "~/store/hooks";
import Typography from "@material-ui/core/Typography";
import {Accordion, AccordionDetails, AccordionSummary, Grid, Icon,} from "@material-ui/core";
import {debounce, get} from 'lodash';
import useNotifications from "~/ui/hooks/useNotifications";
import {IFormInputProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";

interface IProps {
  wizard: WizardState;
  step: WizardStep;
  subStep: WizardStep;
  question: QuestionAndResponse;
  index: number;
}

const EvaluationStepQuestion = ({ wizard, step, subStep, question, index }: IProps) => {
  const notifications = useNotifications();
  const { selectedEvaluation } = useStoreState((state) => state.evaluation);
  const { onSubmitResponse } = useStoreActions(actions => actions.evaluation);

  const handleSubmitResponse = async (value: any) => {
    await onSubmitResponse({
      evaluationId: selectedEvaluation?.ClientEvaluationID,
      field: question?.Question?.InputName,
      value
    });
    notifications.addSuccessNotification("Evaluation successfully updated!")
  }

  const handleDebounceResponse = debounce((value: any) => {
    handleSubmitResponse(value);
  }, 4000);

  const fieldProps: IFormInputProps = {
    name: question.Question.InputName,
    type: question.Question.InputType,
    defaultValue: get(selectedEvaluation, 'question.Question.InputName'),
    onChange: (event?: any) => handleDebounceResponse(event?.target?.value),
    onBlur: () => {
      // TODO
    },
    onKeyPress: () => {
      // TODO
    },
  };

  return (
    <>
      <Accordion className={styles.question_container} expanded={true}>
        <AccordionSummary
          className={styles.question_header}
          expandIcon={
            <>
              <Icon>expand_more</Icon>
            </>
          }
          aria-controls="panel1a-content"
          id="panel1a-header">
          <div className={styles.header_question}>
            <Typography className={styles.question_text}>{question?.Question?.QuestionText}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={styles.responses_details}>
          <div className={styles.responses_wrapper}>
            <div className={styles.responses_container}>
              <Grid container spacing={1}>
                <InputField {...fieldProps}
                       type={question.Question.InputType}
                       placeholder="Enter answer here..."
                       items={question.Question.InputOptions}
                       labelField="label"
                       valueField="value" />
              </Grid>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

    </>
  );
}

export default EvaluationStepQuestion;

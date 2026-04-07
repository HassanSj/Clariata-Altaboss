import React, {ReactElement, useState} from 'react';
import initialValues from './form/initialValues';
import validate from './form/validate';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import api from "~/services/api";
import {extractServerError} from "~/services/api/errors";
import {DialogActions, Grid} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {createEditHeaderSubmitText, createEditHeaderText, createEditMessageText} from "~/ui/constants/utils";
import {IFormActionProps} from "~/types/forms";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {InterviewResponse} from "~/types/api/interviewResponse";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {BOTH_PERSONS_OPTION} from "~/services/interview";

interface IProps {
  wizard: WizardState;
  step: WizardStep;
  subStep: WizardStep;
  question: QuestionAndResponse;
  questionIndex: number;
  response?: InterviewResponse;
  responseIndex?: number;
  parentIndex?: number;
  parentQuestionIndex?: number;
  isOpen: boolean;
  onClose: () => unknown;
  isDiscoverInterview: boolean;
}

const InterviewStepQuestionResponseForm = ({ wizard, step, question, questionIndex, response, responseIndex, parentQuestionIndex, isOpen, onClose, isDiscoverInterview }: IProps): ReactElement => {
  const notifications = useNotifications();
  const { selectedHousehold } = useStoreState((state) => state.household);
  const { selectedInterview } = useStoreState((state) => state.interview);
  const { onSubmitResponse } = useStoreActions(actions => actions.interview);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Set household being edited if ID is specified
  const isEdit = Boolean(response?.InterviewResponseID);
  const selected = isEdit ? response : initialValues;
  const persons = selectedHousehold?.Persons;

  // Create household action
  const createOrUpdate = async (values: InterviewResponse, { setErrors }: IFormActionProps) => {
    notifications.toggleLoading(true);
    try {
      const res = await (response?.InterviewResponseID ?
        api.interviewresponse.update(
          selectedInterview?.Interview?.HouseholdID,
          selectedInterview?.Interview?.InterviewID,
          response?.InterviewResponseID,
          values) :
        api.interviewresponse.create(
          selectedInterview?.Interview?.HouseholdID,
          selectedInterview?.Interview?.InterviewID,
          question?.Question?.QuestionID,
          values));
      await onSubmitResponse({
        householdId: selectedInterview?.Interview?.HouseholdID,
        interviewId: selectedInterview?.Interview?.InterviewID,
        questionId: question?.Question?.QuestionID,
        question,
        questionIndex,
        response: res?.data,
        responseIndex,
        parentIndex: parentQuestionIndex,
      });
      setErrors({ successMessage: `Response successfully ${createEditMessageText(response?.InterviewResponseID)}!`});
      onClose();
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
    notifications.toggleLoading(false);
  };

  // Delete
  const remove = async() => {
    if (!response?.InterviewResponseID){
      return;
    }
    notifications.toggleLoading(true);
    const res = await api.interviewresponse.remove(
      selectedInterview?.Interview?.HouseholdID,
      selectedInterview?.Interview?.InterviewID,
      response?.InterviewResponseID,
      response);
    // TODO - handle removal
    // onSelect(null);
    onClose();
    notifications.toggleLoading(false);
  }

  return (
    <>
      <Modal title={`${createEditHeaderText(response?.InterviewResponseID)} Response`} isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
        <FormWrapper initialValues={isEdit ? response : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
          <div>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputField type="select"
                            name="AppliesTo"
                            component={Input}
                            items={selectedHousehold?.Persons ? [...selectedHousehold?.Persons, BOTH_PERSONS_OPTION] : []}
                            label="Client"
                            labelField="FullName"
                            valueField="PersonID"
                            value={response?.AppliesTo}
                            orientation="horizontal" />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={isDiscoverInterview ? 12 : 6}>
                <InputField type="textarea"
                            name="ResponseText"
                            component={Input}
                            label="Response"
                            placeholder="Placeholder" />
              </Grid>
              { !isDiscoverInterview ?
                <Grid item xs={6}>
                  <InputField type="textarea"
                              name="WhyIsThisImportant"
                              component={Input}
                              label="Why is this important?"
                              placeholder="Why is this important?" />
                </Grid>
              : null }
            </Grid>
          </div>
          <DialogActions>
            <Button
              type="submit"
              text={`${createEditHeaderSubmitText(response?.InterviewResponseID)} Response`}
              variant="contained"
              size="large"
              color="primary"
            />
            { isEdit ?
              <Button
                type="button"
                text={`Delete`}
                variant="contained"
                size="large"
                color="default"
                onClick={() => setShowDeleteConfirmation(true)}
              />
              : null }
            <ConfirmationModal isOpen={showDeleteConfirmation}
                               onConfirm={remove}
                               onCancel={() => setShowDeleteConfirmation(false)} />
          </DialogActions>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default InterviewStepQuestionResponseForm;

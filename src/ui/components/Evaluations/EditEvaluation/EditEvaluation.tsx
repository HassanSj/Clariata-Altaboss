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
import {DialogActions} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {createEditHeaderSubmitText, createEditHeaderText} from "~/ui/constants/utils";
import {IFormActionProps} from "~/types/forms";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

const { EVALUATION } = paths;

interface IProps {
  evaluation?: ClientEvaluation;
  isOpen: boolean;
  onClose: () => unknown;
}

const EditEvaluation = ({ evaluation, isOpen, onClose }: IProps): ReactElement => {
  const router = useRouter();
  const { selectedEvaluation, evaluations } = useStoreState((state) => state.evaluation);
  const { onPopulate, onSelect, onRemove } = useStoreActions(actions => actions.evaluation);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Set household being edited if ID is specified
  const isEdit = Boolean(evaluation?.ClientEvaluationID);
  const selected = evaluation?.ClientEvaluationID ? evaluation : initialValues;

  // Create household action
  const createOrUpdate = async (values: ClientEvaluation, { setErrors }: IFormActionProps) => {
    try {
      const res = await (evaluation?.ClientEvaluationID ? api.evaluation.update(evaluation?.ClientEvaluationID, values) : api.evaluation.create(values));
      setErrors({ successMessage: 'Evaluation successfully created!'});
      onPopulate(null);
      onSelect(res.data);
      onClose();
      router.push(`${EVALUATION}/${evaluation?.ClientEvaluationID}`);
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
  };

  // Delete
  const remove = async() => {
    if (!evaluation?.ClientEvaluationID){
      return;
    }
    onRemove({
      evaluationID: evaluation?.ClientEvaluationID,
      evaluation
    });
    onSelect({
      evaluation: null
    });
    onClose();
  }

  return (
    <>
      <Modal title={`${createEditHeaderText(evaluation?.ClientEvaluationID)} Evaluation`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
        <FormWrapper initialValues={selected} validationSchema={validate} onSubmit={createOrUpdate}>
          <div>
            <InputField type="text" name="Description" component={Input} placeholder="Evaluation Name" label="Evaluation Name" required={true} />
          </div>
          <DialogActions>
            <Button
              type="submit"
              text={`${createEditHeaderSubmitText(evaluation?.ClientEvaluationID)} Evaluation`}
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

export default EditEvaluation;

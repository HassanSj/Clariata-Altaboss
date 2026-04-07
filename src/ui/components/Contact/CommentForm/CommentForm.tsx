import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import {createEditMessageText, isNullOrUndefined} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";

import initialValues from './form/initialValues';
import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {ButtonGroup, Grid} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {Comment as CommentItem} from "~/types/api/comment";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {OwnerParams} from "~/types/relations";
import styles from "./CommentForm.module.scss";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps {
  parent?: CommentItem;
  item?: CommentItem;
  ownerType: OwnerType;
  actionText?: string;
  onUpdate?: any;
  onCancel?: any;
}

const CommentForm = ({ parent, item, ownerType, actionText = 'Submit', onUpdate, onCancel }: IProps): ReactElement => {
  const { user } = useStoreState(state => state.user);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { selectedPerson } = useStoreState(state => state.person);
  const { onSelect } = useStoreActions(actions => actions.person);
  const { selectedActionItem, selectedObjective } = useStoreState(state => state.objective);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { contactId } = useStoreState(state => state.selected);

  const isEdit = Boolean(item) && Boolean(item?.CommentID);
  const params: OwnerParams = {
    ownerType,
    requestType: ApiRequestType.CREATE_UPDATE,
    modelId: item?.CommentID,
    modelName: OwnerModelType.COMMENT,
    userId: user?.UserID,
    personId: contactId,
    householdId: selectedHousehold?.HouseholdID,
    objectiveId: (ownerType === OwnerType.OBJECTIVE) ?
        selectedObjective?.ObjectiveID : selectedActionItem?.ObjectiveID,
    actionItemId: selectedActionItem?.ActionItemID,
    commentSetId: (isNullOrUndefined(parent) ? 0 : parent?.ChildCommentSetID)
  };

  const createOrUpdate = async (values: CommentItem, { setErrors, resetForm }: IFormActionProps) => {
    try {
      params.ownerType = OwnerType.PERSON
      await api.comment.createOrUpdate(params, values);
      setErrors({ successMessage: `Comment successfully ${createEditMessageText(item)}!`});
      onSelect({ person: selectedPerson });
      resetForm();
      if (onUpdate) onUpdate();
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
  };

  const remove = async () => {
    if (!item) return;
    try {
      params.requestType = ApiRequestType.REMOVE;
      await api.comment.remove(params, item);
      onSelect({ person: selectedPerson });
      if (onUpdate) onUpdate();
    } catch (err) {
      processServerError(err, 'CommentForm.remove');
    }
  };

  return (
    <>
      <FormWrapper initialValues={item ? item : initialValues}
                   validationSchema={validate}
                   onSubmit={createOrUpdate}>
        <Grid container spacing={1}>
          <Grid item xs={isEdit && !onCancel ? 8 : 10}>
            <InputField type="text"
                        name="Comment"
                        margin="dense"
                        component={Input}
                        rows={1}
                        size="small"
                        classes={{ 'input_sm': true }}/>
          </Grid>
          <Grid item xs={isEdit && !onCancel ? 4 : 2} className={styles.send_button}>
            <ButtonGroup aria-label="button group" fullWidth={true} orientation={"vertical"}>
              <Button
                  fullWidth={true}
                  type="submit"
                  text={actionText}
                  variant="contained"
                  color="primary"
              />
                { onCancel ?
                  <Button
                    fullWidth={true}
                    type="button"
                    text="Cancel"
                    variant="contained"
                    color="default"
                    onClick={onCancel}
                  />
                : null}

              { isEdit ?
                  <Button
                      type="button"
                      text={`Delete`}
                      variant="contained"
                      size="small"
                      color="default"
                      onClick={() => setShowDeleteConfirmation(true)}
                  />
                  : null }
            </ButtonGroup>
            <ConfirmationModal isOpen={showDeleteConfirmation}
                               onConfirm={remove}
                               onCancel={() => setShowDeleteConfirmation(false)} />
          </Grid>
        </Grid>
      </FormWrapper>
    </>
  );
};

export default CommentForm;

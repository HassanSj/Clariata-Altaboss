import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText, createEditMessageText} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import initialValues from './form/initialValues';
import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {DialogActions, Grid} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import useNotifications from "~/ui/hooks/useNotifications";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import {ActionItem} from "~/types/api/actionItem";
import {ActionItemStakeholder} from "~/types/api/actionItemStakeholder";
import {IObjectiveDataType} from "~/types/objective/store";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps {
  actionItem: ActionItem;
  item?: ActionItemStakeholder;
  isOpen: boolean;
  onClose: () => unknown;
}

const EditActionItemStakeholder = ({ actionItem, item, isOpen, onClose }: IProps): ReactElement => {
  const notifications = useNotifications();

  const { persons } = useStoreState(state => state.person);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { objectives } = useStoreState(state => state.objective);
  const { onSelect, onReplace } = useStoreActions(actions => actions.objective);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const isEdit = Boolean(item) && Boolean(item?.ActionItemStakeholderID);

  const createOrUpdate = async (values: ActionItemStakeholder, { setErrors }: IFormActionProps) => {
    notifications.toggleLoading(true);
    try {
      const { HouseholdID } = selectedHousehold;
      values.ActionItemID = actionItem?.ActionItemID!;
      // @ts-ignore
      const res = await (!isEdit ? api.actionitemstakeholder.create(HouseholdID, actionItem?.ObjectiveID, actionItem?.ActionItemID, values) : api.actionitemstakeholder.update(HouseholdID, actionItem?.ObjectiveID, actionItem?.ActionItemID, item?.ActionItemStakeholderID, values));
      if (!actionItem?.Stakeholders) actionItem.Stakeholders = [];
      actionItem.Stakeholders.push(res.data);
      const payload = {
        type: IObjectiveDataType.ACTION_ITEM,
        actionItem: res?.data,
        actionItemId: res?.data?.ActionItemID
      };
      onReplace(payload);
      onSelect(payload);
      setErrors({ successMessage: `Stakeholder successfully ${createEditMessageText(item)}!`});
      onClose();
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
    notifications.toggleLoading(false);
  };

  const remove = async () => {
    if (!item) return;
    notifications.toggleLoading(true);
    try {
      const { HouseholdID } = selectedHousehold;
      const res = await api.actionitemstakeholder.remove(HouseholdID, actionItem?.ObjectiveID, actionItem?.ActionItemID!, item?.ActionItemStakeholderID, item);
      onClose();
    } catch (err) {
      processServerError(err, 'EditActionItemStakeholder.remove');
    }
    notifications.toggleLoading(false);
  };

  return (
    <>
      <Modal title={`${createEditHeaderText(item)} Stakeholder`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
        <FormWrapper initialValues={isEdit ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <InputField type="autocomplete"
                          name="PersonID"
                          component={SelectAutocomplete}
                          templateComponent={SelectAvatarTemplate}
                          isMultiselect={false}
                          placeholder="Person"
                          label="Person"
                          items={persons}
                          labelField="FullName"
                          valueField="PersonID" />
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              type="submit"
              text={`${createEditHeaderSubmitText(item)} Stakeholder`}
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

export default EditActionItemStakeholder;

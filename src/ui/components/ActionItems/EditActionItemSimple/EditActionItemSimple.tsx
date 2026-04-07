import React, {ReactElement, useState} from 'react';
import initialValues from './form/initialValues';
import validate from './form/validate';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {ButtonGroup, Grid} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {IFormActionProps} from "~/types/forms";
import {ActionItem} from "~/types/api/actionItem";
import {IObjectiveDataType} from "~/types/objective/store";
import Button from '../../Button';
import styles from './EditActionItemSimple.module.scss';
import {Objective} from "~/types/api/objective";
import SelectDate from "~/ui/components/Forms/SelectDate";
import {actionItemStatuses} from "~/ui/constants/tasks";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import RecurringActionItemDeleteConfirmationModal
  from "~/ui/components/Dialogs/RecurringActionItemDeleteConfirmationModal";
import {getAllItems} from "~/ui/components/Modules/Direction/ActionItemRecurringModal/ActionItemRecurringModal";
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
  objective?: Objective;
  parent?: ActionItem;
  item?: ActionItem;
  onClose?: ()=>unknown;
  onDelete?: ()=>unknown;
}

/**
 * Alter some values before sending to the API
 * @param item
 */
export const prepareActionItemForCreateUpdate = (item: ActionItem): ActionItem => {
  if(item.StartDate == null) item.StartDate = undefined;
  return item
}

const EditActionItemSimple = ({objective, parent, item, onClose, onDelete}: IProps): ReactElement => {
  const notifications = useNotifications()
  // Store
  const {selectedHousehold} = useStoreState((state) => state.household);
  const {selectedObjective, objectives} = useStoreState((state) => state.objective);
  const {onSelect, onRemove, onRefresh} = useStoreActions(actions => actions.objective);
  const {dreamInterviewId} = useStoreState((state) => state.interview);

  // Local state
  const isEdit = Boolean(item?.ActionItemID);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMultipleDeleteConfirmation, setShowMultipleDeleteConfirmation] = useState(false);

  const defaultInitialValues = {
    ...initialValues,
    ParentActionItemID: parent?.ActionItemID,
    ObjectiveID: objective?.ObjectiveID ? objective?.ObjectiveID : parent?.ObjectiveID
  }

  // Set household being edited if ID is specified
  const [selected, setSelected] = useState<any>(item?.ActionItemID ? item : defaultInitialValues);

  // Create or update
  const createOrUpdate = async (values: ActionItem, {setErrors, resetForm}: IFormActionProps) => {
    try {
      const householdId = selectedHousehold?.HouseholdID;
      if(objective) {
        // Map selected objective
        values.ObjectiveID = objective.ObjectiveID
      }else{
        values.ObjectiveID = selectedObjective?.ObjectiveID;
      }

      values = prepareActionItemForCreateUpdate(values)

      // Create
      const res = await (item?.ActionItemID ?
        api.actionitem.update(householdId, values.ObjectiveID, item?.ActionItemID, values) :
        api.actionitem.create(householdId, values.ObjectiveID, values));
      setErrors({successMessage: 'Task successfully created!'});

      // Update store
      const updated = await api.actionitem.getFull(householdId, values.ObjectiveID, dreamInterviewId, res?.data?.ActionItemID!);
      const updatedParent = (res?.data?.ParentActionItemID)
        ? await api.actionitem.getFull(householdId, values.ObjectiveID, dreamInterviewId, res?.data?.ParentActionItemID)
        : undefined
      const payload = {
        type: IObjectiveDataType.ACTION_ITEM,
        actionItem: {
          ...updated,
          ParentActionItem: updatedParent
        },
        actionItemId: updated?.ActionItemID,
        objectiveId: updated?.ObjectiveID
      };
      const refreshed = await onRefresh(payload);

      // Set as selected
      await onSelect({
        ...payload,
        actionItem: refreshed
      });
    } catch (err) {
      setErrors({backError: extractServerError(err)});
      processServerError(err, 'EditActionItemSimple.createOrUpdate');
    }

    resetForm()
    if(onClose)
      onClose()
  };

  const getAllActionItems = (objectiveID: number): ActionItem[] => {
    const obj = objectives.find(o => o.ObjectiveID === objectiveID)

    return obj?.ActionItemList ?? []
  }

  const deleteOneItem = async (itm: ActionItem) => {
    await onRemove({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItemId: itm?.ActionItemID,
      actionItem: itm
    });
  }

  const deleteItem = async () => {
    if(item) {
      notifications.toggleLoading(true)
      await deleteOneItem(item)

      if (onClose) onClose()
      if (onDelete) onDelete()
      notifications.toggleLoading(false)
    }
  }

  const deleteAllItems = async () => {
    if(item) {
      notifications.toggleLoading(true)
      const {parentItem, children} = getAllItems(item, getAllActionItems(item.ObjectiveID))

      await deleteOneItem(parentItem)
      await Promise.all(children.map(async itm => await deleteOneItem(itm)))

      if (onClose) onClose()
      if (onDelete) onDelete()
      notifications.toggleLoading(false)
    }
  }

  const showDeleteModal = () => {
    if(item) {
      const {children} = getAllItems(item, getAllActionItems(item.ObjectiveID))

      if (children.length > 0) {
        setShowMultipleDeleteConfirmation(true)
      } else {
        setShowDeleteConfirmation(true)
      }
    }
  }

  /**
   * Make sure action item start date is after priority start date
   * @param value
   */
  const validateStartDate = (value: Date) => {
    // console.log(value)
    if(value) {
      // @ts-ignore
      const objectiveStartDate = new Date((objective ?? selectedObjective).StartDate)
      if (value < objectiveStartDate) {
        return "Start Date should be after priority start date"
      }
    }
  }

  return (
    <>
    <div className={styles.wrapper}>
      <div className={styles.header}>Add an Action Step</div>
      <FormWrapper initialValues={selected}
                   validationSchema={validate}
                   onSubmit={createOrUpdate}>
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputField type="text"
                            name="Description"
                            required={true}
                            component={Input}
                            placeholder="Description" />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputField type="month_year"
                            name="StartDate"
                            component={SelectDate}
                            validate={validateStartDate}
                            shouldUseState={false}
                            placeholder="Start Date" />
              </Grid>
              <Grid item xs={3}>
                <InputField type="select"
                            name="ActionItemStatusID"
                            component={Input}
                            label="Status"
                            items={actionItemStatuses.map(status => ({label: status.Description, value: status.ActionItemStatusID}))}
                            placeholder="Status" />
              </Grid>
              <Grid item xs={3}>
                <InputField type="select"
                            name="AssistanceNeeded"
                            component={Input}
                            label="Assistance Needed"
                            emptyOptionValue={0}
                            items={[
                              {label: '', value: 0 },
                              {label: 'Assisted', value: 1 },
                              {label: 'DIY', value: 2 }
                            ]}
                            placeholder="Assistance Needed" />
              </Grid>
            </Grid>
          </div>
          <div className={styles.actions}>
            <ButtonGroup orientation="vertical">
              <Button
                  className={styles.action}
                  type="submit"
                  text={isEdit ? "Save Action Step" : `Add Action Step`}
                  variant="contained"
                  size="large"
                  color="primary"
              />
              <Button
                  className={styles.action}
                  type="reset"
                  onClick={() => {
                    if(onClose)
                      onClose()
                  }}
                  text={"Cancel"}
                  variant="contained"
                  size="large"
                  color="default"
              />
            </ButtonGroup>
            { isEdit ?
                <div className={"m-t-10 center"}>
                  <Button
                    type="button"
                    text={`Delete`}
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={showDeleteModal}
                  />
                </div>
              : null }
          </div>
        </div>
      </FormWrapper>
      <ConfirmationModal isOpen={showDeleteConfirmation}
                         onConfirm={deleteItem}
                         onCancel={() => setShowDeleteConfirmation(false)} />
      <RecurringActionItemDeleteConfirmationModal
          onCancel={() => setShowMultipleDeleteConfirmation(false)}
          onConfirmOne={deleteItem}
          onConfirmAll={deleteAllItems}
          isOpen={showMultipleDeleteConfirmation}/>
    </div>
    </>
  );
};

export default EditActionItemSimple;

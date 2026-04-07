import React, {ReactElement, useState} from 'react';
import styles from './DirectionStrategyActionItem.module.scss';
import classnames from 'classnames';
import {Box, Divider, Grid, Icon, Menu, MenuItem} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {Person} from "~/types/api/person";
import {ActionItem, ActionItem as ActionItemModel} from "~/types/api/actionItem";
import {Objective} from "~/types/api/objective";
import {hasItems, isNullOrUndefined, isValidDate} from "~/ui/constants/utils";
import IconButton from "@material-ui/core/IconButton";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {IObjectiveDataType} from "~/types/objective/store";
import api from "~/services/api";
import {ActionItemStakeholder} from "~/types/api/actionItemStakeholder";
import EditActionItemStakeholder from "~/ui/components/ActionItems/EditActionItemStakeholder";
import Button from "~/ui/components/Button";
import {IFormInputValue} from "~/types/forms";
import {processServerError} from "~/services/api/errors";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {createOrUpdateDirect} from "~/ui/components/ActionItems/EditActionItem/EditActionItem";

import DescriptionTemplate from "~/ui/components/ActionItems/CellTemplates/DescriptionTemplate";
import LeadPersonTemplate from "~/ui/components/ActionItems/CellTemplates/LeadPersonTemplate";
import StatusTemplate from "~/ui/components/ActionItems/CellTemplates/StatusTemplate";
import ActionItemList from "~/ui/components/ActionItems/ActionItemList";
import SchedulingTemplate from "~/ui/components/ActionItems/CellTemplates/SchedulingTemplate";
import SchedulingRecurrenceTemplate from "~/ui/components/ActionItems/CellTemplates/SchedulingRecurrenceTemplate";
import AssistanceNeededTemplate from "~/ui/components/ActionItems/CellTemplates/AssistanceNeededTemplate";
import ActionItemRecurringModal from "~/ui/components/Modules/Direction/ActionItemRecurringModal";
import {getAllItems} from "~/ui/components/Modules/Direction/ActionItemRecurringModal/ActionItemRecurringModal";
import RecurringActionItemDeleteConfirmationModal
  from "~/ui/components/Dialogs/RecurringActionItemDeleteConfirmationModal";

interface IProps {
  item: ActionItemModel;
  index?: number;
  onChange?: any;
  objectiveProp?:Objective
}

const DirectionStrategyActionItem = ({ item, index, onChange, objectiveProp }: IProps): ReactElement => {
  const notifications = useNotifications();
  const { onSelect, onUpdate, onRemove, onRefresh } = useStoreActions(actions => actions.objective);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const { dreamInterviewId } = useStoreState(state => state.interview);
  const { objectives, selectedActionItem, selectedObjective } = useStoreState(state => state.objective);

  const objectiveToUse = objectiveProp ?? selectedObjective

  const [recKey, setRecKey] = React.useState<number>(0);
  const [showFrequency, setShowFrequency] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ActionItemModel>(item);
  const [person, setPerson] = useState<Person | undefined>();
  const [objective, setObjective] = useState<Objective | undefined>();
  const [showActionItems, setShowActionItems] = useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showAddSubDialog, setShowAddSubDialog] = React.useState(false);
  const [showEditStakeholderDialog, setShowEditStakeholderDialog] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMultipleDeleteConfirmation, setShowMultipleDeleteConfirmation] = useState(false);

  const select = async () => {
    onSelect({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItem: item,
      actionItemId: item?.ActionItemID
    });
  }

  const findAndSetPerson = () => {
    if (!item?.LeadPerson) return;
    const itemPerson = persons?.find((p: Person) => p.PersonID === item?.LeadPerson);
    setPerson(itemPerson);
    setSelectedItem({
      ...item,
      Person: itemPerson
    });
  }

  const findAndSetStakeholders = async () => {
    if (!item?.LeadPerson || !selectedHousehold?.Persons) return;
    const stakeHolders = await api.actionitemstakeholder.list(
      selectedHousehold.HouseholdID, item?.ObjectiveID, item?.ActionItemID!);
    if (!hasItems(stakeHolders?.data)) return;
    const itemStakeholders = stakeHolders?.data.map((s: ActionItemStakeholder) => {
      return {
        ...s,
        Person: persons?.find((p: Person) => s.PersonID === p.PersonID)
      }
    });
    if (item) {
      setSelectedItem({
        ...item,
        Stakeholders: itemStakeholders
      });
    }
  }

  const findAndSetObjective = () => {
    if (!item?.ObjectiveID || !objectives) return;
    const itemObjective = objectives.find((d: Objective) => d.ObjectiveID === item.ObjectiveID);
    setObjective(itemObjective);
    if (item) {
      setSelectedItem({
        ...item,
        Objective: itemObjective
      });
    }
  }

  // TODO - fix all of these
  const computedCompletionClasses = () => {
    return {
      [styles.started]: !isNullOrUndefined(item?.StartDate) && isValidDate(item?.StartDate),
      [styles.completed]: !isNullOrUndefined(item?.CompletionDate) && isValidDate(item?.CompletionDate),
      // [styles.pastdue]: !isNullOrUndefined(a?.DueDate),
    }
  }

  const computedIsComplete = () => {
    return !isNullOrUndefined(item?.CompletionDate) && isValidDate(item?.CompletionDate);
  }

  // Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Edit modal
  const selectItem = async () => {
    notifications.toggleLoading(true);
    onSelect({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItemId: item?.ActionItemID,
      actionItem: item
    });
    notifications.toggleLoading(false);
  }
  const editItem = async () => {
    await selectItem();
    setShowEditDialog(true);
  }

  const deleteOneItem = async (itm: ActionItem) => {
    await onRemove({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItemId: itm?.ActionItemID,
      actionItem: itm
    });
  }

  const deleteItem = async () => {
    notifications.toggleLoading(true)
    await deleteOneItem(item);

    if (onChange) onChange(item, index);
    notifications.toggleLoading(false)
    setAnchorEl(null);
  }

  const deleteAllItems = async () => {
    notifications.toggleLoading(true)
    const {parentItem,children} = getAllItems(item, objectiveToUse.ActionItemList ?? [])

    await deleteOneItem(parentItem)
    await Promise.all(children.map( async itm => await deleteOneItem(itm)))

    if (onChange) onChange(item, index);
    notifications.toggleLoading(false);
    setAnchorEl(null);
  }

  const showDeleteModal = () => {
    const {children} = getAllItems(item, objectiveToUse.ActionItemList ?? [])

    if(children.length > 0){
      setShowMultipleDeleteConfirmation(true)
    }else {
      setShowDeleteConfirmation(true)
    }
  }

  const onComplete = async () => {
    notifications.toggleLoading(true);
    await onUpdate({
      type: IObjectiveDataType.ACTION_ITEM,
      objectiveId: item?.ObjectiveID,
      actionItemId: item?.ActionItemID,
      actionItem: {
        ...item,
        CompletionDate: new Date(),
        ActionItemStatusID: 6
      }
    });

    await deleteItem();
    setAnchorEl(null);
    notifications.addSuccessNotification('Task updated!');
    notifications.toggleLoading(false);
  }

  const onDuplicate = async () => {
    notifications.toggleLoading(true)
    const copy: ActionItemModel = JSON.parse(JSON.stringify(item))
    copy.ActionItemID = undefined

    try {
      await createOrUpdateDirect(
          copy,
          selectedHousehold?.HouseholdID,
          dreamInterviewId,
          notifications,
          onRefresh,
          undefined, false);
    }catch (e){
      notifications.addErrorNotification("Error")
    }

    setAnchorEl(null);
    notifications.addSuccessNotification('Action Item Duplicated');
    notifications.toggleLoading(false)
  }

  // Update a specific field
  const updateFields = async (fields: IFormInputValue[]) => {
    let updated = Object.assign({}, item);
    if (fields) {
      fields?.forEach(f => {
        if (f.field) {
          updated = { ...updated, [f.field]: f.value };
        }
      })
    }

    await createOrUpdateDirect(
      updated as ActionItemModel,
      selectedHousehold?.HouseholdID,
      dreamInterviewId,
      notifications,
      onRefresh,
      undefined, false);
  }

  // Populate data required
  const populateData = async () => {
    // await loadItem();
    // TODO - remove this if not needed
    findAndSetObjective();
    findAndSetPerson();
    await findAndSetStakeholders();
  }

  useMountEvents({
    onMounted: async () => {
      await populateData();
    },
    onChange: async () => {
      await populateData();
    },
    watchItems: [item]
  });

  return (
    <>
      <div className={classnames("item_card", styles.item_clickable)}>
        <div className={"item_content"}>
          <Grid container spacing={1}>
            <Grid container item xs={3}>
              <div className={classnames("item_cell", "item_cell_first")}>
                <DescriptionTemplate props={{
                  item,
                  household: selectedHousehold,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={2}>
              <div className={classnames("item_cell")}>
                <SchedulingTemplate props={{
                  item,
                  household: selectedHousehold,
                  objective,
                  objectives,
                  selected: selectedActionItem,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={2}>
              <div className={classnames("item_cell")}>
                <SchedulingTemplate props={{
                  item,
                  type:'year',
                  household: selectedHousehold,
                  objective,
                  objectives,
                  selected: selectedActionItem,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={2}>
              <div className={classnames("item_cell")}>
                <AssistanceNeededTemplate props={{
                  item,
                  household: selectedHousehold,
                  objective,
                  objectives,
                  selected: selectedActionItem,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={2}>
              <div className={classnames("item_cell", computedCompletionClasses())}>
                <StatusTemplate props={{
                  item,
                  household: selectedHousehold,
                  selected: selectedActionItem,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={1} justifyContent="flex-end">
              <div className={classnames("item_cell_menu")}>
                <div className={classnames("item_cell_menu_button")}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClickMenu}>
                    <Icon>more_vert</Icon>
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={openMenu}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                      },
                    }}>
                    <MenuItem key={'duplicate'} onClick={onDuplicate}>
                      Duplicate
                    </MenuItem>
                    { !computedIsComplete() ?
                      <MenuItem key={'complete'} onClick={onComplete}>
                        Complete Task
                      </MenuItem>
                      : null }
                    <MenuItem key={'delete'} onClick={showDeleteModal}>
                      Delete
                    </MenuItem>
                    <MenuItem key={"frequency"} onClick={() => setShowFrequency(true)}>
                      Recurring
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <ConfirmationModal isOpen={showDeleteConfirmation}
                                 onConfirm={deleteItem}
                                 onCancel={() => setShowDeleteConfirmation(false)} />
              <RecurringActionItemDeleteConfirmationModal
                  onCancel={() => setShowMultipleDeleteConfirmation(false)}
                  onConfirmOne={deleteItem}
                  onConfirmAll={deleteAllItems}
                  isOpen={showMultipleDeleteConfirmation}/>
              <ActionItemRecurringModal key={recKey} objective={objectiveToUse} item={item} isOpen={showFrequency} onClose={() => {
                setShowFrequency(false)
                setRecKey(recKey+1)
              }}/>
            </Grid>
          </Grid>
        </div>
      </div>
      { showActionItems ?
        <div className={"item_children"}>
          <ActionItemList objectiveId={item?.ObjectiveID}
                          parent={item}
                          items={item?.ActionItemList}
                          requiresFetch={false} />
          <Box mt={1} mb={2}>
            <Button
              type="button"
              text="Hide Action Steps"
              size="large"
              color="primary"
              onClick={() => setShowActionItems(false)}
            />
          </Box>
        </div>
        : null }
      { showAddSubDialog ?
        <EditActionItem parent={item}
                        isOpen={showAddSubDialog}
                        onClose={() => setShowAddSubDialog(false)}/>
        : null }
      { showEditDialog ?
        <EditActionItem item={item}
                        isOpen={showEditDialog}
                        onClose={() => setShowEditDialog(false)}/>
        : null }
      { showEditStakeholderDialog ?
        <EditActionItemStakeholder actionItem={item}
                                   isOpen={showEditStakeholderDialog}
                                   onClose={() => setShowEditStakeholderDialog(false)}/>
        : null }
    </>
  );
};

export default DirectionStrategyActionItem;

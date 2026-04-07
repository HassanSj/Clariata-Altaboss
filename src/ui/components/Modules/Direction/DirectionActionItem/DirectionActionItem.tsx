import React, {ReactElement, useState} from 'react';
import styles from '../../../ActionItems/ActionItem/ActionItem.module.scss';
import classnames from 'classnames';
import {Box, Divider, Grid, Icon, Menu, MenuItem} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {Person} from "~/types/api/person";
import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
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
import AssistanceNeededTemplate from "~/ui/components/ActionItems/CellTemplates/AssistanceNeededTemplate";
import { ObjectiveType } from '~/types/api/objectiveType';
import useSWR from 'swr';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import { ActionItemStatus } from '~/types/api/actionItemStatus';

interface IProps {
  item: ActionItemModel;
  index?: number;
  onChange?: any;
}

const DirectionActionItem = ({ item, index, onChange }: IProps): ReactElement => {
  const notifications = useNotifications();
  //const { actionItemStatuses } = useStoreState(state => state.constants);
  const { data: actionItemStatuses } = useSWR<ActionItemStatus[]>([`${process.env.NEXT_PUBLIC_API_URL}/actionitemstatus/list`, getAccessToken()], fetcher);
  const { onPopulate, onSelect, onCreate, onUpdate, onRemove, onRefresh } = useStoreActions(actions => actions.objective);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const { dreamInterviewId } = useStoreState(state => state.interview);
  const { selectedObjective, objectives, selectedActionItem } = useStoreState(state => state.objective);
  //const { objectiveTypes } = useStoreState(state => state.constants);
  const { data: objectiveTypes } = useSWR<ObjectiveType[]>([`${process.env.NEXT_PUBLIC_API_URL}/objectivetype/list`, getAccessToken()], fetcher);

  const [isPopulated, setIsPopulated] = useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ActionItemModel>(item);
  const [person, setPerson] = useState<Person | undefined>();
  const [objective, setObjective] = useState<Objective | undefined>();
  const [showActionItems, setShowActionItems] = useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showAddSubDialog, setShowAddSubDialog] = React.useState(false);
  const [showEditStakeholderDialog, setShowEditStakeholderDialog] = React.useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = React.useState<ActionItemStakeholder | undefined>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  const getObjective = () => {
    if (!item?.ObjectiveID || !objectives) return;
    return objectives.find((d: Objective) => d.ObjectiveID === item.ObjectiveID);
  }

  // TODO - fix all of these
  const computedCompletionClasses = () => {
    return {
      [styles.started]: !isNullOrUndefined(item?.StartDate) && isValidDate(item?.StartDate),
      [styles.completed]: !isNullOrUndefined(item?.CompletionDate) && isValidDate(item?.CompletionDate),
      // [styles.pastdue]: !isNullOrUndefined(a?.DueDate),
    }
  }

  const computedIsInProgress = () => {
    return !isNullOrUndefined(item?.StartDate) && isValidDate(item?.StartDate);
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
  const handleSelectMenuItem = (menuItem: any) => {
    handleCloseMenu();
    // TODO - handle
  }

  // Edit modal
  const loadItem = async () => {
    const fullItem = await getItem();
    setSelectedItem(fullItem);
  }
  const getItem = async () => {
    return await api.actionitem.getFull(
      selectedHousehold.HouseholdID,
      item.ObjectiveID,
      dreamInterviewId,
      item.ActionItemID!);
  }
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
  const deleteItem = () => {
    onRemove({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItemId: item?.ActionItemID,
      actionItem: item
    });
    if (onChange) onChange(item, index);
  }

  // Edit stakeholders
  const addStakeholder = async () => {
    setSelectedStakeholder(undefined);
    setShowEditStakeholderDialog(true);
  }
  const editStakeholder = async (stakeholder: ActionItemStakeholder) => {
    setSelectedStakeholder(stakeholder);
    setShowEditStakeholderDialog(true);
  }

  // Create, update, delete
  const createOrUpdate = async () => {
    try {
      const householdId = selectedHousehold?.HouseholdID;
      const res = await (item?.ActionItemID ?
        api.actionitem.update(householdId, item?.ObjectiveID, item?.ActionItemID, item) :
        api.actionitem.create(householdId, item?.ObjectiveID, item));
      onPopulate({type: IObjectiveDataType.ACTION_ITEM});
      onSelect(res.data);
    } catch (err) {
      processServerError(err, 'EditActionItem.createOrUpdate');
    }
  };
  const remove = async () => {
    if (!item?.ActionItemID) {
      return;
    }
    onRemove({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItemId: item?.ActionItemID,
      actionItem: item
    });
    onSelect({
      actionItem: null
    });
  }

  // Complete & start
  const onStart = async () => {
    notifications.toggleLoading(true);
    await onUpdate({
      type: IObjectiveDataType.ACTION_ITEM,
      objectiveId: item?.ObjectiveID,
      actionItemId: item?.ActionItemID,
      actionItem: {
        ...item,
        StartDate: new Date()
      }
    });
    // notifications
    notifications.toggleLoading(false);
  }
  const onComplete = async () => {
    notifications.toggleLoading(true);
    await onUpdate({
      type: IObjectiveDataType.ACTION_ITEM,
      objectiveId: item?.ObjectiveID,
      actionItemId: item?.ActionItemID,
      actionItem: {
        ...item,
        CompletionDate: new Date()
      }
    });
    notifications.addSuccessNotification('Task updated!');
    notifications.toggleLoading(false);
  }

  // Quick update a field
  const onDelete = async () => {
    notifications.toggleLoading(true);
    await onRemove({
      type: IObjectiveDataType.ACTION_ITEM,
      objectiveId: item?.ObjectiveID,
      actionItemId: item?.ActionItemID,
      actionItem: item
    });
    notifications.addSuccessNotification('Task updated!');
    notifications.toggleLoading(false);
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
      undefined);
  }

  // Populate data required
  const populateData = async () => {
    // await loadItem();
    // TODO - remove this if not needed
    findAndSetObjective();
    findAndSetPerson();
    findAndSetStakeholders();
  }

  useMountEvents({
    onMounted: async () => {
      populateData();
    },
    onChange: async () => {
      populateData();
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
            <Grid container item xs={3}>
              <div className={classnames("item_cell")}>
                <AssistanceNeededTemplate props={{
                  item,
                  household: selectedHousehold,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={3}>
              <div className={classnames("item_cell")}>
                <LeadPersonTemplate props={{
                  item,
                  household: selectedHousehold,
                  person,
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
                    <MenuItem key={'add_stakeholder'} onClick={() => addStakeholder()}>
                      Add Stakeholder
                    </MenuItem>
                    <MenuItem key={'add_task'} onClick={() => setShowAddSubDialog(true)}>
                      Add Sub Task
                    </MenuItem>
                    <Divider />
                    { !computedIsInProgress() ?
                      <MenuItem key={'start'} onClick={() => onStart()}>
                        Start Task
                      </MenuItem>
                      : null }
                    { !computedIsComplete() ?
                      <MenuItem key={'complete'} onClick={() => onComplete()}>
                        Complete Task
                      </MenuItem>
                      : null }
                    <MenuItem key={'edit'} onClick={() => editItem()}>
                      Edit
                    </MenuItem>
                    <MenuItem key={'delete'} onClick={() => setShowDeleteConfirmation(true)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <ConfirmationModal isOpen={showDeleteConfirmation}
                                 onConfirm={deleteItem}
                                 onCancel={() => setShowDeleteConfirmation(false)} />
            </Grid>
          </Grid>
        </div>
      </div>
      { showActionItems ?
        <div className={"item_children"}>
          <ActionItemList objectiveId={item?.ObjectiveID}
                          parent={item}
                          items={item?.ActionItemList}
                          requiresFetch={false}
                          isDirection={true} />
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
                                   onClose={() => setShowEditStakeholderDialog(false)}></EditActionItemStakeholder>
        : null }
    </>
  );
};

export default DirectionActionItem;

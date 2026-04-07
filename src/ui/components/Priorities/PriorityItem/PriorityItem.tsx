import React, {ReactElement, useState} from 'react';
import styles from './PriorityItem.module.scss';
import classnames from 'classnames';
import {Box, Divider, Grid, Icon, Menu, MenuItem,} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import {Objective} from "~/types/api/objective";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
import IconButton from "@material-ui/core/IconButton";
import api from "~/services/api";
import {IObjectiveDataType} from "~/types/objective/store";
import Button from "~/ui/components/Button";
import EditPriorityForm from "~/ui/components/Priorities/EditPriorityFormModal";
import EditPriorityStakeholder from "~/ui/components/Priorities/EditPriorityStakeholder";
import {ObjectiveStakeholder} from "~/types/api/objectiveStakeholder";
import {processServerError} from "~/services/api/errors";
import {useDrag, useDrop} from "react-dnd";
import {DragAndDropItem, IDataItemEventConfig} from "~/types/data";
import {CrudActionType} from "~/ui/constants/data";
import {Person} from "~/types/api/person";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {IFormInputValue} from "~/types/forms";
import {createOrUpdateDirect} from "~/ui/components/Priorities/EditPriorityFormContent/EditPriorityFormContent";
import ActionItemList from "~/ui/components/ActionItems/ActionItemList";
import DescriptionTemplate from "~/ui/components/Priorities/CellTemplates/DescriptionTemplate";
import ChampionTemplate from "~/ui/components/Priorities/CellTemplates/ChampionTemplate";
import MetricOfSuccessTemplate from "~/ui/components/Priorities/CellTemplates/MetricOfSuccessTemplate";
import DimensionOfLifeTemplate from "~/ui/components/Priorities/CellTemplates/DimensionOfLifeTemplate";
import ActionItemsTemplate from "~/ui/components/Priorities/CellTemplates/ActionItemsTemplate";
import PriorityTemplate from "~/ui/components/Priorities/CellTemplates/PriorityTemplate";
import ScheduleDetailsTemplate from "~/ui/components/Priorities/CellTemplates/ScheduleDetailsTemplate";
import AssistanceNeededTemplate from "~/ui/components/Priorities/CellTemplates/AssistanceNeededTemplate";
import StakeholdersTemplate from "~/ui/components/Priorities/CellTemplates/StakeholdersTemplate";
import ConnectionsTemplate from "~/ui/components/Priorities/CellTemplates/ConnectionsTemplate";
import KnowledgeYesNoTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeYesNoTemplate";
import KnowledgeNeededTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeNeededTemplate";
import KnowledgeAdvisorHelpTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeAdvisorHelpTemplate";
import PersonalExperienceTemplate from "~/ui/components/Priorities/CellTemplates/PersonalExperienceTemplate";
import PersonalImpactLevelTemplate from "~/ui/components/Priorities/CellTemplates/PersonalImpactLevelTemplate";
import FundingKnownTemplate from "~/ui/components/Priorities/CellTemplates/FundingKnownTemplate";
import FundingAmountsTemplate from "~/ui/components/Priorities/CellTemplates/FundingAmountsTemplate";
import FundingDetailTemplate from "~/ui/components/Priorities/CellTemplates/FundingDetailTemplate";
import ImportanceTemplate from "~/ui/components/Priorities/CellTemplates/ImportanceTemplate";
import SuccessDescriptionTemplate from "~/ui/components/Priorities/CellTemplates/SuccessDescriptionTemplate";
import SuccessImageTemplate from "~/ui/components/Priorities/CellTemplates/SuccessImageTemplate";
import PriorityTimeframeTemplate from '../CellTemplates/PriorityTimeframeTemplate';
import DatesTemplate from '../CellTemplates/DatesTemplate';
import AssistanceToggleTemplate from '../CellTemplates/AssistanceToggleTemplate';
import { getAccessToken, getSessionGUID } from '~/services/auth';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';


interface IProps {
  index?: number;
  objective: Objective;
  views: any;
  onChange?: any;
  eventConfig?: IDataItemEventConfig;
}

export const MAX_CELL_STR_LENGTH = 40;

const PriorityItem = ({objective, views, index, onChange, eventConfig}: IProps): ReactElement => {
  const notifications = useNotifications();
  const {onSelect, onRemove, onPopulate, onRefresh} = useStoreActions(actions => actions.objective);
  const {selectedHousehold} = useStoreState(state => state.household);
  const {actionItems} = useStoreState(state => state.objective);
  const {dreamInterviewId} = useStoreState(state => state.interview);
  const {metricsOfSuccess, dimensionsOfLife} = useStoreState(state => state.constants);
  //const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  //const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
  const layout = useStoreState(state => state.layout);

  const isEdit = Boolean(objective?.ObjectiveID);
  const [item, setItem] = useState(objective);
  const [dimensionOfLife, setDimensionOfLife] = useState<DimensionOfLife | undefined>();
  const [metricOfSuccess, setMetricOfSuccess] = useState<MetricOfSuccess | undefined>();
  const [objectiveActionItems, setObjectiveActionItems] = useState<ActionItemModel[] | undefined>();
  const [showActionItems, setShowActionItems] = useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showEditActionItemDialog, setShowEditActionItemDialog] = React.useState(false);
  const [showEditStakeholderDialog, setShowEditStakeholderDialog] = React.useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = React.useState<ObjectiveStakeholder | undefined>();
  const [connections, setConnections] = useState<Person[] | undefined>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Quick update a field
  const onDelete = async () => {
    notifications.toggleLoading(true);
    await onRemove({
      type: IObjectiveDataType.OBJECTIVE,
      objectiveId: objective?.ObjectiveID,
      objective
    });
    notifications.addSuccessNotification('Task deleted!');
    notifications.toggleLoading(false);
  }

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
      updated as Objective,
      selectedHousehold?.HouseholdID,
      dreamInterviewId,
      notifications,
      onRefresh,
      undefined);
  }

  const select = async () => {
    onSelect({
      type: IObjectiveDataType.OBJECTIVE,
      objective,
      objectiveId: objective?.ObjectiveID
    });
  }

  const findAndSetDimensionOfSuccess = async () => {
    if (!objective?.DimensionOfLifeID || !dimensionsOfLife) return;
    const dimension = dimensionsOfLife.find((d: DimensionOfLife) => d.DimensionOfLifeID === objective?.DimensionOfLifeID);
    setDimensionOfLife(dimension);
  }

  const getDimensionOfSuccess = () => {
    if (!objective?.DimensionOfLifeID || !dimensionsOfLife) return;
    return dimensionsOfLife.find((d: DimensionOfLife) => d.DimensionOfLifeID === objective.DimensionOfLifeID);
  }

  const findAndSetMetricOfSuccess = async () => {
    if (!objective?.DimensionOfLifeID || !metricsOfSuccess) return;
    const metric = metricsOfSuccess.find((m: MetricOfSuccess) => m.MetricOfSuccessID === objective?.MetricOfSuccessID);
    setMetricOfSuccess(metric);
  }

  const getMetricOfSuccess = () => {
    if (!objective?.DimensionOfLifeID || !metricsOfSuccess) return;
    return metricsOfSuccess.find((m: MetricOfSuccess) => m.MetricOfSuccessID === objective.MetricOfSuccessID);
  }

  const findAndSetActionItems = async () => {
    if (!actionItems) return;
    const items = metricsOfSuccess.find((i: ActionItemModel) => i.ObjectiveID === objective.MetricOfSuccessID);
    setObjectiveActionItems(items);
  }

  const getConnections = async () => {
    // TODO
    return [];
  }

  const loadItem = async () => {
    const res = await api.objective.getFull(
      selectedHousehold.HouseholdID,
      objective.InterviewID,
      objective.ObjectiveID,
      dimensionsOfLife,
      metricsOfSuccess);
    setItem(res);
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
  const selectItem = async () => {
    notifications.toggleLoading(true);
    onSelect({
      type: IObjectiveDataType.OBJECTIVE,
      objectiveId: objective?.ObjectiveID,
      objective
    });
    notifications.toggleLoading(false);
  }
  const editItem = async () => {
    await selectItem();
    setShowEditDialog(true);
  }
  const deleteItem = () => {
    onRemove({
      type: IObjectiveDataType.OBJECTIVE,
      objectiveId: objective?.ObjectiveID,
      objective
    });
    if (onChange) onChange(objective, index);
  }

  // Edit stakeholders
  const addStakeholder = async () => {
    setSelectedStakeholder(undefined);
    setShowEditStakeholderDialog(true);
  }
  const editStakeholder = async (stakeholder: ObjectiveStakeholder) => {
    setSelectedStakeholder(stakeholder);
    setShowEditStakeholderDialog(true);
  }

  // Create, update, delete
  const createOrUpdate = async () => {
    notifications.toggleLoading(true);
    try {
      const {HouseholdID} = selectedHousehold;
      // @ts-ignore
      const res = await (!isEdit
        ? api.objective.create(HouseholdID, dreamInterviewId, objective)
        : api.objective.update(HouseholdID, dreamInterviewId, objective.ObjectiveID, objective));
      onPopulate({type: IObjectiveDataType.OBJECTIVE});
    } catch (err) {
      processServerError(err, 'EditPriorityForm.createOrUpdate');
    }
    notifications.toggleLoading(false);
  };
  const remove = async () => {
    if (!objective) return;
    notifications.toggleLoading(true);
    try {
      const {HouseholdID} = selectedHousehold;
      const res = await api.objective.remove(HouseholdID, dreamInterviewId, objective?.ObjectiveID, objective);
      onPopulate({type: IObjectiveDataType.OBJECTIVE});
    } catch (err) {
      processServerError(err, 'EditPriorityForm.remove');
    }
    notifications.toggleLoading(false);
  };

  // Populate data
  const populateData = async () => {
    // await loadItem();
    // TODO - re-evaluate whether the functions below are needed
    findAndSetDimensionOfSuccess();
    findAndSetMetricOfSuccess();
    findAndSetActionItems();
  }

  useMountEvents({
    onMounted: async () => {
      populateData();
    },
    onChange: async () => {
      populateData();
    },
    watchItems: [objective]
  });

  // Dragging
  const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
  }
  const [dndId, setDndId] = useState(objective?.ObjectiveID);
  const [{isDragging}, drag] = useDrag({
    item: {type: 'PRIORITY', id: dndId, originalIndex: index},
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult: any, monitor: any) => {
      const {id: droppedId, originalIndex} = monitor.getItem()
      const didDrop = monitor.didDrop();
      if (eventConfig?.onItemDragEndEvent) {
        eventConfig?.onItemDragEndEvent();
      }
      if (!didDrop) {
        // moveCard(droppedId, originalIndex);
      }

    },
  });
  const [, drop] = useDrop({
    accept: 'PRIORITY',
    canDrop: () => true,
    hover({id: draggedId}: DragAndDropItem) {
      if (String(draggedId) !== String(dndId) && String(layout?.lastDragEvent?.targetItemId) !== String(dndId)) {
        if (eventConfig?.onItemDragEvent) {
          eventConfig?.onItemDragEvent({
            type: CrudActionType.MOVE,
            targetItemId: String(dndId),
            itemId: String(draggedId)
          });
        }
      }
    },
    drop({id: draggedId}: DragAndDropItem) {
      if (String(draggedId) !== String(dndId)) {
        if (eventConfig?.onItemDropEvent) {
          eventConfig?.onItemDropEvent({
            type: CrudActionType.MOVE,
            targetItemId: String(dndId),
            itemId: String(draggedId)
          });
        }
      }
    },
  });

  return (
    <>
      {layout?.isDragging && (String(objective?.ObjectiveID) === layout?.lastDragEvent?.targetItemId) ?
        <div className={styles.item_card_drag_hover_placeholder}></div>
        : null}
      <div className={classnames("item_card", {"item_card_drag_target_placeholder": isDragging})}
           ref={(node) => drag(drop(node))}>
        <div className={"item_content"}>
          <Grid container spacing={1}>
            <Grid container item xs={3}>
              <div className={classnames("item_cell", "item_cell_first")}>
                <DescriptionTemplate props={{
                  objective,
                  household: selectedHousehold,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            <Grid container item xs={2}>
              <div className={"item_cell"}>
                <ChampionTemplate props={{
                  objective,
                  household: selectedHousehold,
                  onUpdateFields: updateFields,
                  onEdit: editItem,
                  onSelect: select
                }}/>
              </div>
            </Grid>
            {views?.selectedView?.id === 'summary' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <div className={"item_cell"}>
                      <MetricOfSuccessTemplate props={{
                        objective,
                        household: selectedHousehold,
                        metricOfSuccess,
                        onUpdateFields: updateFields,
                        onEdit: editItem,
                        onSelect: select
                      }}/>
                    </div>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <DimensionOfLifeTemplate props={{
                      objective,
                      household: selectedHousehold,
                      dimensionOfLife,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <ActionItemsTemplate props={{
                      objective,
                      household: selectedHousehold,
                      setShowActionItems,
                      showActionItems,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'timing' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <PriorityTimeframeTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <DatesTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <AssistanceToggleTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'assistance' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <AssistanceNeededTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <StakeholdersTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onEditStakeholder: editStakeholder,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <ConnectionsTemplate props={{
                      objective,
                      household: selectedHousehold,
                      connections,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'knowledge' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <KnowledgeYesNoTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <KnowledgeNeededTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell_long_content"}>
                    <KnowledgeAdvisorHelpTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'experience' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <PersonalImpactLevelTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={4}>
                  <div className={"item_cell_long_content"}>
                    <PersonalExperienceTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'funding' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <FundingKnownTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <FundingAmountsTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell_long_content"}>
                    <FundingDetailTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
            {views?.selectedView?.id === 'importance' ?
              <>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <ImportanceTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell_long_content"}>
                    <SuccessDescriptionTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
                <Grid container item xs={2}>
                  <div className={"item_cell"}>
                    <SuccessImageTemplate props={{
                      objective,
                      household: selectedHousehold,
                      onUpdateFields: updateFields,
                      onEdit: editItem,
                      onSelect: select
                    }}/>
                  </div>
                </Grid>
              </>
              : null}
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
                    <MenuItem key={'add_task'} onClick={() => setShowEditActionItemDialog(true)}>
                      Add Action Step
                    </MenuItem>
                    <Divider/>
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
                                 onCancel={() => setShowDeleteConfirmation(false)}/>
            </Grid>
          </Grid>
        </div>
      </div>
      {showActionItems ?
        <div className={"item_children"}>
          <ActionItemList objectiveId={objective?.ObjectiveID}
                          items={objective?.ActionItemList}
                          requiresFetch={false}/>
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
        : null}
      {showEditDialog ?
        <EditPriorityForm item={objective}
                          isOpen={showEditDialog}
                          onClose={() => setShowEditDialog(false)}></EditPriorityForm>
        : null}
      {showEditActionItemDialog ?
        <EditActionItem objective={objective}
                        isOpen={showEditActionItemDialog}
                        onClose={() => setShowEditActionItemDialog(false)}></EditActionItem>
        : null}
      {showEditStakeholderDialog ?
        <EditPriorityStakeholder objective={objective}
                                 isOpen={showEditStakeholderDialog}
                                 onClose={() => setShowEditStakeholderDialog(false)}></EditPriorityStakeholder>
        : null}
    </>
  );
};

export default PriorityItem;

import React, {ReactElement, useState} from 'react';
import classnames from 'classnames';
import {get} from 'lodash';
import {Box, Divider, Grid, Icon, Menu, MenuItem,} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import {Objective} from "~/types/api/objective";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
import IconButton from "@material-ui/core/IconButton";
import {IObjectiveDataType} from "~/types/objective/store";
import Button from "~/ui/components/Button";
import EditPriorityForm from "~/ui/components/Priorities/EditPriorityFormModal";
import EditPriorityStakeholder from "~/ui/components/Priorities/EditPriorityStakeholder";
import {useDrag, useDrop} from "react-dnd";
import {DragAndDropItem, IDataItemEventConfig, IDataTableHeader, IDataTableView} from "~/types/data";
import {CrudActionType, SortDirection} from "~/ui/constants/data";
import {Person} from "~/types/api/person";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {IFormInputValue} from "~/types/forms";
import {createOrUpdateDirect} from "~/ui/components/Priorities/EditPriorityFormContent/EditPriorityFormContent";
import ActionItemList from "~/ui/components/ActionItems/ActionItemList";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {IPriorityItemCellTemplateProps} from "~/types/objective/objectives";
import {useRouter} from "next/router";
import useSortable from "~/ui/hooks/useSortable";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';

interface ITemplateProps extends IPriorityItemCellTemplateProps {
  view: IDataTableView,
  i: IDataTableHeader,
  item: Objective,
  iIndex: number,
}

const PriorityItemTemplateItem = ({view,
                                    i,
                                    item,
                                    iIndex,
                                    objective,
                                    selected,
                                    household,
                                    person,
                                    persons,
                                    connections,
                                    metricOfSuccess,
                                    dimensionOfLife,
                                    setShowActionItems,
                                    showActionItems,
                                    onUpdateFields,
                                    onEditStakeholder,
                                    onEdit,
                                    onSelect,
                                    onToggle}: ITemplateProps) => {
  return (
    <Grid container item xs={i?.width}>
      <div className={classnames("item_cell", "item_cell_first")}>
        {(
          React.createElement(
            i?.component,
            {
              key: `${get(item, view?.idField)}-${iIndex}`,
              objective,
              metricOfSuccess,
              dimensionOfLife,
              setShowActionItems,
              showActionItems,
              connections,
              household,
              onUpdateFields,
              onEdit,
              onSelect
            },
          )
        )}
      </div>
    </Grid>
  )
}


interface IProps {
  index?: number;
  objective: Objective;
  views: any;
  onChange?: any;
  eventConfig?: IDataItemEventConfig;
  dragEnabled: boolean;
}

const PriorityItemTemplate = ({objective, views, index, onChange, eventConfig, dragEnabled}: IProps): ReactElement => {
  const notifications = useNotifications();
  const router = useRouter();

  const {onSelect, onRemove, onRefresh, onRankUpdate} = useStoreActions(actions => actions.objective);
  const {selectedHousehold} = useStoreState(state => state.household);
  const {actionItems, selectedObjectiveIds, objectives} = useStoreState(state => state.objective);
  const {dreamInterviewId} = useStoreState(state => state.interview);
  const {metricsOfSuccess, dimensionsOfLife} = useStoreState(state => state.constants);
  //const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  //const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);


  const [isDirection, setIsDirection] = useState(true);
  const [dimensionOfLife, setDimensionOfLife] = useState<DimensionOfLife | undefined>();
  const [metricOfSuccess, setMetricOfSuccess] = useState<MetricOfSuccess | undefined>();
  const [objectiveActionItems, setObjectiveActionItems] = useState<ActionItemModel[] | undefined>();
  const [showActionItems, setShowActionItems] = useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showEditActionItemDialog, setShowEditActionItemDialog] = React.useState(false);
  const [showEditStakeholderDialog, setShowEditStakeholderDialog] = React.useState(false);
  const [connections, setConnections] = useState<Person[] | undefined>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  const updateFields = async (fields: IFormInputValue[]) => {
    let isRankUpdate = false;
    let updated = Object.assign({}, objective);
    let updatedRank : number = 0;
    let oldRank:number = 0
    if (fields) {
      fields?.forEach(f => {
        if (f.field) {
          if(f.field === 'Rank') {
            isRankUpdate = true;
            oldRank = objective.Rank ?? 0
            updatedRank = Number( f.value.replace("[^0-9]+", ""));
          }
          else {
            updated = { ...updated, [f.field]: f.value };
          }
        }
      })
    }
    if(isRankUpdate) {
      const updatedObjectives : Objective[] = [];
      objectives.forEach(o => {
        if(o.ObjectiveID === objective.ObjectiveID)
        {
          const updatedObjective = o;
          updatedObjective.Rank = updatedRank;
          updatedObjectives.push(updatedObjective);
        } else if(Number(o?.Rank) >= updatedRank) {

          const change = oldRank > updatedRank ? 1 : -1
          updatedObjectives.push({...o, 'Rank': Number(o?.Rank) + change});
        } else {
          updatedObjectives.push(o);
        }
      });
      updatedObjectives.sort((a, b) => (Number(a.Rank) > Number(b.Rank)) ? 1 : -1);
      await onRankUpdate(updatedObjectives);
    } else {
      await createOrUpdateDirect(
        updated as Objective,
        selectedHousehold?.HouseholdID,
        dreamInterviewId,
        notifications,
        onRefresh,
        undefined);
    }
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

  const findAndSetMetricOfSuccess = async () => {
    if (!objective?.DimensionOfLifeID || !metricsOfSuccess) return;
    const metric = metricsOfSuccess.find((m: MetricOfSuccess) => m.MetricOfSuccessID === objective?.MetricOfSuccessID);
    setMetricOfSuccess(metric);
  }

  const findAndSetActionItems = async () => {
    if (!actionItems) return;
    const items = metricsOfSuccess.find((i: ActionItemModel) => i.ObjectiveID === objective.MetricOfSuccessID);
    setObjectiveActionItems(items);
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

  const deleteItem = async () => {
    notifications.toggleLoading(true)
    const thisID = objective?.ObjectiveID;
    await onRemove({
      type: IObjectiveDataType.OBJECTIVE,
      objectiveId: thisID,
      objective
    });

    const adjusted = { ...selectedObjectiveIds, [objective!.ObjectiveID]: false };

    Object.keys(adjusted).forEach(key => {
      const obj = objectives.find(o => o.ObjectiveID === Number(key) && o.ObjectiveID !== thisID)
      if(obj === undefined) {
        // @ts-ignore
        adjusted[Number(key)] = false
      }
    })

    await Promise.all(Object.keys(adjusted).map(async key => {
      await onSelect({
        type: IObjectiveDataType.OBJECTIVE_IDS,
        objectiveIds: adjusted,
        objectiveId: Number(key),
        // @ts-ignore
        selected: adjusted[key]
      });
    }))

    const sorted = objectives.filter(obj => obj.ObjectiveID !== thisID).sort((a, b) => (Number(a.Rank) > Number(b.Rank)) ? 1 : -1);

    await onRankUpdate(sorted);

    if (onChange) onChange(objective, index);
    notifications.toggleLoading(false)
  }

  // Populate data
  const populateData = async () => {
    // await loadItem();
    // TODO - re-evaluate whether the functions below are needed
    if (router.asPath?.indexOf('direction') === -1) {
      setIsDirection(false);
    }
    await findAndSetDimensionOfSuccess();
    await findAndSetMetricOfSuccess();
    await findAndSetActionItems();
  }

  useMountEvents({
    onMounted: async () => {
      await populateData();
    },
    onChange: async () => {
      await populateData();
    },
    watchItems: [objective]
  });

  // Dragging
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
  const [{isHoveredOver}, drop] = useDrop({
    accept: 'PRIORITY',
    canDrop: () => true,
    collect: (monitor: any) => ({
      isHoveredOver: monitor.isOver()
    }),
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
    }
  });

  const sortableActionItems = useSortable(
      objective?.ActionItemList ?? [],
      SortDirection.ASC,
      (itm: ActionItemModel | undefined) => [ itm?.StartDate ? `${itm?.StartDate}` : "-1"],
  );
  return (
    <>

      <div className={classnames("item_card",
        {"selected": selectedObjectiveIds ? selectedObjectiveIds[objective?.ObjectiveID] : false},
        {"item_card_drag_target_placeholder": isHoveredOver},
        {"item_card_drag_hover_placeholder": isDragging})}
           ref={(node) => { if(dragEnabled) drag(drop(node))}}>
        <div className={"item_content"}>
          <Grid container spacing={1}>
            {views?.getCurrentHeaders()?.map((i: any, iIndex: number) => {
              if(((i.onlyOnNoDrag && !dragEnabled) || !i.onlyOnNoDrag))
                return (
                  <Grid container item xs={i?.collapsedWidth && !dragEnabled ? i?.collapsedWidth : i?.width} key={iIndex} alignContent="center">
                    <div className={classnames("item_cell", { ["item_cell_first"]: iIndex === 0 })}>                     
                      {!isNullOrUndefined(i?.component) ? React.createElement(
                          i.component,
                          {
                            props: {
                              key: `${objective?.ObjectiveID}-${iIndex}`,
                              objective,
                              metricOfSuccess,
                              dimensionOfLife,
                              setShowActionItems,
                              showActionItems,
                              connections,
                              household: selectedHousehold,
                              onUpdateFields: updateFields,
                              onEdit: editItem,
                              onSelect: select,
                              locked: !dragEnabled
                            }
                          },
                        ) : null}
                    </div>
                  </Grid>
                )
              else return null;
            })}
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
                    {/* <MenuItem key={'add_task'} onClick={() => {
                      setShowEditActionItemDialog(true)
                      handleCloseMenu()
                    }}>
                      Add Action Step
                    </MenuItem> */}
                    <Divider/>
                    <MenuItem key={'show_action_items'} onClick={() => {
                      setShowActionItems(!showActionItems)
                      handleCloseMenu()
                    }}>
                      { showActionItems ? "Hide Action Steps" : "Show Action Steps" }
                    </MenuItem>
                    <Divider/>
                    <MenuItem key={'edit'} onClick={() => {
                      editItem().then()
                      handleCloseMenu()
                    }}>
                      Curate
                    </MenuItem>
                    <MenuItem key={'delete'} onClick={() => {
                      setShowDeleteConfirmation(true)
                      handleCloseMenu()
                    }}>
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
                          objective={objective}
                          items={sortableActionItems}
                          requiresFetch={false}
                          isDirection={isDirection}/>
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
      {(showEditDialog) ?
        <EditPriorityForm item={objective}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}/>
        : null}
      {showEditActionItemDialog ?
        <EditActionItem objective={objective}
          isOpen={showEditActionItemDialog}
          onClose={() => setShowEditActionItemDialog(false)}/>
        : null}
      {showEditStakeholderDialog ?
        <EditPriorityStakeholder objective={objective}
          isOpen={showEditStakeholderDialog}
          onClose={() => setShowEditStakeholderDialog(false)}/>
        : null}
    </>
  );
};

export default PriorityItemTemplate;

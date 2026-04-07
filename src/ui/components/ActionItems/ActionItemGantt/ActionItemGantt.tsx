import * as React from 'react';
import {useRef} from 'react';
import {
  extendDataItem,
  filterBy,
  Gantt,
  GanttDateFilter,
  GanttDayView,
  GanttMonthView,
  GanttTextFilter,
  GanttWeekView,
  mapTree,
  orderBy
} from '@progress/kendo-react-gantt';
import {getter} from '@progress/kendo-react-common';
import {useStoreActions, useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {ganttFields, toGanttDependencies, toGanttTasks} from "~/ui/components/ActionItems/ActionItemGantt/utils";
import {hasItems} from "~/ui/constants/utils";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {Alert} from "@material-ui/lab";
import styles from 'ui/components/ActionItems/ActionItemGantt/ActionItemGantt.module.scss';
import {IObjectiveDataType} from "~/types/objective/store";
import {schedulerFields} from "~/ui/components/ActionItems/ActionItemScheduler/utils";
import {Box} from "@material-ui/core";

export const ActionItemGanttEditor = (props: any) => {
  const [showEditDialog, setShowEditDialog] = React.useState(true);

  const handleClose = () => {
    setShowEditDialog(false);
    props.onClose();
  }

  return (
    <EditActionItem item={props.dataItem}
                    isOpen={showEditDialog}
                    onClose={handleClose}></EditActionItem>
  );
};

const ganttStyle = {
  width: '100%'
};

const dependencyModelFields = {
  id: 'id',
  fromId: 'fromId',
  toId: 'toId',
  type: 'type'
};

const getTaskId = getter(ganttFields.id);

const columns = [
  { field: ganttFields.id, title: 'ID', width: 70},
  { field: ganttFields.title, title: 'Title', width: 200, expandable: true, filter: GanttTextFilter },
  { field: ganttFields.start, title: 'Start', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter },
  { field: ganttFields.end, title: 'End', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter }
];

interface IProps {
  actionItems: any[] | undefined;
}

const ActionItemGantt = ({ actionItems }: IProps) => {
    const ref: any = useRef();
  const { objectives } = useStoreState((state) => state.objective);
  const {onPopulate, onSelect, onCreate, onUpdate, onRemove} = useStoreActions(actions => actions.objective);

  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [editItem, setEditItem] = React.useState<any>(null);
  const [removeItem, setRemoveItem] = React.useState<any>(null);
  const [selectedIdState, setSelectedIdState] = React.useState<any>(null);

  const [taskData, setTaskData] = React.useState<any>([]);
  const [dependencyData, setDependencyData] = React.useState<any>([]);
  const [invalidData, setInvalidData] = React.useState<any>([]);
  const [showInvalidData, setShowInvalidData] = React.useState(false);

  const [expandedState, setExpandedState] = React.useState([7, 11, 12, 13]);
  const [columnsState, setColumnsState] = React.useState(columns);

  const onColumnResize = React.useCallback(
    (event) => event.end && setColumnsState(event.columns),
    [setColumnsState]
  );

  const onColumnReorder = React.useCallback(
    (event) => setColumnsState(event.columns),
    [setColumnsState]
  );

  const [dataState, setDataState] = React.useState({
    sort: [{ field: 'orderId', dir: 'asc' }],
    filter: []
  });

  const onDataStateChange = React.useCallback(
    (event) => {
      // Set state
      setDataState({sort: event.dataState.sort, filter: event.dataState.filter});
    },
    [setDataState]
  );

  const onExpandChange = React.useCallback(
    (event) => {
      const id = getTaskId(event.dataItem);
      const newExpandedState = event.value ?
        expandedState.filter(currentId => currentId !== id) :
        [ ...expandedState, id];

      setExpandedState(newExpandedState);
    },
    [expandedState, setExpandedState]
  );

  const onSelected = React.useCallback(
    (event) => setSelectedIdState(getTaskId(event.dataItem)),
    [setSelectedIdState]
  );

  const onEdit = React.useCallback(
    (event) => setEditItem(Object.assign({}, event.dataItem)),
    [setEditItem]
  );

  const onAdd = React.useCallback(
    (event) => {
      const {syntheticEvent, nativeEvent, target, ...others} = event;
      onCreate({
        type: IObjectiveDataType.ACTION_ITEM,
        objectiveId: event.dataItem.ObjectiveID,
        actionItem: event.dataItem
      });
    },
    [taskData, schedulerFields]
  );

  const onFormSubmit = React.useCallback(
    (event) => {
      onUpdate({
        type: IObjectiveDataType.ACTION_ITEM,
        objectiveId: event.dataItem.ObjectiveID,
        actionItemId: event.dataItem.ActionItemID,
        actionItem: event.dataItem
      });
    },
    [taskData, setTaskData, setEditItem]
  );

  const onFormCancel = React.useCallback(
    () => setEditItem(null),
    [setEditItem]
  );

  const onDelete = React.useCallback(
    (event) => setRemoveItem(event.dataItem),
    [setRemoveItem]
  );

  const onDeleteConfirm = React.useCallback(
    (event) => {
      onRemove({
        type: IObjectiveDataType.ACTION_ITEM,
        objectiveId: event.dataItem.ObjectiveID,
        actionItemId: event.dataItem.ActionItemID,
        actionItem: event.dataItem
      });
    },
    [taskData, setTaskData, setRemoveItem]
  );

  const onDeleteCancel = React.useCallback(
    () => setRemoveItem(null),
    [setRemoveItem]
  );



  const onDependecyCreate = React.useCallback(
    (event) => {
      // TODO - implement
      /*
      const newData = addDependency({
        dependencyData,
        fromId: event.fromId,
        toId: event.toId,
        type: event.type,
        dependencyModelFields,
        defaultDataItem: {[dependencyModelFields.id]: guid()}
      });
      setDependencyData(newData);
       */
    },
    [setDependencyData, dependencyData, dependencyModelFields]
  );

  const processedData = React.useMemo(
    () => {
      const filteredData = filterBy(taskData, dataState.filter, ganttFields.children);
      // @ts-ignore
        const sortedData = orderBy(filteredData, dataState.sort, ganttFields.children);

      return mapTree(
        sortedData,
        ganttFields.children,
        (task) => extendDataItem(task, ganttFields.children, {
          [ganttFields.isExpanded]: expandedState.includes(getTaskId(task))
        })
      );
    },
    [taskData, dataState, expandedState, ganttFields.children]
  );

  const refreshData = () => {
    const items = toGanttTasks(actionItems);
    const dependencies = toGanttDependencies(actionItems);
    setTaskData(items.valid);
    setInvalidData(items.invalid);
    setDependencyData(dependencies);
  }

  useMountEvents({
    onMounted: async () => {
      refreshData();
    },
    onChange: async () => {
      refreshData();
    },
    watchItems: [actionItems]
  });

    return (
      <>
        { hasItems(invalidData) ?
          <Alert severity="error" className="alert_empty_data">
            There are <b>{invalidData?.length}</b> out of <b>{actionItems?.length}</b> action steps without dates that are not included in the chart. <a href="javascript:void (0)" onClick={() => setShowInvalidData(!showInvalidData)}>{showInvalidData ? 'hide' : 'view'} invalid tasks</a>
            { showInvalidData ?
              <>
                {invalidData?.map((item: any, index: number) => {
                  return (
                    <Box key={index} mr={1} mt={1}>
                      {item?.Description}
                    </Box>
                  )
                })}
              </>
              : null }
          </Alert>
          : null }
        <div className={styles.gantt_container}>
          <div ref={ref}>
            <Gantt
              style={ganttStyle}

              taskData={processedData}
              taskModelFields={ganttFields}

              dependencyData={dependencyData}
              dependencyModelFields={dependencyModelFields}

              columns={columnsState}

              view={'month'}
              resizable={true}
              reorderable={true}
              sortable={true}

              // sort={dataState.sort}
              filter={dataState.filter}
              navigatable={true}

              // sort={dataState.sort}
              // filter={dataState.filter}

              onAddClick={onAdd}
              onTaskClick={onSelected}
              onRowClick={onSelected}

              onColumnResize={onColumnResize}
              onColumnReorder={onColumnReorder}
              onExpandChange={onExpandChange}
              onDataStateChange={onDataStateChange}
            >
              <GanttWeekView />
              <GanttDayView />
              <GanttMonthView />
            </Gantt>
            { showEditDialog ?
              <EditActionItem item={editItem?.dataItem}
                              isOpen={showEditDialog}
                              onClose={() => setShowEditDialog(false)}></EditActionItem>
              : null }
          </div>
        </div>
      </>
  )
}

export default ActionItemGantt;

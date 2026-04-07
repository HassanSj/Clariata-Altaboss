import React, {useState} from 'react';
import {Button, Grid, TextField, Tooltip} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import styles from "./BrowsePriorities.module.scss";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {DRAG_AND_DROP_BE, SortDirection} from "~/ui/constants/data";
import useSortable from "~/ui/hooks/useSortable";
import usePagination from "~/ui/hooks/usePagination";
import {Objective} from "~/types/api/objective";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import PriorityItem from "~/ui/components/Priorities/PriorityItem";
import {
  DEFAULT_ALL_FILTER,
  DEFAULT_NO_GROUPING,
  getDimensionsOfSuccessFilters,
  getDimensionsOfSuccessGroupings,
  getMetricsOfSuccessFilters,
  getMetricsOfSuccessGroupings,
  getObjectiveGroupingMap,
  getObjectiveGroupingOptions,
  getObjectivePersonFilters
} from "~/ui/constants/tasks";
import SelectFilter from "~/ui/components/Data/SelectFilter";
import useSearchables from "~/ui/hooks/useSearchables";
import MultiSelectFilter from '../../Data/MultiSelectFilter';
import useGroupables from '~/ui/hooks/useGroupables';

import {DndProvider} from 'react-dnd'
import {IDataItemEventConfig} from "~/types/data";
import useDraggables from "~/ui/hooks/useDraggables";
import useDataViews from "~/ui/hooks/useDataViews";
import {objectiveViews} from "~/ui/constants/objectives";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DataTableViews from "~/ui/components/Data/DataTableViews";
import useNotifications from "~/ui/hooks/useNotifications";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import EditPriorityForm from "~/ui/components/Priorities/EditPriorityFormModal";
import {isNullOrUndefined} from "~/ui/constants/utils";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';


const BrowsePriorities = () => {
  const notifications = useNotifications();
  const { objectives } = useStoreState((state) => state.objective);
  const { persons } = useStoreState((state) => state.person);
  //const { dimensionsOfLife, metricsOfSuccess } = useStoreState((state) => state.constants);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
    
  const {onRankUpdate} = useStoreActions(actions => actions.objective);

  const [showFilters, setShowFilters] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Views
  const views = useDataViews(
    objectiveViews,
    'summary',
    'Rank');

  // Drag/drop
  const draggingEnabled = true;
  const onDropUpdateEnabled = true;
  const onDropUpdate = async (items: Objective[]) => {
    await onRankUpdate(items);
    notifications.addSuccessNotification('Priority ranking updated!');
  }
  const {
    draggedItems,
    handleDropEvent,
    lastDragEvent,
    handleDragEvent,
    handleDragEnd
  } = useDraggables(
    objectives,
    'ObjectiveID',
    draggingEnabled,
    onDropUpdate,
    onDropUpdateEnabled);

  // Search
  const searchText = useUserInput("");
  const searchableItems = useSearchable(
    draggedItems,
      searchText.value,
      (item: Objective | undefined) => [`${item?.Description}`]
  );

  // Dimensions of success filters
  const dsFilters: any = getDimensionsOfSuccessFilters(dimensionsOfLife as DimensionOfLife[]);
  const dsFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const dsFilterableItems = useSearchables(
      searchableItems as Objective[],
      dsFilterValue.value,
    (item: Objective | undefined) => [String(item?.DimensionOfLifeID)]);

  // Metrics of success filters
  const msFilters: any = getMetricsOfSuccessFilters(metricsOfSuccess as MetricOfSuccess[]);
  const msFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const msFilterableItems = useSearchables(
      dsFilterableItems,
      msFilterValue.value,
    (item: Objective | undefined) => [String(item?.MetricOfSuccessID)]);

  // Person filters
  const personFilters: any = getObjectivePersonFilters(objectives, persons);
  const personFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const personFilterableItems = useSearchables(msFilterableItems, personFilterValue.value,
    (item: Objective | undefined) => [String(item?.PersonID)]);

  // Sorting
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const sortableItems = useSortable(
    personFilterableItems,
      sortDirection,
      (item: Objective | undefined) => [`${item?.Rank}`],
  );

  // Grouping
  const dimGroupingOptions: any = getDimensionsOfSuccessGroupings(dimensionsOfLife as DimensionOfLife[]);
  const [isGroupedByDimensions, setIsGroupedDimensions] = useState(false);

  const msGroupingOptions: any = getMetricsOfSuccessGroupings(metricsOfSuccess as MetricOfSuccess[]);
  const [isGroupedByMetrics, setIsGroupedByMetrics] = useState(false);

  const groupingPersons = persons && Array.isArray(persons) ? [...persons, BOTH_PERSONS_OPTION] : [BOTH_PERSONS_OPTION];
  const groupByValue = useUserInput(DEFAULT_NO_GROUPING);
  const groupingOptions = getObjectiveGroupingOptions(groupingPersons, dimensionsOfLife, metricsOfSuccess);
  const groupingMap = getObjectiveGroupingMap(groupingPersons, dimensionsOfLife, metricsOfSuccess);
  const isGrouped = () => (groupByValue.value !== DEFAULT_NO_GROUPING) && !isNullOrUndefined(groupByValue.value);
  const groupableItems = useGroupables(
    sortableItems,
    isGrouped(),
    groupByValue.value,
    groupingMap
  );

  // Pagination
  const [page, setPage] = useState(1);
  const paginator = usePagination(groupableItems, undefined);
  const handleChange = (e: any, p: number) => {
    paginator.jump(p);
  };

  // Data event config
  const eventConfig: IDataItemEventConfig = {
    onItemDragEvent: handleDragEvent,
    onItemDragEndEvent: handleDragEnd,
    onItemDropEvent: handleDropEvent,
    lastDragEvent
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card className={classnames(styles.root)}>
            <CardContent>
              <div>
                <DataTableViews views={objectiveViews} selected={views.selectedView} onSelect={views.selectView} />
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <div className={styles.filter}>
                      <TextField id="standard-basic"
                                 label="Search"
                                 placeholder="Search"
                                 fullWidth={true}
                                 {...searchText} />
                    </div>
                  </Grid>
                  <Grid item xs={3}/>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <>
                      <Tooltip title="Add Priority">
                        <Button color="primary"
                                onClick={() => setShowEditDialog(true)}>
                          Add Priority
                        </Button>
                      </Tooltip>
                      <Tooltip title="Show/Hide Filters">
                        <IconButton color={ showFilters ? 'primary' : 'default'}
                                    onClick={() => setShowFilters(!showFilters)}>
                          <Icon>filter_alt</Icon>
                        </IconButton>
                      </Tooltip>
                      {/*
                      <Tooltip title="Sort Ascending">
                        <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                    onClick={() => setSortDirection(SortDirection.ASC)}>
                          <Icon>arrow_downward</Icon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sort Descending">
                        <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                    onClick={() => setSortDirection(SortDirection.DESC)}>
                          <Icon>arrow_upward</Icon>
                        </IconButton>
                      </Tooltip>*/}
                    </>
                  </Grid>
                </Grid>
                { showFilters ?
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <div className={styles.filter}>
                        <h5 className={styles.filter_head}>Filter by dimension of Success</h5>
                        <MultiSelectFilter id="dimension_of_success_filter"
                                           label="Dimension of Life"
                                           filterValue={dsFilterValue}
                                           filterOptions={dsFilters}
                                           onUpdate={(v) => dsFilterValue.setValue(v)} />
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className={styles.filter}>
                        <h5 className={styles.filter_head}>Filter by metric</h5>
                        <MultiSelectFilter id="metric_of_success_filter"
                                           label="Metric"
                                           filterValue={msFilterValue}
                                           filterOptions={msFilters}
                                           onUpdate={(v) => msFilterValue.setValue(v)} />
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className={styles.filter}>
                        <h5 className={styles.filter_head}>Filter by lead person</h5>
                        <MultiSelectFilter id="person_filter"
                                           label="Person"
                                           filterValue={personFilterValue}
                                           filterOptions={personFilters}
                                           onUpdate={(v) => personFilterValue.setValue(v)} />
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <div className={styles.filter}>
                        <h5 className={styles.filter_head}>Group by</h5>
                        <SelectFilter label="Group by"
                                      filterValue={groupByValue}
                                      filterOptions={groupingOptions}
                                      noValue={DEFAULT_NO_GROUPING}
                                      noValueText="No grouping"
                                      icon="keyboard_arrow_down" />
                      </div>
                    </Grid>
                  </Grid>
                : null }
              </div>
              <DataTableHeaders headers={views.getCurrentHeaders()} />
              <DndProvider backend={DRAG_AND_DROP_BE}>
                <DataWrapper isGrouped={isGrouped()}
                             paginator={paginator}
                             keyLabel="ObjectiveID"
                             propLabel="objective"
                             views={views}
                             component={PriorityItem}
                             eventConfig={eventConfig} />
              </DndProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      { showEditDialog ?
        <EditPriorityForm isOpen={showEditDialog}
                          onClose={() => setShowEditDialog(false)}></EditPriorityForm>
        : null }
    </>
  );
};

export default BrowsePriorities;

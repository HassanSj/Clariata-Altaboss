import React, {useState} from 'react';
import {Button, Grid, TextField, Tooltip} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import styles from "./BrowseActionItems.module.scss";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import {useStoreState} from "~/store/hooks";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {SortDirection} from "~/ui/constants/data";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
import ActionItem from "~/ui/components/ActionItems/ActionItem";
import {
  DEFAULT_ALL_FILTER,
  DEFAULT_NO_GROUPING,
  getActionItemGroupingMap,
  getActionItemGroupingOptions,
  getActionItemObjectiveFilters,
  getActionItemPersonFilters,
  getActionItemStatus,
  getActionItemStatuses
} from "~/ui/constants/tasks";
import SelectFilter from "~/ui/components/Data/SelectFilter";
import useSearchables from "~/ui/hooks/useSearchables";
import MultiSelectFilter from "~/ui/components/Data/MultiSelectFilter";
import useGroupables from '~/ui/hooks/useGroupables';
import ActionItemScheduler from "~/ui/components/ActionItems/ActionItemScheduler";
import ActionItemGantt from '../ActionItemGantt';
import useDataViews from "~/ui/hooks/useDataViews";
import {actionItemViews} from "~/ui/constants/actionitems";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DataTableViews from "~/ui/components/Data/DataTableViews";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {isNullOrUndefined} from "~/ui/constants/utils";
import useSortableDataTableHeaders from "~/ui/hooks/useSortableDataTableHeaders";
import { getAccessToken } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';

const BrowseActionItems = () => {
  const { actionItems, objectives } = useStoreState((state) => state.objective);
  const { persons } = useStoreState((state) => state.person);
  //const { dimensionsOfLife, metricsOfSuccess } = useStoreState((state) => state.constants);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState('LIST');
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Views
  const views = useDataViews(
    actionItemViews,
    'list',
    'Description');

  // Search and filters.
  const searchText = useUserInput("");
  const searchableItems = useSearchable(
    actionItems,
    searchText.value,
    (item: ActionItemModel | undefined) => [`${item?.Description}`]
  );

  // Objective filters
  const objectiveFilters: any = getActionItemObjectiveFilters(searchableItems as ActionItemModel[], objectives);
  const objectiveFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const objectiveFilterableItems = useSearchables(searchableItems as ActionItemModel[], objectiveFilterValue.value,
    (item: ActionItemModel | undefined) => [String(item?.ObjectiveID)]);

  // Person filters
  const personFilters: any = getActionItemPersonFilters(objectiveFilterableItems, persons);
  const personFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const personFilterableItems = useSearchables(objectiveFilterableItems, personFilterValue.value,
    (item: ActionItemModel | undefined) => [String(item?.LeadPerson)]);

  // Status filters
  const statusFilters: any = getActionItemStatuses();
  const statusFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const statusFilterableItems = useSearchables(personFilterableItems, statusFilterValue.value,
    (item: ActionItemModel | undefined) => [String(getActionItemStatus(item))]);

  // Sorting
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const sortableItems = useSortableDataTableHeaders(
    statusFilterableItems,
    'action_items',
    sortDirection,
    'Description',
    views?.selectedView
  );

  // Grouping
  const groupingPersons = persons && Array.isArray(persons) ? [...persons, BOTH_PERSONS_OPTION] : [BOTH_PERSONS_OPTION];
  const groupByValue = useUserInput(DEFAULT_NO_GROUPING);
  const groupingOptions = getActionItemGroupingOptions(groupingPersons, objectives);
  const groupingMap = getActionItemGroupingMap(groupingPersons, objectives);
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

  // Drag and drop
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      paginator.currentData(),
      result.source.index,
      result.destination.index
    );

    // TODO - update state
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h2 className="text-center">Coming soon</h2>
          {/*<Card className={classnames(styles.root)}>*/}
          {/*  <CardContent>*/}
          {/*    <div className={styles.filters}>*/}
          {/*      <DataTableViews views={actionItemViews} selected={views.selectedView} onSelect={views.selectView} />*/}
          {/*      <Grid container spacing={1}>*/}
          {/*        <Grid item xs={3}>*/}
          {/*          <div className={styles.filter}>*/}
          {/*            <TextField id="standard-basic"*/}
          {/*                       label="Search"*/}
          {/*                       placeholder="Search"*/}
          {/*                       fullWidth={true}*/}
          {/*                       {...searchText} />*/}
          {/*          </div>*/}
          {/*        </Grid>*/}
          {/*        <Grid item xs={3}>*/}

          {/*        </Grid>*/}
          {/*        <Grid container item xs={6} justifyContent="flex-end">*/}
          {/*          { (selectedView==='LIST') ?*/}
          {/*              <>*/}
          {/*                <Tooltip title="Add Task">*/}
          {/*                  <Button color="primary"*/}
          {/*                          onClick={() => setShowEditDialog(true)}>*/}
          {/*                    Add Task*/}
          {/*                  </Button>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title="Show/Hide Filters">*/}
          {/*                  <IconButton color={ showFilters ? 'primary' : 'default'}*/}
          {/*                              onClick={() => setShowFilters(!showFilters)}>*/}
          {/*                    <Icon>filter_alt</Icon>*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title="Sort Ascending">*/}
          {/*                  <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}*/}
          {/*                              onClick={() => setSortDirection(SortDirection.ASC)}>*/}
          {/*                    <Icon>arrow_downward</Icon>*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*                <Tooltip title="Sort Descending">*/}
          {/*                  <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}*/}
          {/*                              onClick={() => setSortDirection(SortDirection.DESC)}>*/}
          {/*                    <Icon>arrow_upward</Icon>*/}
          {/*                  </IconButton>*/}
          {/*                </Tooltip>*/}
          {/*              </>*/}
          {/*              : null }*/}
          {/*        </Grid>*/}
          {/*      </Grid>*/}
          {/*      { showFilters ?*/}
          {/*        <Grid container spacing={1}>*/}
          {/*          <Grid item xs={3}>*/}
          {/*            <div className={styles.filter}>*/}
          {/*              <h5 className={styles.filter_head}>Filter by objective</h5>*/}
          {/*              <MultiSelectFilter label="Objective"*/}
          {/*                                 filterValue={objectiveFilterValue}*/}
          {/*                                 filterOptions={objectiveFilters}*/}
          {/*                                 onUpdate={(v) => objectiveFilterValue.setValue(v)} />*/}
          {/*            </div>*/}
          {/*          </Grid>*/}
          {/*          <Grid item xs={3}>*/}
          {/*            <div className={styles.filter}>*/}
          {/*              <h5 className={styles.filter_head}>Filter by person</h5>*/}
          {/*              <MultiSelectFilter label="Person"*/}
          {/*                                 filterValue={personFilterValue}*/}
          {/*                                 filterOptions={personFilters}*/}
          {/*                                 onUpdate={(v) => personFilterValue.setValue(v)} />*/}
          {/*            </div>*/}

          {/*          </Grid>*/}
          {/*          <Grid item xs={3}>*/}
          {/*            <div className={styles.filter}>*/}
          {/*              <h5 className={styles.filter_head}>Filter by status</h5>*/}
          {/*              <MultiSelectFilter label="Status"*/}
          {/*                                 filterValue={statusFilterValue}*/}
          {/*                                 filterOptions={statusFilters}*/}
          {/*                                 onUpdate={(v) => statusFilterValue.setValue(v)} />*/}
          {/*            </div>*/}

          {/*          </Grid>*/}
          {/*          <Grid item xs={3}>*/}
          {/*            { (selectedView==='LIST') ?*/}
          {/*              <div className={styles.filter}>*/}
          {/*                <h5 className={styles.filter_head}>Group by</h5>*/}
          {/*                <SelectFilter label="Group by"*/}
          {/*                              filterValue={groupByValue}*/}
          {/*                              filterOptions={groupingOptions}*/}
          {/*                              noValue={DEFAULT_NO_GROUPING}*/}
          {/*                              noValueText="No grouping"*/}
          {/*                              icon="keyboard_arrow_down"/>*/}
          {/*              </div>*/}
          {/*              : null }*/}
          {/*          </Grid>*/}
          {/*        </Grid>*/}
          {/*        : null }*/}
          {/*    </div>*/}
          {/*    { (views?.selectedView?.id==='list') ?*/}
          {/*      <>*/}
          {/*        <DataTableHeaders headers={views.getCurrentHeaders()}*/}
          {/*                          tableId="action_items" />*/}
          {/*        <DataWrapper*/}
          {/*          isGrouped={isGrouped()}*/}
          {/*          paginator={paginator}*/}
          {/*          keyLabel="ActionItemID"*/}
          {/*          propLabel="item"*/}
          {/*          component={ActionItem} />*/}
          {/*      </>*/}
          {/*    : null }*/}
          {/*    { (views?.selectedView?.id==='gantt') ?*/}
          {/*      <ActionItemGantt actionItems={paginator.currentData()} />*/}
          {/*    : null }*/}
          {/*    { (views?.selectedView?.id==='scheduler') ?*/}
          {/*      <ActionItemScheduler actionItems={paginator.currentData()} />*/}
          {/*    : null }*/}
          {/*  </CardContent>*/}
          {/*</Card>*/}
        </Grid>
      </Grid>
      { showEditDialog ?
        <EditActionItem isOpen={showEditDialog}
                        onClose={() => setShowEditDialog(false)}></EditActionItem>
        : null }
    </>
  );
};

export default BrowseActionItems;

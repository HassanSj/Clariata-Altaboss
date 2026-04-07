import React, {useEffect, useState} from 'react';
import {
    Button,
    ButtonGroup,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Tooltip
} from "@material-ui/core";
import Modal from "~/ui/components/Dialogs/Modal";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import styles from "./DirectionPriorities.module.scss";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import usePagination from "~/ui/hooks/usePagination";
import {Objective} from "~/types/api/objective";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import {
    DEFAULT_ALL_FILTER,
    DEFAULT_NO_GROUPING, getAssistanceFilters,
    getDimensionsOfSuccessFilters,
    getMetricsOfSuccessFilters,
    getObjectiveGroupingMap,
    getObjectiveGroupingOptions,
    getObjectivePersonFilters, getTimeframeFilters
} from "~/ui/constants/tasks";
import SelectFilter from "~/ui/components/Data/SelectFilter";
import useSearchables from "~/ui/hooks/useSearchables";

import useGroupables from '~/ui/hooks/useGroupables';
import {IDataItemEventConfig, IDataTableView} from "~/types/data";
import useDraggables from "~/ui/hooks/useDraggables";
import useDataViews from "~/ui/hooks/useDataViews";
import {objectiveViews} from "~/ui/constants/objectives";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DataTableViews from "~/ui/components/Data/DataTableViews";
import useNotifications from "~/ui/hooks/useNotifications";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import EditPriorityForm from "~/ui/components/Priorities/EditPriorityFormModal";
import MultiSelectFilter from '~/ui/components/Data/MultiSelectFilter';
import PriorityItemTemplate from "~/ui/components/Priorities/PriorityItemTemplate";
import EditPriorityFormCard from "~/ui/components/Priorities/EditPriorityFormCard";
import DirectionStrategy from "~/ui/components/Modules/Direction/DirectionStrategy";
import useDatePeriodFilterable from "~/ui/hooks/useDatePeriodFilterable";
import {SortDirection} from "~/ui/constants/data";
import useSortableDataTableHeaders from "~/ui/hooks/useSortableDataTableHeaders";
import {isNullOrUndefined} from "~/ui/constants/utils";
import SelectPaginationBar from "~/ui/components/Forms/SelectPaginationBar";
import ReportButton from "~/ui/components/Button";
import SelectDate from "~/ui/components/Forms/SelectDate";
import useRangeSearchables from "~/ui/hooks/useRangeSearchables";
import api from "~/services/api";
import useMountEvents from "~/ui/hooks/useMountEvents";
import TaskItemTemplate from '~/ui/components/Priorities/TaskItemTemplate';
import {DirectionTask} from '~/types/api/directionTask';
import {populateHouseholdDirectionTaskProgress} from '~/ui/constants/household';
import {useRouter} from "next/router";
import { ReportDefinition, ReportType, ReportTypes } from '~/ui/constants/reports';
import useReports from '~/ui/hooks/useReports';
import ReportViewer from '~/ui/components/Reports/ReportViewer';
import StrategyReportModal from '~/ui/components/Dialogs/StrategyReportModal';
import { getAccessToken, getSessionGUID } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';
import { Timeframe } from '~/types/api/timeframe';
import Link from 'next/dist/client/link';
import paths from "~/ui/constants/paths";
import { Alert } from '@material-ui/lab';

const DirectionPriorities = () => {
    const [rtaReport, setRtaReport] = useState<ReportType>();
    const [curationReport, setCurationReport] = useState<ReportType>();    
    const [strategyReport, setStrategyReport] = useState<ReportType>();    
    const notifications = useNotifications();
    const router = useRouter();
    const {tabName, tabId} = router.query;
    console.log("Tab Name :", String(tabName), " Tab ID :", String(tabId))
    const {objectives, selectedObjective} = useStoreState((state) => state.objective);
    const {persons} = useStoreState((state) => state.person);
    //const {dimensionsOfLife, metricsOfSuccess, timeframes} = useStoreState((state) => state.constants);
    const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
    const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
    const { data: timeframes } = useSWR<Timeframe[]>([`${process.env.NEXT_PUBLIC_API_URL}/timeframe/list`, getAccessToken()], fetcher);
    const {onRankUpdate} = useStoreActions(actions => actions.objective);
    const {selectedHousehold} = useStoreState((state) => state.household);
    console.log("Selected Household Id :", selectedHousehold?.HouseholdID);

    const [strategyTab, setStrategyTab] = useState<number>(0);

    const [enableDrag, setEnableDrag] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCreatePriorityDialog, setShowCreatePriorityDialog] = useState(false);
    const [filtersKey, setFiltersKey] = useState<number>(0)
    const [showActionModal, setShowActionModal] = useState<boolean>(false);
    const [showResourceModal, setShowResourceModal] = React.useState<boolean>(false);

    const increaseKey = () => setFiltersKey(filtersKey + 1)

    const {currentTableId} = useStoreState(state => state.layout);
    const {onSort} = useStoreActions(actions => actions.layout);

    const isDragEnables = () => (views?.selectedView?.id === 'timing' && enableDrag)

    const {downloadPdfReport,
            selectedReport,
            selectedReportProps,
            showReport,
            viewReport,
            hideReport,
            getReportRoutePath
        } = useReports();

    useMountEvents({
        onMounted: async () => {
            // setChecklist(router.query.checklist === 'true');
            const sessionGUID = getSessionGUID()
            await api.session.get(sessionGUID)

            // update direction checklist
            await populateHouseholdDirectionTaskProgress(selectedHousehold);
        }
    });

    // Filtering and sorting
    const isFiltersAndSortingDisabled = () => {
        return views?.selectedView?.disableSorting && views?.selectedView?.disableFiltering;
    }

    // Views
    const views = useDataViews(
        objectiveViews,
        tabId ? String(tabId) : 'timing',
        tabName ? String(tabName) : 'Plan');

    useEffect(() => {
        const viewID = router.query.view
        if (viewID) {
            views.selectViewById(viewID as string)
        }
    }, [router.query])

    // Drag/drop
    const onDropUpdateEnabled = true;
    const onDropUpdate = async (items: Objective[]) => {
        notifications.toggleLoading(true);
        await onRankUpdate(items);
        notifications.toggleLoading(false);
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
        (enableDrag),
        onDropUpdate,
        onDropUpdateEnabled);

    // Search
    const searchText = useUserInput("");
    const searchableItems = useSearchable(
        draggedItems,
        searchText.value,
        (item: Objective | undefined) => [`${item?.Description}`]
    );

    // Date filter
    const dateFilterValue = useUserInput(0);
    const dateFilterableItems = useDatePeriodFilterable(
        searchableItems as Objective[],
        'StartDate',
        dateFilterValue.value);

    // Timing filter
    const tmFilters = getTimeframeFilters(timeframes as Timeframe[]);
    const tmFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const tmFilterableItems = useSearchables(
        dateFilterableItems,
        tmFilterValue.value,
        (item: Objective | undefined) => [String(item?.TimeframeID)]
    );

    // Assistance filter
    const asFilters = getAssistanceFilters();
    const asFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const asFilterableItems = useSearchables(
        tmFilterableItems,
        asFilterValue.value,
        (item: Objective | undefined) => [item?.AssistanceNeeded ? "3" : "2"]
    );


    // Dimensions of success filters
    const dsFilters: any = getDimensionsOfSuccessFilters(dimensionsOfLife as DimensionOfLife[]);
    const dsFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const dsFilterableItems = useSearchables(
        asFilterableItems,
        dsFilterValue.value,
        (item: Objective | undefined) => [String(item?.DimensionOfLifeID)]);

    // Date range
    const dateRangeStartValue = useUserInput(null);
    const dateRangeEndValue = useUserInput(null);
    // @ts-ignore
    const dateRangeFilteredItems = useRangeSearchables(dsFilterableItems, {
        start: dateRangeStartValue.value,
        end: dateRangeEndValue.value
        // @ts-ignore
    }, (item?: Objective) => new Date(item?.StartDate))

    // Metrics of success filters
    const msFilters: any = getMetricsOfSuccessFilters(metricsOfSuccess as MetricOfSuccess[]);
    const msFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const msFilterableItems = useSearchables(
        dateRangeFilteredItems,
        msFilterValue.value,
        (item: Objective | undefined) => [String(item?.MetricOfSuccessID)]);

    // Person filters
    const personFilters: any = getObjectivePersonFilters(objectives, persons);
    const personFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const personFilterableItems = useSearchables(msFilterableItems, personFilterValue.value,
        (item: Objective | undefined) => [String(item?.PersonID)]);

    // Grouping
    const groupingPersons = persons && Array.isArray(persons) ? [...persons, BOTH_PERSONS_OPTION] : [BOTH_PERSONS_OPTION];
    const groupByValue = useUserInput(DEFAULT_NO_GROUPING);
    const groupingOptions = getObjectiveGroupingOptions(groupingPersons, dimensionsOfLife, metricsOfSuccess, timeframes);
    const groupingMap = getObjectiveGroupingMap(groupingPersons, dimensionsOfLife, metricsOfSuccess, timeframes);
    const isGrouped = () => (groupByValue.value !== DEFAULT_NO_GROUPING) && !isNullOrUndefined(groupByValue.value);
    const groupableItems = useGroupables(
        personFilterableItems,
        isGrouped(),
        groupByValue.value,
        groupingMap
    );

    // Sorting
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
    const sortableItems = useSortableDataTableHeaders(
        groupableItems,
        'direction_tasks',
        sortDirection,
        'Description',
        views?.selectedView
    );

    const sortableTasks = useSortableDataTableHeaders(
        selectedHousehold?.DirectionProgress as DirectionTask[],
        'direction_tasks',
        sortDirection,
        'Task',
        views?.selectedView
    );

    let clearAllCheckBoxes=async()=>{
        
        let ListOfDirectionProgress =await api.directionprogress.list(selectedHousehold?.HouseholdID)
        let {data}:any = ListOfDirectionProgress
        data.map(async(d:any,i:number)=>{
            await api.directionprogress.remove( selectedHousehold?.HouseholdID,d.TaskID as number)
            await populateHouseholdDirectionTaskProgress(selectedHousehold);
        })
      await window.location.reload();
      
    }

    // Pagination
    const paginator = usePagination(isFiltersAndSortingDisabled() ? draggedItems : sortableItems, 20);
    const paginatorDirectionTasks = usePagination(sortableTasks, 20);


    // Data event config
    const eventConfig: IDataItemEventConfig = {
        onItemDragEvent: handleDragEvent,
        onItemDragEndEvent: handleDragEnd,
        onItemDropEvent: handleDropEvent,
        lastDragEvent
    };

    const [lastDateValue, setLastDateValue] = useState(null)


    const resetFilters = () => {
        dsFilterValue.setValue(DEFAULT_ALL_FILTER);
        msFilterValue.setValue(DEFAULT_ALL_FILTER);
        personFilterValue.setValue(DEFAULT_ALL_FILTER);
        groupByValue.setValue(undefined);
        tmFilterValue.setValue(DEFAULT_ALL_FILTER);
        asFilterValue.setValue(DEFAULT_ALL_FILTER);
        dateRangeStartValue.setValue(null);
        dateRangeEndValue.setValue(null);

        increaseKey()
    }
    const handleRTAReportChange = (e: any) => {
        setRtaReport(e?.target?.value);
    };

    const handleCurationReportChange = (e: any) => {
        setCurationReport(e?.target?.value);
    };

    const handleStrategyReportChange = (e: any) => {
        setStrategyReport(e?.target?.value);
    };

    const handleRoute = (moduleType: string) => {
        let reportType:any;
        if(moduleType === "RTA" && rtaReport){
            reportType= rtaReport;
        }
        if(moduleType === "Curation" && curationReport){
            reportType= curationReport;
        }
        if(moduleType === "Strategy" && strategyReport){
          if(strategyReport === "ACTION_PLAN_SUMMARY_QUARTER"){
            setShowActionModal(true)
            return;
          }
            reportType= strategyReport;
        }
        const pathName = getReportRoutePath(reportType);
        router.push(pathName);
    }
    
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Card className={classnames(styles.root)}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                  <div className={classnames(styles.header_bg)} />
                  </Grid>
                  <Grid item xs={4}>
                  <div style={{marginTop:"102px"}}>
                  {/* <Alert severity="info" style={{width:"52px"}}>
                  </Alert> */}
                  <p>
                      Bring order and logic to what needs to be done to pursue what is most important.
                      How will the family achieve their priorities? What needs to be done to make dreams
                      real? As each priority is curated, a strategic plan is developed to help the family
                      reach their goals. The Direction step of the process establishes the plan for success.
                  </p>
                  </div>
                  </Grid>
                  <Grid item xs={5}>
                  <div style={{ textAlign: 'right', marginTop: '111px' , marginRight:"45px"}}>
                  <Link
                    href={{
                      pathname: paths.MODULE_RESOURCES,
                      query: { module: 'Direction' },
                    }}
                    passHref
                  >
                    <a rel="noopener noreferrer" target="_blank">
                      <Button title="Resources" color="primary" size="large" variant="contained">
                        Checklist/Resources
                      </Button>
                    </a>
                  </Link>
                </div>
                  </Grid>
                </Grid>
                {/* <div className={classnames('card-header-image', styles.header_bg)} /> */}
                
                <DataTableViews
                  views={objectiveViews}
                  selected={views.selectedView}
                  onSelect={(view?: IDataTableView) => {
                    views.selectView(view);
                    if (view?.id === 'timing') {
                      setLastDateValue(dateFilterValue.value);
                      dateFilterValue.setValue(0);
                    } else if (view?.id === 'pre_curate') {
                      if (lastDateValue) dateFilterValue.setValue(lastDateValue);
                    }
                    router.push({query: {tabName: view?.name, tabId : view?.id}})
                  }}
                />
                {views?.selectedView?.id === 'summary' ||
                views?.selectedView?.id === 'timing' ||
                // || views?.selectedView?.id === 'curate'
                views?.selectedView?.id === 'pre_curate' ? (
                  <div>
                    <Grid container spacing={1}>
                      <Grid item xs={3}>
                        {!isFiltersAndSortingDisabled() ? (
                          <div className={styles.filter}>
                            <TextField
                              {...searchText}
                              id="standard-basic"
                              label="Search"
                              placeholder="Search"
                              fullWidth={true}
                            />
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item xs={3} />
                      <Grid container item xs={6} justifyContent="flex-end">
                        <>
                          {!isFiltersAndSortingDisabled() ? (
                            <Tooltip title="Show/Hide Filters">
                              <IconButton
                                color={showFilters ? 'primary' : 'default'}
                                onClick={() => {
                                  if (showFilters) resetFilters();
                                  setShowFilters(!showFilters);
                                }}
                              >
                                <Icon>filter_alt</Icon>
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </>
                      </Grid>
                    </Grid>
                    {showFilters && !isFiltersAndSortingDisabled() ? (
                      <div key={filtersKey}>
                        <Grid container spacing={1}>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Filter by Dimension of Life</h5>
                              <MultiSelectFilter
                                id="dimension_of_success_filter"
                                label="Dimension of Life"
                                filterValue={dsFilterValue}
                                filterOptions={dsFilters}
                                onUpdate={(v: any) => dsFilterValue.setValue(v)}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Filter by Metric of Success</h5>
                              <MultiSelectFilter
                                id="metric_of_success_filter"
                                label="Metric"
                                filterValue={msFilterValue}
                                filterOptions={msFilters}
                                onUpdate={(v: any) => msFilterValue.setValue(v)}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Filter by Client</h5>
                              <MultiSelectFilter
                                id="person_filter"
                                label="Person"
                                filterValue={personFilterValue}
                                filterOptions={personFilters}
                                onUpdate={(v: any) => personFilterValue.setValue(v)}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Group by</h5>
                              <SelectFilter
                                label="Group by"
                                filterValue={groupByValue}
                                filterOptions={groupingOptions}
                                noValue={DEFAULT_NO_GROUPING}
                                noValueText="No grouping"
                                icon="keyboard_arrow_down"
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Filter by timing</h5>
                              <MultiSelectFilter
                                id="timing_filter"
                                label="Timing"
                                filterValue={tmFilterValue}
                                filterOptions={tmFilters}
                                onUpdate={(v: any) => tmFilterValue.setValue(v)}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Filter by assistance</h5>
                              <MultiSelectFilter
                                id={'assistance_filter'}
                                label={'Assistance'}
                                filterValue={asFilterValue}
                                filterOptions={asFilters}
                                onUpdate={(v: any) => asFilterValue.setValue(v)}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Start date after</h5>
                              <SelectDate
                                type="date"
                                value={dateRangeStartValue}
                                field={{ value: dateRangeStartValue.value }}
                                placeholder="Start date"
                                shouldUseState={false}
                                label="Start Date"
                                onCustomChange={(v: any) => {
                                  dateRangeStartValue.setValue(v.value);
                                }}
                              />
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div className={styles.filter}>
                              <h5 className={styles.filter_head}>Start date before</h5>
                              <SelectDate
                                type="date"
                                value={dateRangeEndValue}
                                field={{ value: dateRangeEndValue.value }}
                                placeholder="Start date"
                                shouldUseState={false}
                                label="Start Date"
                                onCustomChange={(v: any) => dateRangeEndValue.setValue(v.value)}
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container className="p-20">
                          <Grid item xs={12} className="text-right">
                            <Button variant="contained" onClick={resetFilters}>
                              Clear
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {views?.selectedView?.id === 'summary' || views?.selectedView?.id === 'timing' ? (
                  <Grid container spacing={1}>
                    <Grid item xs={7}></Grid>
                    <Grid item xs={4}>
                      <div
                        style={{
                          marginLeft: '220px',
                          marginRight: 'auto',
                          width: '316px',
                        }}
                      >
                        <InputLabel id="demo-simple-select-label" style={{ marginLeft: '5px' }}>
                          Select a Report
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          fullWidth={true}
                          style={{ height: '40px', borderRadius: '5px', backgroundColor: 'white' }}
                          onChange={handleRTAReportChange}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            getContentAnchorEl: null,
                          }}
                          value={rtaReport}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected: any) => {
                            return rtaReport?.split("_")?.join(" ");
                          }}
                        >
                          {Object.keys(ReportTypes)
                            ?.filter(
                              reportKey => ReportTypes[reportKey]?.direction && !ReportTypes[reportKey]?.editable,
                            )
                            ?.map((reportKey: any, index: number) => {
                              const report: ReportDefinition = ReportTypes[reportKey];
                              if (
                                report.type !== ReportType.PRIORITY_RANKING_WORKSHEET &&
                                report.type !== ReportType.PRIORITY_RANKING
                              ) {
                              } else {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={report?.type}
                                    selected={report?.type === report?.type ? true : false}
                                  >
                                    <ListItemText primary={report?.type?.split("_")?.join(" ")} />
                                  </MenuItem>
                                );
                              }
                            })}
                        </Select>
                      </div>
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => handleRoute('RTA')}
                        style={{ width: '100px', margin: '17px 2px 3px -2px' }}
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                ) : null}
                {views?.selectedView?.id === 'curate' ? (
                  <Grid container spacing={1}>
                    <Grid item xs={7}></Grid>
                    <Grid item xs={4}>
                      <div
                        style={{
                          marginLeft: '220px',
                          marginRight: 'auto',
                          width: '316px',
                        }}
                      >
                        <InputLabel id="demo-simple-select-label" style={{ marginLeft: '5px' }}>
                          Select a Report
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          fullWidth={true}
                          style={{ height: '40px', borderRadius: '5px', backgroundColor: 'white' }}
                          onChange={handleCurationReportChange}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            getContentAnchorEl: null,
                          }}
                          value={curationReport}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected: any) => {
                            return curationReport?.split("_")?.join(" ");
                          }}
                        >
                          {Object.keys(ReportTypes)
                            ?.filter(
                              reportKey => ReportTypes[reportKey]?.direction && !ReportTypes[reportKey]?.editable,
                            )
                            ?.map((reportKey: any, index: number) => {
                              const report: ReportDefinition = ReportTypes[reportKey];
                              if (
                                report.type !== ReportType.CURATION_INTERVIEW_WORKSHEET &&
                                report.type !== ReportType.CURATION_WORKSHEET &&
                                report.type !== ReportType.CURATION_SUMMARY
                              ) {
                              } else {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={report?.type}
                                    selected={report?.type === report?.type ? true : false}
                                  >
                                    <ListItemText primary={report?.type?.split("_")?.join(" ")} />
                                  </MenuItem>
                                );
                              }
                            })}
                        </Select>
                      </div>
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => handleRoute('Curation')}
                        style={{ width: '100px', margin: '17px 2px 3px -2px' }}
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                ) : null}
                {views?.selectedView?.id === 'strategy' ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={5} />
                      <Grid item xs={2} style={{marginTop:"15px"}}>
                        <ButtonGroup fullWidth={true} color="primary" variant="contained">
                          <Button color={strategyTab === 0 ? 'primary' : 'default'} onClick={() => setStrategyTab(0)}>
                            Scheduler
                          </Button>
                          <Button color={strategyTab === 1 ? 'primary' : 'default'} onClick={() => setStrategyTab(1)}>
                            Summary
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          style={{
                            marginLeft: '220px',
                            marginRight: 'auto',
                            width: '316px',
                          }}
                        >
                          <InputLabel id="demo-simple-select-label" style={{ marginLeft: '5px' }}>
                            Select a Report
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth={true}
                            style={{ height: '40px', borderRadius: '5px', backgroundColor: 'white' }}
                            onChange={handleStrategyReportChange}
                            MenuProps={{
                              anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                              },
                              transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                              },
                              getContentAnchorEl: null,
                            }}
                            value={strategyReport}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected: any) => {
                              return strategyReport?.split("_")?.join(" ");
                            }}
                          >
                            {Object.keys(ReportTypes)
                              ?.filter(
                                reportKey => ReportTypes[reportKey]?.direction && !ReportTypes[reportKey]?.editable,
                              )
                              ?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if (
                                  report.type !== ReportType.ACTION_STEP_WORKSHEET &&
                                  report.type !== ReportType.ACTION_STEP_REPORT &&
                                  report.type !== ReportType.GANTT_CHART &&
                                  report.type !== ReportType.ACTION_PLAN_SUMMARY_QUARTER
                                ) {
                                } else {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={report?.type}
                                      selected={report?.type === report?.type ? true : false}
                                    >
                                      <ListItemText primary={report?.type?.split("_")?.join(" ")} />
                                    </MenuItem>
                                  );
                                }
                              })}
                          </Select>
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          onClick={() => handleRoute('Strategy')}
                          style={{ width: '100px', margin: '17px 2px 3px -2px' }}
                        >
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
                {views?.selectedView?.id === 'pre_curate' ? (
                  <Grid container spacing={1}>
                    <Grid item xs={3} />
                    <Grid item xs={6}>
                      <div className="p-15">
                        <ButtonGroup
                          variant="text"
                          color="primary"
                          aria-label="text primary button group"
                          fullWidth={true}
                        >
                          <Button
                            variant={tmFilterValue.value === 0 ? 'contained' : 'text'}
                            onClick={() => tmFilterValue.setValue(0)}
                          >
                            All
                          </Button>
                          <Button
                            variant={tmFilterValue.value[0] === 1 ? 'contained' : 'text'}
                            onClick={() => tmFilterValue.setValue([1])}
                          >
                            Now
                          </Button>
                          <Button
                            variant={tmFilterValue.value[0] === 2 ? 'contained' : 'text'}
                            onClick={() => tmFilterValue.setValue([2])}
                          >
                            Later
                          </Button>
                          <Button
                            variant={tmFilterValue.value[0] === 3 ? 'contained' : 'text'}
                            onClick={() => tmFilterValue.setValue([3])}
                          >
                            Long Term
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Grid>
                    <Grid item xs={3} />
                  </Grid>
                ) : null}
                {views?.selectedView?.id === 'curate' ? (
                  <div>
                    <SelectPaginationBar items={objectives} showSelectedOnly={true} />
                    {selectedObjective ? (
                      <EditPriorityFormCard
                        onClose={() => {
                          setShowEditDialog(false);
                        }}
                      />
                    ) : null}
                  </div>
                ) : null}
                {views?.selectedView?.id === 'summary' ||
                views?.selectedView?.id === 'timing' ||
                views?.selectedView?.id === 'pre_curate' ? (
                  <div className={styles[views?.selectedView?.id + '_wrapper']}>
                    {views?.selectedView?.id === 'timing' ? (
                      <Grid container justifyContent="flex-end">
                        {/* <Grid item xs={10} ></Grid>
                    <Grid item xs={1} > */}
                        <Tooltip title="Add Priority">
                          <IconButton
                            color={'default'}
                            onClick={() => {
                              setShowCreatePriorityDialog(true);
                            }}
                          >
                            <Icon>add</Icon>
                          </IconButton>
                        </Tooltip>
                        {/* </Grid>
                    <Grid item xs={1}> */}
                        <Tooltip title="Lock/Unlock Drag and Drop">
                          <IconButton
                            color={'default'}
                            onClick={() => {
                              const oldEnable = enableDrag;
                              setEnableDrag(!oldEnable);
                              if (!oldEnable) {
                                onSort({
                                  currentTableId,
                                  sortDirection,
                                  sortByField: 'Rank',
                                  selectedHeader: views?.selectedView?.headers![0],
                                });
                              }
                            }}
                          >
                            <Icon>{enableDrag ? 'lock_open_outlined' : 'lock_outlined'}</Icon>
                          </IconButton>
                        </Tooltip>
                        {/* </Grid> */}
                      </Grid>
                    ) : null}
                    <DataTableHeaders
                      dragEnabled={isDragEnables()}
                      headers={views?.getCurrentHeaders()}
                      collapse={!isDragEnables()}
                      sortEnabled={!isDragEnables()}
                      tableId="direction_tasks"
                    />
                    <DataWrapper
                      isGrouped={isGrouped()}
                      paginator={paginator}
                      keyLabel="ObjectiveID"
                      propLabel="objective"
                      views={views}
                      component={PriorityItemTemplate}
                      eventConfig={eventConfig}
                      isDragging={isDragEnables()}
                    />
                  </div>
                ) : null}
                {views?.selectedView?.id === 'strategy' ? (
                  <div>
                    <DirectionStrategy item={selectedObjective} items={paginator?.currentData()} tab={strategyTab} />
                  </div>
                ) : null}
                {views?.selectedView?.id === 'checklist' ? (
                  <div>
                    <Button
                      onClick={() => {
                        clearAllCheckBoxes();
                      }}
                      variant="text"
                    >
                      Clear all checkboxes
                    </Button>
                    <DataTableHeaders
                      dragEnabled={false}
                      headers={views?.getCurrentHeaders()}
                      collapse={true}
                      sortEnabled={false}
                      tableId="direction_tasks"
                    />
                    <DataWrapper
                      isGrouped={false}
                      paginator={paginatorDirectionTasks}
                      keyLabel="TaskID"
                      propLabel="directionTask"
                      views={views}
                      component={TaskItemTemplate}
                      eventConfig={eventConfig}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {showEditDialog ? (
          <EditPriorityForm
            item={selectedObjective}
            isOpen={showEditDialog}
            onClose={() => {
              setShowEditDialog(false);
            }}
          />
        ) : null}
        {showCreatePriorityDialog ? (
          <EditPriorityForm
            isOpen={showCreatePriorityDialog}
            onClose={() => {
              setShowCreatePriorityDialog(false);
            }}
          />
        ) : null}
        {selectedReport ? (
          <Modal title="" handleClose={() => hideReport()} isOpen={showReport}>
            <ReportViewer
              definition={selectedReport}
              props={selectedReportProps}
              isOpen={showReport}
              onClose={() => hideReport()}
              onDownload={() => downloadPdfReport(selectedReport.type)}
            />
          </Modal>
        ) : null}
        {showActionModal ? (
          <StrategyReportModal isOpen={showActionModal} onClose={() => setShowActionModal(false)} />
        ) : null}
      </>
    );
};

export default DirectionPriorities;

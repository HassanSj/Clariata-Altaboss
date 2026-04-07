import {Button, ButtonGroup, Grid, Icon, MenuItem, Select} from "@material-ui/core";
import React, {useState} from "react";
import styles from './SelectPaginationBar.module.scss';
import {useStoreActions, useStoreState} from "~/store/hooks";
import {IObjectiveDataType} from "~/types/objective/store";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {get} from "lodash";
import {Objective} from "~/types/api/objective";
import useNotifications from "~/ui/hooks/useNotifications";
import MultiSelectFilter from "~/ui/components/Data/MultiSelectFilter";
import {
  DEFAULT_ALL_FILTER,
  getDimensionsOfSuccessFilters,
  getMetricsOfSuccessFilters,
  getObjectivePersonFilters,
  getTimeframeFilters
} from "~/ui/constants/tasks";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchables from "~/ui/hooks/useSearchables";
import usePagination from "~/ui/hooks/usePagination";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import { Timeframe } from "~/types/api/timeframe";


interface IProps {
  items?: Objective[];
  showSelectedOnly?: boolean;
  enableFilters?: boolean;
}

const SelectPaginationBar = ({ items, showSelectedOnly = false, enableFilters = false }: IProps) => {
  const notifications = useNotifications();

  const { onSelect } = useStoreActions(actions => actions.objective);
  const { selectedObjective, objectives, selectedObjectiveIds } = useStoreState(state => state.objective);
  //const { dimensionsOfLife, metricsOfSuccess, timeframes } = useStoreState((state) => state.constants);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
  const { data: timeframes } = useSWR<Timeframe[]>([`${process.env.NEXT_PUBLIC_API_URL}/timeframe/list`, getAccessToken()], fetcher);
  const { persons } = useStoreState((state) => state.person);

  // Get filtered items
  const getFilteredItems = () => {
    const filteredItems: Objective[] = [];
    if (showSelectedOnly) {
      if (selectedObjectiveIds) {
        items?.forEach(item => {
          if (selectedObjectiveIds[String(item?.ObjectiveID)]) {
            filteredItems.push(item);
          }
        })
      }

      return filteredItems;
    }

    return items;
  }

  const [selectableItems, setSelectableItems] = React.useState(getFilteredItems());
  const [showFilters, setShowFilters] = React.useState(false);
  const [value, setValue] = React.useState(selectableItems?.[0]?.ObjectiveID);
  const [valueIndex, setValueIndex] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(selectableItems ? selectableItems?.length : 0);
  const [selectedDateFilter, setSelectedDateFilter] = React.useState<number>(0);

  // Date filters
  const dateFilters: any = getTimeframeFilters(timeframes as Timeframe[]);
  const dateFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const dateFilterableItems = useSearchables(selectableItems ? selectableItems : [], dateFilterValue.value,
    (item: Objective | undefined) => [String(item?.TimeframeID)]);

  // Timeframe filters
  const timeframeFilters: any = getTimeframeFilters(timeframes as Timeframe[]);
  const timeframeFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const timeframeFilterableItems = useSearchables(dateFilterableItems, timeframeFilterValue.value,
    (item: Objective | undefined) => [String(item?.TimeframeID)]);

  // Dimensions of success filters
  const dsFilters: any = getDimensionsOfSuccessFilters(dimensionsOfLife as DimensionOfLife[]);
  const dsFilterValue = useUserInput(DEFAULT_ALL_FILTER);
  const dsFilterableItems = useSearchables(
    timeframeFilterableItems,
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

  // Pagination
  const [page, setPage] = useState(1);
  const paginator = usePagination(personFilterableItems, undefined);
  const handleChange = (e: any, p: number) => {
    paginator.jump(p);
  };

  // Select an objective
  const select = async (objectiveId: number) => {
    const objective = paginator.currentData()?.find(o => o.ObjectiveID === objectiveId);
    if (!objective) return;
    notifications.toggleLoading(true);
    // Set selected objective ID
    setValue(objective?.ObjectiveID);
    // Set selected objective index
    const index = paginator.currentData()
      ?.findIndex(o => o.ObjectiveID === objectiveId);
    setValueIndex(index);
    // Set selected objective in store
    await onSelect({
      type: IObjectiveDataType.OBJECTIVE,
      objective,
      objectiveId: objective?.ObjectiveID
    });
    notifications.toggleLoading(false);
  }

  // Previous objective
  const previous = () => {
    if (!paginator.currentData()) return false;
    const index = paginator.currentData()
      ?.findIndex(o => o.ObjectiveID === selectedObjective?.ObjectiveID);
    if (index >= 0 && paginator.currentData()[index - 1]) {
      const newSelected = paginator.currentData()[index - 1];
      setValueIndex(index - 1);
      setValue(newSelected?.ObjectiveID);
      select(newSelected?.ObjectiveID);
    }
  }

  // Check if previous is available
  const isPreviousAvailable = () => {
    return valueIndex && valueIndex > 0;
  }

  // Next item
  const next = () => {
    if (!paginator.currentData()) return;
    const index = paginator.currentData()
      ?.findIndex(o => o.ObjectiveID === selectedObjective?.ObjectiveID);
    if (index >= 0 && paginator.currentData()[index + 1]) {
      const newSelected = paginator.currentData()[index + 1];
      setValueIndex(index + 1);
      setValue(newSelected?.ObjectiveID);
      select(newSelected?.ObjectiveID);
    }
  }

  // Check if next item is available
  const isNextAvailable = () => {
    if (!paginator.currentData()) {
      return false;
    }
    if (valueIndex === 0) {
      return true;
    }
    return valueIndex && total ? (valueIndex < (total - 1)) : false;
  }

  const setInitialObjective = () => {
    if (paginator.currentData() && paginator.currentData()?.length > 0){
      select(paginator.currentData()[0]?.ObjectiveID);
    }
  }

  const setItems = () => {
    setSelectableItems(getFilteredItems());
  }

  const selectFirst = async () => {
    if(selectableItems?.[0]){
      notifications.toggleLoading(true);
      const firstPriority = selectableItems[0];
      select(firstPriority?.ObjectiveID)
      notifications.toggleLoading(false);
    }
  }

  useMountEvents({
    onMounted: async () => {
      setItems();
      selectFirst();
    },
    onChange: async () => {
      setItems();
    },
    watchItems: [objectives, selectedObjectiveIds]
  });

  return (
    <>
      { paginator.currentData()?.length > 0 ?
        <div>
          <div className={styles.wrapper}>
            <Grid container spacing={1}>
              <Grid container item xs={4} justifyContent="flex-start">
                <Button color="secondary"
                        disabled={!isPreviousAvailable()}
                        onClick={() => previous()}>
                  <Icon className={styles.previous_icon}>keyboard_arrow_left</Icon> Previous Priority
                </Button>
              </Grid>
              <Grid container item xs={4}>
                <div className={styles.labelWrapper}>
                  <div className={styles.label}>
                    Selected Priority
                  </div>
                  <div className={styles.pagination}>
                    {valueIndex + 1} of {paginator?.currentData()?.length} priorities
                  </div>
                </div>
                <Select className={styles.input}
                        type="select"
                        value={value}
                        onChange={async (event: any) => {
                          setValue(event?.target?.value);
                          select(event?.target?.value);
                        }}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}>
                  {paginator.currentData().map((opt: any, index: number) => {
                    return (
                      <MenuItem value={get(opt, 'ObjectiveID')} key={index}>
                        {get(opt, 'Description')}
                      </MenuItem>
                    )
                  })}
                </Select>
                { enableFilters ?
                  <div className={styles.dateFilter}>
                    <ButtonGroup variant="text"
                                 color="primary"
                                 aria-label="text primary button group"
                                 fullWidth={true}>
                      <Button onClick={() => setSelectedDateFilter(0)}>All</Button>
                      <Button onClick={() => setSelectedDateFilter(30)}>30d</Button>
                      <Button onClick={() => setSelectedDateFilter(60)}>60d</Button>
                      <Button onClick={() => setSelectedDateFilter(90)}>90d</Button>
                      <Button onClick={() => setSelectedDateFilter(360)}>Year</Button>
                    </ButtonGroup>
                  </div>
                  : null}

              </Grid>
              <Grid container item xs={4} justifyContent="flex-end">
                <Button color="secondary"
                        disabled={!isNextAvailable()}
                        onClick={() => next()}>
                  Next Priority  <Icon className={styles.next_icon}>keyboard_arrow_right</Icon>
                </Button>
              </Grid>
            </Grid>
            { showFilters ?
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <div className={styles.filter}>
                    <h5 className={styles.filter_head}>Filter by timeframe</h5>
                    <MultiSelectFilter label="Timeframe"
                                       filterValue={timeframeFilterValue}
                                       filterOptions={timeframeFilters}
                                       onUpdate={(v) => timeframeFilterValue.setValue(v)} />
                  </div>
                </Grid>
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
              </Grid>
              : null }
          </div>
        </div>
        :
        <div className={styles.empty}>
          <h2>No priorities selected.</h2>
          <div>
            Select the priorities you want to curate under the "Pre-Curation" tab above.
          </div>
        </div>
      }

    </>
  )
}

export default SelectPaginationBar;

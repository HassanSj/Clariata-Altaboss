import React, {useState} from 'react';
import {Objective} from "~/types/api/objective";
import SelectPaginationBar from "~/ui/components/Forms/SelectPaginationBar";
import validate from "~/ui/components/Priorities/EditPriorityFormContent/form/validate";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    DialogActions,
    Grid,
    TextField,
    Tooltip
} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {objectiveStatuses} from "~/ui/constants/objectives";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import SelectDate from "~/ui/components/Forms/SelectDate";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {useStoreActions, useStoreState} from "~/store/hooks";
import Button from "~/ui/components/Button";
import {convertStringToDate, convertStringToDateText, createEditHeaderSubmitText, createEditMessageText, defaultDate, getDateType, getMonth, isNullOrUndefined} from "~/ui/constants/utils";
import {IFormActionProps} from "~/types/forms";
import api from "~/services/api";
import {IObjectiveDataType} from "~/types/objective/store";
import {extractServerError} from "~/services/api/errors";
import useNotifications from "~/ui/hooks/useNotifications";
import EditActionItemSimple from "~/ui/components/ActionItems/EditActionItemSimple";
import styles from "~/ui/components/Modules/Direction/DirectionStrategy/DirectionStrategy.module.scss";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SortDirection} from "~/ui/constants/data";
import MultiSelectFilter from "~/ui/components/Data/MultiSelectFilter";
import SelectFilter from "~/ui/components/Data/SelectFilter";
import {
    actionItemTimingFrequency,
    DEFAULT_ALL_FILTER,
    DEFAULT_NO_GROUPING, getActionItemGroupingMap, getActionItemGroupingOptions,
    getActionItemPersonFilters, getActionItemStatus, getActionItemStatuses,
    monthTypes, RecurrenceFrequencyType
} from "~/ui/constants/tasks";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import DirectionStrategyActionItem from "~/ui/components/Modules/Direction/DirectionStrategyActionItem";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {ActionItem as ActionItemModel} from "~/types/api/actionItem";
import useDataViews from "~/ui/hooks/useDataViews";
import {actionItemViews} from "~/ui/constants/actionitems";
import useSearchables from "~/ui/hooks/useSearchables";
import useSortable from "~/ui/hooks/useSortable";
import useGroupables from "~/ui/hooks/useGroupables";
import usePagination from "~/ui/hooks/usePagination";
import {IDataTableView} from "~/types/data";
import moment from "moment";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';
import { IntervalType } from '~/types/api/intervalType';

interface IProps {
    item?: Objective;
    items?: Objective[];
}

const PriorityForm = ({item}:IProps) => {
    const initialValues = {
        Description: ""
    }

    const editValues = {
        ...item,
        Assistance: item?.AssistanceNeeded ? 1 : item?.DIY ? 2 : null,
        PriorityNow: item?.TimeframeID,
        StartDate: item?.StartDate && new Date(item?.StartDate).getTime() !== defaultDate?.getTime() ? convertStringToDateText(item?.StartDate, item?.StartDateType) : undefined,
        ProjectedEndDate: item?.ProjectedEndDate && new Date(item?.ProjectedEndDate).getTime() !== defaultDate?.getTime() ? convertStringToDateText(item?.ProjectedEndDate, item?.EndDateType) : undefined,
    }

    const notifications = useNotifications();

    //const { dimensionsOfLife, metricsOfSuccess, intervalTypes } = useStoreState(state => state.constants);
    const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
    const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
    const { data: intervalTypes } = useSWR<IntervalType[]>([`${process.env.NEXT_PUBLIC_API_URL}/intervaltype/list`, getAccessToken()], fetcher);
    const { selectedHousehold } = useStoreState(state => state.household);
    const isEdit = Boolean(item) && Boolean(item?.ObjectiveID);
    const { dreamInterviewId } = useStoreState(state => state.interview);
    const { onSelect, onRefresh } = useStoreActions(actions => actions.objective);

    const [currentValues, setCurrentValues] = useState<any | undefined>(item ? item : initialValues);
    const onValuesChange = (changes: any) => {
        setCurrentValues(changes);
    }

    const createOrUpdate = async (values: any, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            const { HouseholdID } = selectedHousehold;
            const populatedValues = {
                ...values,
                TemplateType: 1,
                HouseholdID: selectedHousehold?.HouseholdID,
                InterviewID: dreamInterviewId,
                PersonID: values?.Champion,
                ClientID: values?.Champion,
                TimeframeID: values?.PriorityNow ? values.PriorityNow : 0,
                StartDate: values?.StartDate ? convertStringToDate(values?.StartDate, getDateType(values.StartDate)) : undefined,
                ProjectedEndDate: values?.ProjectedEndDate ? convertStringToDate(values?.ProjectedEndDate, getDateType(values.ProjectedEndDate)) : undefined,
                StartDateType: values?.StartDate ? getDateType(values?.StartDate): undefined,
                EndDateType: values?.ProjectedEndDate ? getDateType(values.ProjectedEndDate): undefined,
            }
            // @ts-ignore
            const res = await (!isEdit ? api.objective.create(HouseholdID, dreamInterviewId, populatedValues) : api.objective.update(HouseholdID, dreamInterviewId, item.ObjectiveID, populatedValues));
            const payload = {
                type: IObjectiveDataType.OBJECTIVE,
                objective: res?.data,
                objectiveId: res?.data?.ObjectiveID
            };
            const refreshed = await onRefresh(payload);
            onSelect({
                ...payload,
                objective: refreshed
            });
            setErrors({ successMessage: `Priority successfully ${createEditMessageText(item)}!`});
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }
        notifications.toggleLoading(false);
    };

    const validateStartDateIsBeforeEndDate = (values: any) => {
        let error;
        const startDateString = currentValues?.StartDate;
        const endDateString = currentValues?.ProjectedEndDate;
        if(startDateString && endDateString)
        {
            let startDate = moment(startDateString, 'YYYY');
            if (moment(startDateString, 'M/YYYY', true).isValid()) startDate = moment(startDateString, 'M/YYYY');
            if (moment(startDateString, 'MM/YYYY', true).isValid()) startDate = moment(startDateString, 'MM/YYYY');
            if (moment(startDateString, 'M/D/YYYY', true).isValid()) startDate = moment(startDateString, 'M/D/YYYY');
            if (moment(startDateString, 'MM/DD/YYYY', true).isValid()) startDate = moment(startDateString, 'MM/DD/YYYY');

            let endDate = moment(endDateString, 'YYYY');
            if (moment(endDateString, 'M/YYYY', true).isValid()) endDate = moment(endDateString, 'M/YYYY');
            if (moment(endDateString, 'MM/YYYY', true).isValid()) endDate = moment(endDateString, 'MM/YYYY');
            if (moment(endDateString, 'M/D/YYYY', true).isValid()) endDate = moment(endDateString, 'M/D/YYYY');
            if (moment(endDateString, 'MM/DD/YYYY', true).isValid()) endDate = moment(endDateString, 'MM/DD/YYYY');

            if(startDate > endDate) {
                error = 'Start Date Cannot be after End Date';
            }
        }
        return error;
    }

    return (
        <FormWrapper initialValues={item ? editValues : initialValues}
                     validationSchema={validate}
                     onSubmit={createOrUpdate}
                     onValuesChange={onValuesChange}
                    className="full-width">
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <InputField type="text"
                                    name="Description"
                                    component={Input}
                                    placeholder="Priority"
                                    label="Priority"
                                    required={true} />
                    </Grid>
                    <Grid item xs={3}>
                        <InputField type="select"
                                    name="DimensionOfLifeID"
                                    component={Input}
                                    isMultiselect={false}
                                    placeholder="Dimension of Life"
                                    label="Dimension of Life"
                                    items={dimensionsOfLife}
                                    labelField="DimensionOfLife"
                                    valueField="DimensionOfLifeID"
                                    required={true} />
                    </Grid>
                    <Grid item xs={3}>
                        <InputField type="select"
                                    name="MetricOfSuccessID"
                                    component={Input}
                                    isMultiselect={false}
                                    placeholder="Metric of Success"
                                    label="Metric of Success"
                                    items={metricsOfSuccess}
                                    labelField="MetricOfSuccess"
                                    valueField="MetricOfSuccessID"
                                    required={true} />
                    </Grid>
                    <Grid item xs={3}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveStatuses}
                                    name="StatusID"
                                    component={Input}
                                    label="Status" />
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={3}>
                        <InputField type="autocomplete"
                                    name="PersonID"
                                    component={SelectAutocomplete}
                                    templateComponent={SelectAvatarTemplate}
                                    isMultiselect={false}
                                    placeholder="Family Member"
                                    label="Family Member"
                                    items={selectedHousehold?.Persons ? [...selectedHousehold?.Persons, BOTH_PERSONS_OPTION] : [BOTH_PERSONS_OPTION]}
                                    labelField="FullName"
                                    valueField="PersonID" />
                    </Grid>
                    <Grid container item xs={3}>
                        <InputField type="select"
                                    name="AssistanceNeeded"
                                    component={Input}
                                    items={[
                                        {label: 'Assisted', value: true },
                                        {label: 'DIY', value: false }
                                    ]}
                                    label="DIY/Assisted"
                                    placeholder="DIY/Assisted"/>
                    </Grid>
                    <Grid container item xs={3}>
                        <InputField type="datetext"
                                    name="StartDate"
                                    component={Input}
                                    disablePast={!isEdit}
                                    label="Start Date"
                                    placeholder="Start Date"/>
                    </Grid>
                    <Grid container item xs={3}>
                        <InputField type="datetext"
                                    name="ProjectedEndDate"
                                    component={Input}
                                    label="End Date"
                                    placeholder="End Date"
                                    validate={validateStartDateIsBeforeEndDate}/>
                    </Grid>
                </Grid>
            </div>
            <DialogActions>
                <Button
                    type="submit"
                    text={`${createEditHeaderSubmitText(item)} Priority`}
                    variant="contained"
                    size="large"
                    color="primary"
                />
            </DialogActions>
        </FormWrapper>

    )
}

export const DataView: IDataTableView = {
    id: 'list',
    name: 'List',
    headers: [
        {
            id: 'description',
            title: 'Action Step',
            field: 'Description',
            width: 3
        },
        {
            id: 'startdate',
            title: 'Start Month',
            field: 'StartDate',
            width: 2
        },
        {
            id: 'startdateyear',
            title: 'Start Year',
            field: 'StartDate',
            width: 2
        },
        {
            id: 'diy',
            title: 'DIY/Assisted',
            field: 'AssistanceNeeded',
            width: 2
        },
        {
            id: 'status',
            title: 'Status',
            field: 'Status',
            width: 2
        }
    ]
};

const DirectionStrategySchedulerTab = ({ item, items }: IProps) => {

    // Search and filters.
    const searchText = useUserInput("");
    const searchableItems = useSearchable(
        item?.ActionItemList ? item?.ActionItemList : [],
        searchText.value,
        (itm: ActionItemModel | undefined) => [`${itm?.Description}`]
    );

    // Timeframe filters
    const timeframeFilters: any = monthTypes;
    const timeframeFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const timeframeFilterableItems = useSearchables(searchableItems as ActionItemModel[], timeframeFilterValue.value,
        (itm: ActionItemModel | undefined) => {
        if(itm?.StartDate){
            const date = new Date(itm.StartDate)
            return [String(date.getMonth())]
        }else{
            return [""]
        }
    });

    // Status filters
    const statusFilters: any = getActionItemStatuses();
    const statusFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const statusFilterableItems = useSearchables(timeframeFilterableItems, statusFilterValue.value,
        (itm: ActionItemModel | undefined) => [String(getActionItemStatus(itm))]);

    // DIY filter
    const diyFilter: any = [{label: "DIY",value: 1},{label: "Assisted",value: 2}]
    const diyFilterValue = useUserInput(DEFAULT_ALL_FILTER);
    const diyFilterableItems = useSearchables(statusFilterableItems, diyFilterValue.value,
        (itm: ActionItemModel | undefined) => {
            if(itm?.AssistanceNeeded === 2)
                return ['1']
            else if(itm?.AssistanceNeeded === 1)
                return ['2']
            return []
        });

    // Sorting
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
    const sortableItems = useSortable(
        diyFilterableItems,
        sortDirection,
        (itm: ActionItemModel | undefined) => [ itm?.StartDate ? `${itm?.StartDate}` : "-1"],
    );

    // Pagination
    const paginator = usePagination(sortableItems, 10);


    const [priorityExpanded, setPriorityExpanded] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div>
            <SelectPaginationBar items={items}
                                 showSelectedOnly={true} />
            { item ?
                <>
                    <div className="m-b-20">
                        <Accordion expanded={priorityExpanded} onChange={() => setPriorityExpanded(!priorityExpanded)}>
                            <AccordionSummary expandIcon={<Icon color="secondary">keyboard_arrow_down</Icon>}>
                                {priorityExpanded ? "Hide Expanded Priority" : "Expand to Edit Priority Details"}
                            </AccordionSummary>
                            <AccordionDetails>
                                <PriorityForm item={item} items={items}/>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <EditActionItemSimple/>
                    <div className={styles.filters}>
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
                            <Grid item xs={3}>

                            </Grid>
                            <Grid container item xs={6} justifyContent="flex-end">
                                <>
                                    <Tooltip title="Show/Hide Filters">
                                        <IconButton color={ showFilters ? 'primary' : 'default'}
                                                    onClick={() => setShowFilters(!showFilters)}>
                                            <Icon>filter_alt</Icon>
                                        </IconButton>
                                    </Tooltip>
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
                                    </Tooltip>
                                </>
                            </Grid>
                        </Grid>
                        { showFilters ?
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <div className={styles.filter}>
                                        <h5 className={styles.filter_head}>Filter by start month</h5>
                                        <MultiSelectFilter label="Start month"
                                                           filterValue={timeframeFilterValue}
                                                           filterOptions={timeframeFilters}
                                                           onUpdate={(v) => timeframeFilterValue.setValue(v)} />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={styles.filter}>
                                        <h5 className={styles.filter_head}>Filter by status</h5>
                                        <MultiSelectFilter label="Status"
                                                           filterValue={statusFilterValue}
                                                           filterOptions={statusFilters}
                                                           onUpdate={(v) => statusFilterValue.setValue(v)} />
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className={styles.filter}>
                                        <h5 className={styles.filter_head}>Filter by assistance</h5>
                                        <MultiSelectFilter label="DIY/Assisted"
                                                           filterValue={diyFilterValue}
                                                           filterOptions={diyFilter}
                                                           onUpdate={(v) => diyFilterValue.setValue(v)} />
                                    </div>
                                </Grid>
                            </Grid>
                            : null }
                    </div>
                    <div>
                        <DataTableHeaders headers={DataView.headers} />
                        <DataWrapper
                            paginator={paginator}
                            keyLabel="ActionItemID"
                            propLabel="item"
                            component={DirectionStrategyActionItem} />
                    </div>
                </>
                : null }
        </div>
    )
}

export default DirectionStrategySchedulerTab
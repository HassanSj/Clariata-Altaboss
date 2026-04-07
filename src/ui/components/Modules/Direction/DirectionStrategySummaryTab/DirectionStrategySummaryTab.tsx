import React, {useState} from 'react';
import {Objective} from "~/types/api/objective";
import {IDataTableHeader} from "~/types/data";
import styles from "./DirectionStrategySummaryTab.module.css"
import {useStoreState} from "~/store/hooks";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DirectionStrategySummaryPriority from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import usePagination from "~/ui/hooks/usePagination";
import {Button, ButtonGroup, Grid} from "@material-ui/core";
import {
    DirectionStrategySummaryPriorityMonth,
    MonthRow
} from "~/ui/components/Modules/Direction/DirectionStrategySummaryPriorityItem/DirectionStrategySummaryPriorityItem";
import {ActionItem} from "~/types/api/actionItem";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import SelectDate from "~/ui/components/Forms/SelectDate";
import useSortable from "~/ui/hooks/useSortable";
import {SortDirection} from "~/ui/constants/data";

interface IProps {
    item?: Objective;
    items?: Objective[];
}

const TIMEFRAME = {
    LAST_12_MONTHS: "last",
    NEXT_12_MONTHS: "next",
    TIMEFRAME: "timeframe"
}

const TIMEFRAME_BUTTONS:{[key:string]:string} = {
    last: "Last 12 Months",
    next: "Next 12 Months",
    timeframe: "Custom"
}

function addMonths(date: Date, months:number) {
    const copy = new Date(date.getTime())

    const d = copy.getDate();
    copy.setMonth(copy.getMonth() + +months);
    if (copy.getDate() !== d) {
        copy.setDate(0);
    }
    return copy;
}

const MONTHS = ['Jan','Feb','Mar','Apr',"May","Jun",'Jul',"Aug","Sep","Oct","Nov","Dec"];

const getData:((start:Date) => {headers:IDataTableHeader[], months: Date[]}) = (start:Date) => {
    const headers:IDataTableHeader[] = [];
    const months = [];

    for(let i=0;i<12;i++){
        const date = addMonths(start,i)

        headers.push({
            id: MONTHS[date.getMonth()],
            title: MONTHS[date.getMonth()]+" "+date.getFullYear(),
            width: 1
        })

        months.push(date)
    }

    return {headers, months}
}

export const shouldAppearInThisMonth: (value: ActionItem, month: Date) => boolean = (value, month) => {
    if(value.StartDate){
        const date = typeof value.StartDate === "string" ? new Date(value.StartDate) : value.StartDate

        return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
    }else{
        return false
    }
}

const generateRow: (obj: Objective,months: Date[]) => MonthRow = (obj, months) => {
    const row: MonthRow = { id: String(obj.ObjectiveID), columns: []}

    months.forEach((month: Date) => {
        // TODO: Handle recurring
        const items =
            obj.ActionItemList?.filter((value: ActionItem) => shouldAppearInThisMonth(value, month)) ?? []

        row.columns.push({items, month: month.getMonth(), year: month.getFullYear()})
    })

    return row
}

const generateRows: (paginator: any, months: Date[]) => MonthRow[] = (paginator, months) => {
    const rows: MonthRow[] = []

    paginator.currentData().forEach((obj: Objective) => {
        if(obj.ObjectiveID > 0) rows.push(generateRow(obj, months))
    })

    return rows
}

const DirectionStrategySummaryTab = ({ items }: IProps) => {

    const [ emptyIndex, setEmptyIndex ] = useState<number[]>([])
    const { selectedObjectiveIds } = useStoreState(state => state.objective);
    const [ selectedTimeframe, setSelectedTimeframe ] = useState<string>(TIMEFRAME.NEXT_12_MONTHS)
    const [ startDate, setStartDate ] = useState<Date>(new Date())
    const [ showAllPriorities, setShowAllPriorities] = useState<boolean>(false);

    const data = getData(startDate)
    const monthHeaders = data.headers
    const primaryHeader: IDataTableHeader[] = [{
        id: 'title',
        title: 'Priority',
        field: 'Description',
        width: 12
    }]

    const objectives = items?.filter((obj) => selectedObjectiveIds[obj.ObjectiveID] ?? false) ?? []
    const sortableItems = (showAllPriorities ? items ?? [] : objectives).sort((a,b) => Number(a.Rank ?? 0) < Number(b.Rank ?? 0) ? -1 : 1)

    // Append empty indexes for all open rows
    emptyIndex.forEach(i => {
        sortableItems.splice(i+1, 0, {Description: "", ObjectiveID: 0, InterviewID: 0})
    })


    const paginator = usePagination(sortableItems, undefined);
    const rows: MonthRow[] = generateRows(paginator, data.months)

    const setTimeframe = (key:string) => {
        setSelectedTimeframe(key)

        if(key === TIMEFRAME.NEXT_12_MONTHS){
            setStartDate(new Date())
        }else if(key === TIMEFRAME.LAST_12_MONTHS){
            setStartDate(addMonths(new Date(), -12))
        }else{
            setStartDate(new Date())
        }
    }

    const customStartDate = {
        date: startDate
    }

    const setStartIfNeeded = ({date}:{date: Date}) => {
        if(date.getFullYear() !== startDate.getFullYear() || date.getMonth() !== startDate.getMonth()){
            setStartDate(date)
        }
    }

    return (
        <>
            <Grid container className={styles.wrapper}>
                <Grid xs={5}>
                    <ButtonGroup fullWidth={true}
                                 color="primary"
                                 variant="contained">
                        {Object.keys(TIMEFRAME_BUTTONS).map(key => (
                            <Button color={selectedTimeframe === key ? 'primary' : 'default'} onClick={() => setTimeframe(key)}>{TIMEFRAME_BUTTONS[key]}</Button>
                        ))}
                    </ButtonGroup>
                </Grid>
                {selectedTimeframe === TIMEFRAME.TIMEFRAME && (
                    <Grid xs={3}>
                        <FormWrapper initialValues={customStartDate}  onValuesChange={setStartIfNeeded}>
                                <InputField type="month_year"
                                            name="date"
                                            component={SelectDate}
                                            label="Start"
                                            placeholder="Start" />
                        </FormWrapper>
                    </Grid>
                )}
                <Grid xs={selectedTimeframe === TIMEFRAME.TIMEFRAME ? 4 : 7}/>
            </Grid>
            <Grid container className={styles.wrapper}>
                <Grid item xs={3}>
                    <DataTableHeaders headers={primaryHeader} />
                    <DataWrapper
                        paginator={paginator}
                        hideShowAll={true}
                        keyLabel="ObjectiveID"
                        propLabel="item"
                        component={DirectionStrategySummaryPriority} />
                </Grid>
                <Grid item xs={9} className={styles['scrollable-wrapper-parent']}>
                    <div className={styles['scrollable-wrapper']}>
                        <DataTableHeaders headers={monthHeaders} />
                        <DataWrapper
                            data={rows}
                            keyLabel="id"
                            propLabel="item"
                            component={DirectionStrategySummaryPriorityMonth} />
                    </div>
                </Grid>
            </Grid>
            <Grid container className="m-t-10">
                <Button color={showAllPriorities ? 'primary' : 'default'}
                        variant={showAllPriorities ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setShowAllPriorities(!showAllPriorities)}>
                    {showAllPriorities ? 'Show Selected Priorities' : 'Show All Priorities'}
                </Button>
            </Grid>
        </>
    )
}

export default DirectionStrategySummaryTab
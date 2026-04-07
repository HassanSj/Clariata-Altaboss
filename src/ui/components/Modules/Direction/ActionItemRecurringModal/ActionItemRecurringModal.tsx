import React, {ReactElement, useState} from "react";
import {ActionItem} from "~/types/api/actionItem";
import Modal from "~/ui/components/Dialogs/Modal";
import {
    Grid, MenuItem, Select,
} from "@material-ui/core";
import SelectDate from "~/ui/components/Forms/SelectDate";
import Input from "~/ui/components/Forms/Input";
import MonthCheckboxes, {SelectedMonths} from "~/ui/components/Modules/Direction/ActionItemRecurringModal/MonthCheckboxes";
import useNotifications from "~/ui/hooks/useNotifications";
import {createOrUpdateDirect} from "~/ui/components/ActionItems/EditActionItem/EditActionItem";
import {useStoreActions, useStoreState} from "~/store/hooks";
import Button from "~/ui/components/Button";
import {IObjectiveDataType} from "~/types/objective/store";
import {Objective} from "~/types/api/objective";
import moment from "moment";
import { IFormActionProps } from "~/types/forms";

interface IProps {
    item: ActionItem,
    isOpen: boolean,
    onClose:() => unknown,
    objective?:Objective
}

const MONTHLY_VALUE = "1"
const YEARLY_VALUE = "2"

type LayoutValues = "1"|"2"


export const constructDate = (month: any, year: any):Date => {
    // JS months start at 0
    month = Number(month) + 1
    if(month < 10)
        month = `0${month}`
    return moment(`${year}-${month}-05`,"YYYY-MM-DD").toDate()
}

/**
 * The selected item can be a parent or a child
 * FInd the parent and all children
 * @param item
 * @param allItems
 */
export const getAllItems = (item: ActionItem, allItems: ActionItem[]): {parentItem: ActionItem, children: ActionItem[]} => {
    if(item.ParentActionItemID === undefined || item.ParentActionItemID === 0){
        const children = allItems.filter(itm => itm.ParentActionItemID === item.ActionItemID)

        return {parentItem: item, children}
    }else{
        let parentIDtoFind = -1
        let parent = allItems.find(itm => itm.ActionItemID === item.ParentActionItemID)
        if(parent){
            parentIDtoFind = parent.ActionItemID!
        }else{
            parent = item
            parentIDtoFind = item.ParentActionItemID
        }
        const children = allItems.filter(itm => itm.ParentActionItemID === parentIDtoFind)

        return {parentItem: parent!, children}
    }
}

/**
 * Get selected months based on existing parent items
 * @param parent
 * @param children
 */
const getDefaultSelectedMonths = (parent: ActionItem, children: ActionItem[]): SelectedMonths => {
    const months:SelectedMonths = {}

    const allItems = [parent, ...children]

    allItems.forEach(item => {
        if(item.StartDate) {
            const date = new Date(item.StartDate)
            const year = date.getFullYear()
            const month = date.getMonth()

            if(!months[year]){
                months[year] = {}
            }

            months[year][month] = true
        }
    })

    return months
}

interface DateRange{start?: Date, end?: Date}

const getDateRange = (selectedMonths: SelectedMonths):DateRange => {
    let start: Date|undefined
    let end: Date|undefined

    const years = Object.keys(selectedMonths).map(Number)

    if(years.length > 0) {
        const startYear = Math.min(...years)
        const endYear = Math.max(...years)

        const allStartMonths = Object.keys(selectedMonths[startYear]).map(Number)
        if(allStartMonths.length > 0) {
            const startMonth = Math.min(...allStartMonths)
            start = constructDate(startMonth, startYear)
        }

        const allEndMonths = Object.keys(selectedMonths[endYear]).map(Number)
        if(allEndMonths.length > 0) {
            const endMonth = Math.max(...allEndMonths)
            end = constructDate(endMonth, endYear)
        }
    }

    return {start,end}
}

const deleteItem = async (item: ActionItem, onRemove: any) => {
    await onRemove({
        type: IObjectiveDataType.ACTION_ITEM,
        actionItemId: item?.ActionItemID,
        actionItem: item
    });
}

const addYear = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year + 1, month, day);
}

function getStartDate(item: Objective| ActionItem): Date|undefined{
    if(item.StartDate){
        let date
        if(typeof item.StartDate === "string"){
            moment(item.StartDate!).toDate()
            date = moment(item.StartDate!,"YYYY-MM-DD").toDate() // new Date(item.StartDate!)
        }else{
            date =  item.StartDate!
        }

        if(date.getFullYear() > 1)
            return date
        else
            return undefined
    }else{
        return undefined
    }
}

function getEndDate(item:Objective|undefined, startDate: Date){
    if(item?.ProjectedEndDate){
        const dt = new Date(item?.ProjectedEndDate)

        const d = constructDate(dt.getMonth(), dt.getFullYear())
        if(d.getFullYear() > 1){
            return d
        }
    }

    return addYear(startDate)
}

const ActionItemRecurringModal = ({item, isOpen, onClose,objective}:IProps):ReactElement => {
    const { selectedHousehold } = useStoreState(state => state.household);
    const { dreamInterviewId } = useStoreState(state => state.interview);
    const { onRefresh, onPopulate, onRemove } = useStoreActions(actions => actions.objective);
    const { selectedObjective } = useStoreState(state => state.objective);
    const objectiveToUse = objective ?? selectedObjective

    const {parentItem, children} = getAllItems(item, objectiveToUse?.ActionItemList ?? [])

    const defaultSelectedMonths = getDefaultSelectedMonths(parentItem,children)
    const defaultDateRange = getDateRange(defaultSelectedMonths)

    const notifications = useNotifications()

    const initialStart = (defaultDateRange.start ?? (getStartDate(item) ?? getStartDate(objectiveToUse))) ?? new Date()
    const initialEnd = getEndDate(objective, initialStart)

    const [rangeStart, setRangeStart] = useState<Date>(initialStart)
    const [rangeEnd, setRangeEnd] = useState<Date>(initialEnd)

    const [layout, setLayout] = useState<LayoutValues>(MONTHLY_VALUE)
    const [selectedYear, setSelectedYear] = useState<number>(rangeStart.getFullYear())
    const [selectedMonths, setSelectedMonths] = useState<SelectedMonths>(defaultSelectedMonths)

    const startYear = rangeStart.getFullYear()
    const endYear = rangeEnd.getFullYear()

    const yearOptions: number[] = []

    for(let i = startYear; i <= endYear; i++){
        yearOptions.push(i)
    }

    let startMonth: number|undefined
    let endMonth: number|undefined

    if(selectedYear === rangeStart.getFullYear()){
        startMonth = rangeStart.getMonth()
    }
    if(selectedYear === rangeEnd.getFullYear()){
        endMonth = rangeEnd.getMonth()
    }

    const handleLayoutChange = (newValue: LayoutValues) => {
        if(newValue === YEARLY_VALUE){
            for(const year of Object.keys(selectedMonths)){
                // @ts-ignore
                const count = Object.keys(selectedMonths[year]).filter(month => selectedMonths[year][month]).length

                if(count > 1){
                    // @ts-ignore
                    const first = Object.keys(selectedMonths[year]).find(month => selectedMonths[year][month])

                    // @ts-ignore
                    selectedMonths[year] = {}
                    if(first !== undefined){
                        // @ts-ignore
                        selectedMonths[year][first] = true
                    }
                }
            }
        }
    }

    const createRecurringItems = async () => {
        console.log(startYear);
        console.log(endYear);
        let invalidDate: boolean = false;
        
        if(startYear > endYear){
            invalidDate = true;
        }

        if(startYear == startYear)
        {
            if(startMonth != undefined && endMonth != undefined) {
                if(startMonth > endYear)
                {
                    invalidDate = true;
                }
            
        }

        if(invalidDate)
        {
            notifications.addErrorNotification("Start Month/Year cannot be after End Month/Year");
        }
        else {


            notifications.toggleLoading(true)

            const monthsCopy = JSON.parse(JSON.stringify(selectedMonths))
            const allItems = [parentItem, ...children]

            // Handle existing items
            await Promise.all(allItems.map(async itm => {
                if(itm.StartDate) {
                    const date = new Date(itm.StartDate)
                    const year = date.getFullYear()
                    const month = date.getMonth()

                    // Step 1. Delete items that were unchecked
                    if (!monthsCopy[year] || !monthsCopy[year][month]){
                        await deleteItem(itm, onRemove)
                    // Step 2. Remove months from the dictionary that already have items
                    }else if(monthsCopy[year][month]){
                        monthsCopy[year][month] = false
                    }
                }
            }))

            const years = Object.keys(monthsCopy)

            await Promise.all(years.map(async year => {
                // @ts-ignore
                let months = Object.keys(monthsCopy[year])
                // @ts-ignore
                months = months.filter(month => monthsCopy[year][month])

                await Promise.all(months.map( async (month) => {
                    const newDate = constructDate(month, year)

                    const newItem: ActionItem = JSON.parse(JSON.stringify(parentItem))
                    newItem.ParentActionItemID = parentItem.ActionItemID
                    newItem.ActionItemID = undefined
                    newItem.StartDate = newDate
                    newItem.ActionItemStatusID = 0
                    newItem.CompletionDate = undefined

                    await createOrUpdateDirect(
                        newItem,
                        selectedHousehold?.HouseholdID,
                        dreamInterviewId,
                        notifications,
                        onRefresh,
                        undefined, false, false);

                    children.push(newItem)
                }))
            }))

            await onPopulate({
                type: IObjectiveDataType.OBJECTIVE
            });

            notifications.addSuccessNotification('Action Step successfully saved!');
            onClose();
            notifications.toggleLoading(false);
        }
    }
    }

    return (
        <Modal
            hideFooter={true}
            handleClose={onClose}
            isOpen={isOpen}
            title={`Create Recurring`}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SelectDate
                        type="month_year"
                        label="Start"
                        field={{value: rangeStart}}
                        onChange={(e:{target:{value:any}}) => {
                            setRangeStart(e.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <SelectDate
                        type="month_year"
                        label="End"
                        field={{value: rangeEnd}}
                        onChange={(e:{target:{value:any}}) => {
                            setRangeEnd(e.target.value)
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container className="m-t-10 p-10">
                <Grid item xs={2}>
                    <Input
                        field={{value: layout, name:"Layout",onChange:(_e:any,value:LayoutValues)=>{
                            setLayout(value)
                            handleLayoutChange(value)
                        }}}
                        type="radio"
                        items={[
                            {
                                label: "Monthly",
                                value: MONTHLY_VALUE
                            },
                            {
                                label: "Yearly",
                                value: YEARLY_VALUE
                            }
                        ]}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Select
                        className="p-10"
                        value={selectedYear}
                        label="Year"
                        onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {yearOptions.map(i => (
                            <MenuItem value={i}>{i}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={7}>
                    <MonthCheckboxes
                        onMonthsChange={(value) => {setSelectedMonths(value)}}
                        selectedMonths={selectedMonths}
                        startYear={rangeStart.getFullYear()}
                        endYear={rangeEnd.getFullYear()}
                        startMonth={startMonth}
                        endMonth={endMonth}
                        selectedYear={selectedYear}
                        radios={layout === YEARLY_VALUE}/>
                </Grid>
            </Grid>
            <Grid container>
                <Grid xs={10}/>
                <Grid xs={2}>
                    <Button
                        text="Save"
                        color="primary"
                        onClick={() => createRecurringItems()}
                    />
                </Grid>
            </Grid>
        </Modal>
    )
}

export default ActionItemRecurringModal;
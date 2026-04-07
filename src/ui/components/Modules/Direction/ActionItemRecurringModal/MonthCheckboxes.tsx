import React, {ReactElement} from "react";
import {Button, Checkbox, FormControlLabel, MenuItem, Select} from "@material-ui/core";
import {range} from "lodash"
import Input from "~/ui/components/Forms/Input";

interface MonthCheckboxesProps{
    startMonth?:number,
    endMonth?:number,
    startYear:number,
    endYear: number,
    selectedYear: number,
    selectedMonths: SelectedMonths,
    onMonthsChange: (value:SelectedMonths)=>void,
    radios?:boolean
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export type SelectedMonths = {[key:number]:{[key:number]:boolean}}

const MonthCheckboxes = ({startYear,endYear,startMonth, endMonth, selectedYear,selectedMonths,onMonthsChange,radios}:MonthCheckboxesProps):ReactElement => {

    const getValue = (index:number) => {
        if(selectedMonths[selectedYear]){
            if(selectedMonths[selectedYear][index]){
                return selectedMonths[selectedYear][index]
            }
        }
        return false
    }

    const getRadioValue = ()=>{
        if(selectedMonths[selectedYear]) {
            const keys: string[] = Object.keys(selectedMonths[selectedYear])

            if(keys.length > 0) {
                // @ts-ignore
                return keys[0]
            }
        }
        return 0
    }

    const isRadios = radios ?? false
    const monthRange:number[] = range(startMonth ?? 0, endMonth !== undefined ? endMonth+1 : 12)

    const isAllSelected = monthRange.reduce((prev, current) => (prev && getValue(current)), true)

    /**
     * Set month to true, marking all months of the same year false
     * @param month
     */
    const setMonth = (month: number) => {
        const copy = JSON.parse(JSON.stringify(selectedMonths))

        copy[selectedYear] = {}
        copy[selectedYear][month] = true

        onMonthsChange(copy)
    }

    const changeMonth = (month: number, value: boolean) => {
        const copy = JSON.parse(JSON.stringify(selectedMonths))

        if(!copy[selectedYear]){
            copy[selectedYear] = {}
        }

        copy[selectedYear][month] = value

        onMonthsChange(copy)
    }

    const changeAll = (value:boolean) => {
        const copy = JSON.parse(JSON.stringify(selectedMonths))
        if(!copy[selectedYear]){
            copy[selectedYear] = {}
        }

        monthRange.forEach(v => {
            copy[selectedYear][v] = value
        })

        onMonthsChange(copy)
    }

    return (
        <>
            {isRadios ? (
                <>
                    <Select
                        className="p-10"
                        value={getRadioValue()}
                        label="Month"
                        onChange={(e) => setMonth(Number(e.target.value))}>
                        <MenuItem value="">Select</MenuItem>
                        {monthRange.map(i => (
                            <MenuItem value={i}>{months[i]}</MenuItem>
                        ))}
                    </Select>
                </>
            ) : (
                <>
                    {monthRange.map(m => (
                        <FormControlLabel
                            key={`${selectedYear}-${m}`}
                            control={<Checkbox checked={getValue(m)} />}
                            onChange={(e, value) => {
                                changeMonth(m, value)
                            }}
                            label={months[m]}/>
                    ))}
                    <Button color="primary" onClick={() => changeAll(!isAllSelected)}>{isAllSelected ? `None` : `All`}</Button>
                </>
            )}
        </>
    )
}

export default MonthCheckboxes
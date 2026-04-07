import {Objective} from "~/types/api/objective";
import React, {ReactElement} from "react";
import CurationReportBase from "~/ui/components/Reports/CurationReportBase";
import {Household} from "~/types/api/household";
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import {spouses} from "~/ui/components/Reports/CurationReportBase/helpers";
import ReportHeader from "~/ui/components/Reports/CurationReportBase/ReportHeader";
import {ActionItem} from "~/types/api/actionItem";
import ReportCell from "~/ui/components/Reports/CurationReportBase/ReportCell";
import styles from '../CurationReportBase/summary/content.module.css'

export interface CurationSummarySchedulerProps {
    objectives:Objective[],
    householdID:number,
    household?: Household
}

const CurationSummarySchedulerReport = ({objectives, householdID, household}:CurationSummarySchedulerProps) :ReactElement => {

    const headers = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

    const content = objectives.map( objective => {
        const steps:{[key:string]:ActionItem[]} = {}

        objective.ActionItemList?.forEach((item) => {
            let date = item.DueDate

            if(date){
                if(typeof date === "string")
                    date = new Date(date)
                const month = headers[date.getMonth()]
                if(!steps[month]){
                    steps[month] = []
                }

                steps[month].push(item)
            }
        })

        return { steps, title: objective.Description }
    })

    return (
        <CurationReportBase title="Master Schedule of life pursuit" householdName={household?.HouseholdName ?? ""} spousesName={spouses(household)} photo={household?.PhotoURL ?? ""}>
            <ReportHeader items={headers}/>
            { content.map((item, index) => (
                <div key={index} className={`${styles["bc-row"]} bc-row`}>
                    <ReportCell key={"obj-title"}>
                        <p>{item.title}</p>
                    </ReportCell>
                    {headers.map((header) => (
                        <ReportCell key={header}>
                            <p>{item.steps[header] && item.steps[header].map( actionItem => (<>{actionItem.Description}<br/></>))}</p>
                        </ReportCell>
                    ))}
                </div>
            )) }
        </CurationReportBase>
    )
}

export default CurationSummarySchedulerReport;
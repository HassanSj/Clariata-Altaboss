import React, {ReactElement} from "react";
import {Objective} from "~/types/api/objective";
import {Person} from "~/types/api/person";
import {getFullName} from "~/ui/constants/user";
import {Household} from "~/types/api/household";
import CurationReportBase from "~/ui/components/Reports/CurationReportBase/CurationReportBase.tsx"
import {image} from "~/ui/components/Reports/CurationReportBase/helpers";
import ReportHeader from "~/ui/components/Reports/CurationReportBase/ReportHeader";
import ReportCell from "~/ui/components/Reports/CurationReportBase/ReportCell";
import styles from '../CurationReportBase/summary/content.module.css'

export interface CurationSummaryProps {
    objectives:Objective[],
    householdID:number,
    people:{[id:number]:Person},
    knowledge:{[key:string]:string},
    familyStakeholders:{[key:string]:Person[]},
    externalStakeholders:{[key:string]:Person[]},
    household?:Household
}


const CurationSummaryReport = ({objectives, householdID, people, knowledge, familyStakeholders, externalStakeholders, household}:CurationSummaryProps) :ReactElement => {

    const family = (id: number | string) => {
        if(!familyStakeholders[id])
            return "";
        return familyStakeholders[id].map((p) => p ? getFullName(p) : "").join(", ");
    }

    const external = (id: number | string) => {
        if(!externalStakeholders[id])
            return "";
        return externalStakeholders[id].map((p) => p ? getFullName(p) : "").join(", ");
    }


    const formatDate = (date: Date | string) => {
        if(date === "")
            return ""

        if(typeof date === "string")
            date = new Date(date)

        return `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
    }

    const assistanceImage = (objective: Objective) => objective.AssistanceNeeded ? image("assistance1.png") : image("assistance2.png")
    const importanceImage = (objective: Objective) => image(`importance${objective.Importance}.png`)
    const impactImage  = (objective: Objective) => image(`impact${objective.PersonalImpactLevel}.png`)
    const statusImage  = (objective: Objective) => image(`status${objective.StatusID}.png`)

    const spouses = household && household.Persons ? `${household.Persons[0].FirstName} and ${household.Persons[1].FullName}` : ""
    const headers = ['priority','CHAMPION','FAMILY MEMBER STAKEHOLDERS','EXTERNAL STAKEHOLDERS','KNOWLEDGE','FUNDING','SCHEDULING']
    // @ts-ignore
    return (
        <CurationReportBase title="Direction: Curation Summary Report" householdName={household?.HouseholdName ?? ""} spousesName={spouses} photo={household?.PhotoURL ?? ""}>
            <div className={`${styles["body-copy"]} body-copy`}>
                <ReportHeader items={headers}/>
                { objectives.map((objective, i) => (
                    <div key={i} className={`${styles["bc-row"]} bc-row`}>
                        <ReportCell>
                            <p><strong>{objective.Description}</strong></p>
                            <div className={`${styles["bcc-images"]} bcc-images`}>
                                <img src={assistanceImage(objective)}/>
                                {objective.Importance !== 0 && (<img src={importanceImage(objective)}/>)}
                                {objective.PersonalImpactLevel !== 0 && (<img src={impactImage(objective)}/>)}
                                <img src={statusImage(objective)}/>
                            </div>
                        </ReportCell>
                        <ReportCell>
                            <p>{getFullName(people[objective.Champion!])}</p>
                        </ReportCell>
                        <ReportCell>
                            <p>{family(objective.ObjectiveID)}</p>
                        </ReportCell>
                        <ReportCell>
                            <p>{external(objective.ObjectiveID)}</p>
                        </ReportCell>
                        <ReportCell>
                            <p>{objective.KnowledgeNeeded ? knowledge[objective.KnowledgeNeeded] : ""}</p>
                        </ReportCell>
                        <ReportCell>
                            <p>{objective.FundingDetail}</p>
                        </ReportCell>
                        <ReportCell>
                            <p>{formatDate(objective.StartDate ?? "")} - {formatDate(objective.ProjectedEndDate ?? "")} <br/> {objective.ScheduleDetail}</p>
                        </ReportCell>
                    </div>
                ))}
            </div>
            <footer className={`${styles.clearfix} clearfix`}>
                <div className={`${styles["f-col"]} f-col`}>
                    <p>Assistance</p>
                    <div className={`${styles["f-row"]} ${styles.clearfix} f-row clearfix`}>
                        <img src={image("assistance1.png")}/>
                        <p>Assisted</p>
                        <img src={image("assistance2.png")}/>
                        <p>DIY</p>
                    </div>
                </div>
                <div className={`${styles["f-col"]} f-col`}>
                    <p>Importance</p>
                    <div className={`${styles["f-row"]} f-row`}>
                        <img src={image("importance1.png")}/>
                        <p>Essential Need</p>
                        <img src={image("importance2.png")}/>
                        <p>Important Want</p>
                        <img src={image("importance3.png")}/>
                        <p>Aspirational Desire</p>
                    </div>
                </div>
                <div className={`${styles["f-col"]} f-col`}>
                    <p>Impact</p>
                    <div className={`${styles["f-row"]} f-row`}>
                        <img src={image("impact1.png")}/>
                        <p>High Impact</p>
                        <img src={image("impact2.png")}/>
                        <p>Low Impact</p>
                    </div>
                </div>
                <div className={`${styles["f-col"]} f-col`}>
                    <p>Status</p>
                    <div className={`${styles["f-row"]} f-row`}>
                        <img src={image("status1.png")}/>
                        <p>Complete</p>
                        <img src={image("status2.png")}/>
                        <p>In Progress</p>
                        <img src={image("status3.png")}/>
                        <p>Not Started</p>
                    </div>
                </div>
            </footer>
        </CurationReportBase>
    )
}

export default CurationSummaryReport;
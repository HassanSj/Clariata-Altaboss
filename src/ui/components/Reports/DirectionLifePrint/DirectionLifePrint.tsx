import React, {ReactElement, useEffect} from "react";
import {Person} from "~/types/api/person";
import PDFEmbedded, {IPDFReportOptions, logoBase64WithouText} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import moment from "moment";
import api from "~/services/api";
import { Objective, User } from "~/types/api/models";
import DirectionLogo from "./images/Clariata5DIcon_Direction.png";
import CurationSummaryTable from "../CurationSummaryReport/CurationSummaryTable";
import {generateQuarters} from "~/ui/components/GuideBook/GuideBook";
import {addMonths} from "~/ui/constants/utils";
import PDFReportExport from "../PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { IReportOptions } from "../PDFReportExport/PDFReportExport";
import { ActionItem } from "~/types/api/actionItem";

export interface WhyData {
    objectiveId: number;
    why?: string;
}

export interface DirectionLifePrintProps {
    household?: Household;
    persons?: Person[];
    objectives?: Objective[];
    year: number;
    isOpen?: boolean;
    onClose?: () => unknown;
    startDate?: string;
    endDate?: string;
    ownerName?: string;
}

export const backgroundColors = ["blue-bg", "dark-blue-bg", "orange-bg", "green-bg", "purple-bg"];
export const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export type DirectionLifeprintData = {
    priorities: string[],
    startDate: string,
    endDate: string,

}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param year
 * @param data
 */
export const getDirectionLifePrintData = async (householdId: number, interviewId: number, year: number, data: DirectionLifeprintData) => {

    // Fetch data
    const householdResponse = await api.household.get(householdId);

    const household = await householdResponse.data;
    const persons = await api.person.list(householdId);
    const objectives = await api.objective.list(householdId, interviewId);

    const selectedObjectives = objectives?.data?.filter(objective => data.priorities.includes(String(objective.ObjectiveID)))

    for (const selectedObjective of selectedObjectives) {
        const stakeholders = await api.objectivestakeholder.listFull(householdId, interviewId, selectedObjective?.ObjectiveID);
        if (stakeholders && stakeholders?.length > 0) selectedObjective.Stakeholders = stakeholders;

        const actionItems = await api.actionitem.listFull(householdId, selectedObjective?.ObjectiveID, interviewId);
        if (actionItems && actionItems?.length > 0) selectedObjective.ActionItemList = actionItems;
    }

    const primaryPersons = persons?.data?.filter(p => p?.PersonID === household?.PrimaryPerson1ID || p?.PersonID === household?.PrimaryPerson2ID);

    const owner = await getOwner(household);

    const ownerName = owner.owner.FirstName + " " + owner.owner.LastName;

    return {
        household: household,
        persons: primaryPersons,
        objectives: selectedObjectives,
        startDate: data.startDate,
        endDate: data.endDate,
        year: year,
        owner: ownerName,
    };
}

const getOwner = async (household: Household) => {

    let ownerId = String(household.CreatedBy);
    const ownerResponse = await api.user.getUser(ownerId);
    const owner = await ownerResponse.data;

    return {
        owner
    }
}

function quarterString(quarter: 1|2|3|4){
    switch (quarter){
        case 1:
            return "1st"
        case 2:
            return "2nd"
        case 3:
            return "3rd"
        case 4:
            return "4th"
    }
}

function generateMonths(start:Date, end:Date, limit: number = 12){
    const currentMonths: number[] = []

    for(let m = start; m <= end; m = addMonths(m, 1)!){
        if(currentMonths.length < limit){
            currentMonths.push(m.getMonth())
        }else{
            break;
        }
    }

    return currentMonths
}

/**
 * Main component
 * @param household
 * @param persons
 * @param objectives
 * @param year
 * @param isOpen
 * @param onClose
 * @param startDate
 * @param endDate
 * @constructor
 */
const DirectionLifePrint = ({household, persons, objectives, year, isOpen, onClose, startDate, endDate, ownerName}: DirectionLifePrintProps): ReactElement => {

    const startDateObject = moment(startDate).toDate();
    const endDateObject = moment(endDate).toDate();

    const quarters = generateQuarters(startDateObject, endDateObject).slice(0,4);
    const selectedMonths = generateMonths(startDateObject,endDateObject);    

    const reportOptions: IReportOptions = {
        storyofus: true,
        title: "Direction LifePrint",
        familyName: getFamilyName(household, persons),
        familyImage: household ? getFamilyPicture(household) : undefined,
        isOpen,
        onClose,
        header: false,
        }
    
    const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Direction-LifePrint",
    scale: 1,
    subject: 'Direction LifePrint',
    author: household?.CreatedBy,
    keepTogether: "keep-together",
    landscape: false,
    }

    /**
     * Calculate which quarter a month belongs to
     * @param month Number of month, js month so january is 0
     */
    function getQuarterByDate(date: Date): number {

        const month: number = moment(date).month();

        return moment(date).quarter()
        // if(month <= 3){
        //     return 1
        // }else if(month <= 6){
        //     return 2
        // }else if(month <= 9){
        //     return 3
        // }else{
        //     return 4
        // }
    }

    const getPersonName = (personId?: number) => {
        if (personId) {
            if (personId === 0) return "Both";
            const p = persons?.find(p => p?.PersonID === personId);
            return p?.PreferredName ?? p?.FirstName;
        }
        return " "
    }

    const getFundingClassNames = (objective: Objective, colorId: number, quarterId: number, yearNumber: number) => {
        if (objective?.StartDate && objective?.ProjectedEndDate) {
            const sd = moment(objective?.StartDate);
            const ed = moment(objective?.ProjectedEndDate).endOf('month');
            if(yearNumber < ed.year())
            {
                return `${backgroundColors[colorId]}`;
            }
            else 
            {   

                console.log("End Date: " + ed.toDate());
                if(quarterId < moment(ed).quarter())
                {
                    return `${backgroundColors[colorId]}`;
                }
                else
                {            
                    const month = moment(ed).month() + 1;
                    if((quarterId == 1 && month == 2) || (quarterId == 2 && month == 5) || (quarterId == 3 && month == 8) || (quarterId == 4 && month == 11))
                    {
                        console.log("Quarter: " + quarterId);
                        console.log("Month :" + month);
                        console.log("CSS: Long");
                        return `${backgroundColors[colorId]} left-long-bg`;
                    }
                    
                    if((quarterId == 1 && month == 1) || (quarterId == 2 && month == 4) || (quarterId == 3 && month == 7) || (quarterId == 4 && month == 10))
                    {
                        console.log("Quarter: " + quarterId);
                        console.log("Month :" + month);
                        console.log("CSS: Short");
                        return `${backgroundColors[colorId]} left-short-bg`;
                    }
                    
                    if((quarterId == 1 && month == 3) || (quarterId == 2 && month == 6) || (quarterId == 3 && month == 9) || (quarterId == 4 && month == 12))
                    {
                        console.log("Quarter: " + quarterId);
                        console.log("Month :" + month);
                        console.log("CSS: Filled");
                        return `${backgroundColors[colorId]}`;
                    }
                }

                return "";
            }

        } else return "";
    }

    const getActionStepsForMonth = (objective: Objective, monthId: number, startDate : Date, endDate: Date) => {
        console.log(objective?.ActionItemList);
        // const actionSteps = objective?.ActionItemList?.filter(a => {
        //     if (a?.StartDate) {
        //         const startYear = moment(a?.StartDate).year();
        //         if (startYear && startYear !== 1) {
        //             const endYear = a?.ActionItemStatusID === 6 && a?.CompletionDate ? moment(a?.CompletionDate).year() : undefined;
        //             const startMonth = moment(a?.StartDate).month();
        //             const endMonth = a?.ActionItemStatusID === 6 && a?.CompletionDate ? moment(a?.CompletionDate).month() : undefined;

        //             if (a?.ActionItemStatusID === 2) {
        //                 if (startYear <= year && startMonth <= monthId) return a;
        //             }
        //             if (endYear && endMonth && endYear >= year && startYear <= year && endMonth >= monthId && startMonth <= monthId) return a;
        //         }
        //     }

        let actionSteps: ActionItem[] = [];
        
        if(objective?.ActionItemList) {           
            actionSteps = objective?.ActionItemList?.filter(a => a?.StartDate && moment(a?.StartDate) >= moment(startDate) && moment(a?.StartDate) < moment(endDate) && moment(a.StartDate).month() == monthId);
        } 
        console.log(actionSteps);
        return (
            <td>
                {actionSteps?.map(a => {
                    return (
                        <>
                            {a?.Description} <br/>
                        </>
                    )
                })}
            </td>
        )
    }

    return (
        <>
            <PDFReportExport reportOptions={reportOptions} options={options} excludeFooter={true}>
            <table style={{width: "35.5in", maxHeight: "23.5in", margin: "10px", padding: "10px", border: "thin solid #ffffff"}}>
                <tbody>
                    <tr>
                        <td style={{width: "24in", border: "thin solid #7acaca", verticalAlign: "top", maxHeight: "8in", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                        <div className="first-table direction-top-left">
                                <div className="two-tables" style={{display: "flex"}}>
                                    <table className="img-quarters-table">
                                        <tr>
                                            <th>PRIORITIES / TIMING / RESOURCES</th>
                                        </tr>
                                        {objectives?.map((o, i) => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <div className="flex-row">
                                                            {o?.SuccessImageURL ?
                                                                <div className="flex-row-has-image">
                                                                    <img src={o.SuccessImageURL}/>
                                                                </div> : null}
                                                            <div className="flex-row-has-text">
                                                                <p className="priority">Priority {i + 1}</p>
                                                                {/* <p className="blue priority-small-text">{o?.Description.slice(0, 45).concat('...')}</p> */}
                                                                <p className="blue priority-small-text">{o?.Description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </table>
                                    <table className="quarters-table">
                                        <tr>
                                            {quarters.map(q => (
                                                <th>
                                                    <div>{quarterString(q.quarter)} Quarter {q.year}</div>
                                                </th>
                                            ))}
                                        </tr>
                                        <tr className="tr-hidden">
                                            <th/>
                                            <th/>
                                            <th/>
                                            <th/>
                                        </tr>
                                        {objectives?.map((o, i) => {
                                            return (
                                                <>
                                                    <tr>
                                                        {quarters.map((q, ind) => (
                                                            <td>                                                                
                                                                <div className={getFundingClassNames(o, i, q.quarter, q.year)}>
                                                                    {o.ProjectedEndDate ? moment(o.ProjectedEndDate).quarter() == q.quarter && moment(o.ProjectedEndDate).year() == q.year ? <div style={{color: "#fff", paddingTop: "30px", paddingRight: "10px", textAlign: "right", fontSize: "18px"}}>${o?.TotalFundingAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div> : (ind == 3 && moment(o.ProjectedEndDate).quarter() > q.quarter && moment(o.ProjectedEndDate).year() == q.year) || (ind == 3 && moment(o.ProjectedEndDate).year() > q.year) ? <div style={{color: "#fff", paddingTop: "30px", paddingRight: "10px", textAlign: "right", fontSize: "18px"}}>${o?.TotalFundingAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div> : null : null}
                                                                    
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr className="tr-hidden">
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                    </tr>
                                                </>
                                            )
                                        })}

                                    </table>
                                </div>
                            </div>
                        </td>                            
                        <td style={{width: "12in", height: "8in", border: "thin solid #7acaca", verticalAlign: "top", marginLeft: "10px"}}>
                            <CurationSummaryTable persons={persons} curationPriorities={objectives} small={true}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{width: "35in", border: "thin solid #7acaca", verticalAlign: "top", maxHeight: "12in", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                        <div style={{display: "flex"}}>
                        <div className="action-steps" style={{flex: "7"}}>
                            <div className="action-steps-side">
                                <p>MASTER SCHEDULE OF LIFE PURSUITS</p>
                            </div>
                            <div className="action-steps-main">
                                <p className="action-steps-headline blue">Action Steps</p>
                                <table className="action-steps-table">
                                    {objectives?.map((o, i) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>{o?.Description}</td>
                                                    {selectedMonths?.map((m, j) => {
                                                        return getActionStepsForMonth(o, m, startDateObject, endDateObject);
                                                    })}
                                                </tr>
                                                {i < objectives?.length - 1 ?
                                                    <tr>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                        <th/>
                                                    </tr>
                                                : null}
                                            </>
                                            )
                                        })}
                                        <tr>
                                            <td/>
                                            {selectedMonths.map(m => (
                                                <td>{months[m]}</td>
                                            ))}
                                        </tr>
                                </table>
                            </div>
                        </div>
                        <div style={{flex: "1", display: "flex", flexDirection: "column"}}>
                            <div style={{backgroundColor: "#364a65", flex: 1, color: "#ffffff", textAlign: "center", fontSize: "18px", fontWeight:"600", paddingTop: "30px"}}>
                            How will you measure success?
                            </div>
                            <div style={{flex:6}}>

                            </div>
                        </div>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div className="dlpr-footer">
                            {/* Footer from other lifeprints */}
                            <div style={{display: "flex", flexDirection: "row", border: "thin solid #7acaca", padding: "0px"}}>
                                <div style={{flex: "1"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img className="module-logo" src={DirectionLogo}/>
                                    </div>        
                                </div>
                                <div style={{flex: "1", alignContent: "flex-start", borderRight: "thin solid #7acaca"}}>
                                    <p className="blue" style={{fontSize: "59px"}}>Direction</p>
                                </div>
                                <div style={{flex: "5", alignContent: "center", borderRight: "thin solid #7acaca"}}>
                                    <p style={{fontSize: "32px", textAlign: "center"}} className="title dark-turquoise">Key Question</p>
                                    <p style={{fontSize: "46px", fontWeight: "600", textAlign: "center"}} className="question blue">Do you feel that you're pursuing what matters most?</p>
                                </div>
                                <div style={{flex: "2", display: "flex", flexDirection: "column", borderRight: "thin solid #7acaca"}}>
                                    <div style={{flex: "1", display: "flex", flexDirection: "row", borderBottom: "thin solid #7acaca", backgroundColor: "#eef8f7"}}>
                                        <div style={{flex: "1"}}>
                                            <img style={{maxHeight: "1in", width: "auto"}} src={household ? getFamilyPicture(household) : undefined}/>
                                        </div>
                                        <div style={{flex: "3", alignSelf: "center"}}>
                                            <p style={{fontSize: "24px", fontWeight: "600", textAlign: "left"}} className="blue">{getFamilyName(household, persons)}</p>
                                        </div>
                                        <div style={{flex: "1"}}>
                                            
                                        </div>
                                    </div>
                                    <div style={{flex: "1", display: "flex", flexDirection: "row"}}>
                                        <div className="f-col-left" style={{paddingLeft: "15px"}}>
                                            <p className="blue" style={{ fontSize: "16px", fontWeight: "600"}}>
                                                {ownerName}
                                            </p>
                                        </div>
                                        {/* <div className="f-col-right">
                                            <div className="f-col-inline">
                                                <p className="blue">Financial<br/> Advisor </p>
                                            </div>
                                            <div className="f-col-inline">
                                                <img src="images/header-img.jpg"/>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div style={{flex: "1", padding: "5px"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img style={{height: "1in", width: "auto"}} src={logoBase64WithouText}/>
                                        <div style={{textAlign: "center", fontSize: "42px", fontWeight: "600"}} className="blue">Clariata</div>
                                        <div style={{textAlign: "center", fontSize: "32px", fontWeight: "600"}} className="orange">
                                            clariata.com
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* END Footer from other lifeprints */}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </PDFReportExport>
        </>
    )
}


export default DirectionLifePrint;

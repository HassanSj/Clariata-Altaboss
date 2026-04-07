import moment from "moment"
import {ReactElement} from "react"
import {Objective} from "~/types/api/models"
import {Person} from "~/types/api/person"
import {Household} from "~/types/api/household"
import {objectiveKnowledgeLevels, objectiveKnowledgeTask, objectiveTimingFrequency} from "~/ui/constants/objectives"
import assistance1 from "../images/assistance1.png";
import assistance2 from "../images/assistance2.png";
import importance1 from "../images/importance1.png";
import importance2 from "../images/importance2.png";
import importance3 from "../images/importance3.png";
import impact1 from "../images/impact1.png";
import impact2 from "../images/impact2.png";
import status1 from "../images/status1.png";
import status2 from "../images/status2.png";
import status3 from "../images/status3.png";
import {PersonType} from "~/ui/constants/api"
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import {getFamilyName, getFamilyPicture, getCouplePicture} from "~/ui/components/Reports/StoryOfUsReport/StoryOfUsReport"

export interface CurationSummaryTableProps {
    household?: Household;
    persons?: Person[];
    curationPriorities?: Objective[];
    small?: boolean;
}

export const getPersonFullName = (person: Person | undefined) => {
    if (person?.FirstName) {
        return (person?.PreferredName ? person?.PreferredName : person?.FirstName) + ' ' + person?.LastName;
    }
    return '';
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

const CurationSummaryTable = ({ household, persons,
                                curationPriorities,
                                small }: CurationSummaryTableProps): ReactElement => {

    var minDate = moment.utc("0001-01-01");

    const headerProps = {
        showHeader: true,
        title: "Curation Summary Report",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getCouplePicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: reportLogo
        };
    return (
        <div>
                <Header showHeader={headerProps.showHeader}
                title={headerProps.title} 
                subTitle={headerProps.subTitle}
                image={headerProps.image} 
                familyName={headerProps.familyName} 
                headerNoRight={headerProps.headerNoRight} 
                reportLogo={headerProps.reportLogo}
                worksheet={headerProps.worksheet}
                storyofus={headerProps.storyofus}/>
        <div className={small ? "curationsummary-table-small" : "curationsummary-table"}>
            <div className="curationsummary-heading">
                <p>priority</p>
                <p>CHAMPION</p>
                <p>FAMILY MEMBER STAKEHOLDERS</p>
                <p>EXTERNAL STAKEHOLDERS</p>
                <p>KNOWLEDGE</p>
                {small ? null : <p>FUNDING</p> }
                {small ? null : <p>SCHEDULING</p> }
            </div>
            {curationPriorities?.map(objective => {
                return (
                    <div className="curationsummary-row">
                        <div className="curationsummary-col">
                            <p><strong>{objective?.Description}</strong></p>
                            <div className="curationsummary-images">
                                {objective?.AssistanceNeeded || objective?.DIY ? <img
                                    src={objective?.AssistanceNeeded ? assistance1 : assistance2}/> : null}
                                {objective?.Importance ? <img src={importance1}/> : null}
                                {objective?.PersonalImpactLevel ? <img src={impact1}/> : null}
                                {objective?.StatusID ? <img src={status1}/> : null}
                            </div>
                        </div>
                        <div className="curationsummary-col">
                            <p>{getPersonFullName(persons?.find(p => p.PersonID == objective?.Champion))}</p>
                        </div>
                        <div className="curationsummary-col">
                            <p>{objective?.Stakeholders && objective?.Stakeholders?.length > 0 && objective?.Stakeholders?.filter(s => s?.Person?.PersonTypeID == PersonType.FAMILY || s?.Person?.PersonTypeID == PersonType.PRIMARY).map(s => getPersonFullName(s.Person) + ',')}</p>
                        </div>
                        <div className="curationsummary-col">
                            <p>{objective?.Stakeholders && objective?.Stakeholders?.length > 0 && objective?.Stakeholders?.filter(s => s?.Person?.PersonTypeID != PersonType.FAMILY && s?.Person?.PersonTypeID != PersonType.PRIMARY).map(s => {
                                return (
                                    <>
                                        {getPersonFullName(s.Person)}<br/>
                                        {/*+ (s.Person?.Occupation ? ',' : '')*/}
                                        {/*{s.Person?.Occupation}<br/>*/}
                                    </>
                                )
                            })}</p>
                        </div>
                        <div className="curationsummary-col">
                            <p>{objectiveKnowledgeLevels.find(k => k.value == String(objective?.KnowledgeNeeded))?.label}<br/>
                                {objectiveKnowledgeTask.find(k => k.value == String(objective?.KnowledgeTask))?.label}
                            </p>
                        </div>
                        {small ? null :
                        <>
                        <div className="curationsummary-col">
                            {objective?.TotalFundingAmount && objective?.TotalFundingAmount > 0 ?
                            <p>${objective.TotalFundingAmount.toLocaleString()}</p>
                            : null }
                        </div>
                        <div className="curationsummary-col">
                            <p>
                                {moment.utc(objective?.StartDate).isAfter(minDate) ? moment(objective?.StartDate).format('M/D/YYYY') : null }
                                {(moment.utc(objective?.StartDate).isAfter(minDate) && moment.utc(objective?.ProjectedEndDate).isAfter(minDate)) ? " - "
                                : 
                                (!(moment.utc(objective?.StartDate).isAfter(minDate)) && moment.utc(objective?.ProjectedEndDate).isAfter(minDate))
                                ? 
                                " - "
                                :
                                (((moment.utc(objective?.StartDate).isAfter(minDate)) && !(moment.utc(objective?.ProjectedEndDate)).isAfter(minDate)))
                                ?
                                " - "
                                :
                                null
                                }
                                {moment.utc(objective?.ProjectedEndDate).isAfter(minDate) ? moment(objective?.ProjectedEndDate).format('M/D/YYYY') : null }
                                <br/><br/>
                                {objectiveTimingFrequency.find(k => k.value == String(objective?.ScheduleFrequencyID))?.label}
                            </p>
                        </div>
                        </> }
                    </div>

                )
            })}

            <div style={{display: "flex", flexDirection: "row", fontSize: "6px", alignSelf: "center", marginTop: "5px", border: ".5px solid #72c6c7" }}>
                <div style={{alignSelf: "center", marginLeft: "10px"}}>
                    <p style={{flex: "1", alignSelf: "center", fontWeight: "600", marginBottom: "0px"}}>Assistance:</p>             
                    <div style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
                        {/* <div className="blue" style={{flex: "1", alignSelf: "center", fontWeight: "600"}}>Assistance:</div> */}
                        <img src={assistance1} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{flex: "1", alignSelf: "center", margin: "10px 2.5px"}}>Assisted</div>
                        <img src={assistance2} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{flex: "1", alignSelf: "center", margin: "10px 2.5px"}}>DIY</div>
                    </div>
                </div>
                <div style={{alignSelf: "center", marginLeft: "10px"}}>
                    <p style={{flex: "1", alignSelf: "center", fontWeight: "600", marginBottom: "0px"}}>Importance:</p>
                    <div style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
                        {/* <div style={{flex: "1", alignSelf: "center", fontWeight: "600"}}>Importance:</div> */}
                        <img src={importance1} style={{height: "8px", width: "auto", alignSelf: "center"}} />
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Essential Need</div>
                        <img src={importance2} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Important Want</div>
                        <img src={importance3} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Aspirational Desire</div>
                    </div>
                </div>
                <div style={{alignSelf: "center", marginLeft: "10px"}}> 
                    <p style={{flex: "1", alignSelf: "center", fontWeight: "600", marginBottom: "0px"}}>Impact:</p>                   
                    <div style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
                        {/* <div style={{flex: "1", alignSelf: "center", fontWeight: "600"}}>Impact:</div> */}
                        <img src={impact1} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>High</div>
                        <img src={impact2} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Low</div>
                    </div>
                </div>
                {small ? null :
                <div style={{alignSelf: "center", marginLeft: "10px"}}>
                    <p style={{flex: "1", alignSelf: "center", fontWeight: "600", marginBottom: "0px"}}>Status:</p>
                    <div style={{display: "flex", flexDirection: "row", alignSelf: "center"}}>
                        <img src={status1} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Complete</div>
                        <img src={status2} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>In Progress</div>
                        <img src={status3} style={{height: "8px", width: "auto", alignSelf: "center"}}/>
                        <div style={{margin: "10px 10px", alignSelf: "center"}}>Not Started</div>
                    </div>
                </div> }
            </div>
        </div>
        </div>
    )

}

export default CurationSummaryTable;

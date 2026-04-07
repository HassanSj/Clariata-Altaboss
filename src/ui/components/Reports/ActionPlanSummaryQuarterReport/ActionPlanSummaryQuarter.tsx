import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import { Objective } from "~/types/api/models";
import assistance1 from "./images/assistance1.png";
import assistance2 from "./images/assistance2.png";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import { shouldAppearInThisMonth } from "../../Modules/Direction/DirectionStrategySummaryTab/DirectionStrategySummaryTab";
import person1 from "../WhyReport/images/person1.png"
import person2 from "../WhyReport/images/person2.png"
import both from "../WhyReport/images/both.png"
import other from "../WhyReport/images/other.png"
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

export interface ActionPlanSummaryQuarterProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  year: number;
  quarter: number;
  dimensions?: DimensionOfLife[];
  metrics?: MetricOfSuccess[];
  startMonth?:number;
  endMonth?:number;
  months?: string[]
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const MonthsByQuarter = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const ActionPlanSummaryQuarter = ({ household, persons, objectives, year, quarter, dimensions, metrics, months}: ActionPlanSummaryQuarterProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: "Action Plan Summary",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: reportLogo
  };

  return (
    <>
        <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
        <div className="ppw-top">
            <div className="action-plan-body-copy">
                <table className="action-plan-table">
                    <tr>
                        <th rowSpan={2} style={{width: "10px"}}></th>
                        <th rowSpan={2}>Priorities</th>
                        <th rowSpan={2}>Champ.</th>
                        <th>Dimension</th>
                        <th rowSpan={2}>DIY or Assisted</th>
                        {months?.map(q => {
                            return (
                                <th rowSpan={2}>{q !== "" ? `${q} ${year}` : q}</th>
                            )
                        })}
                    </tr>
                    <tr>
                        <th>Metric</th>
                    </tr>
                    {objectives?.map((o, i) => {
                        const colorClass = o?.Champion == household?.PrimaryPerson1ID ? "dark-turquoise" : o?.Champion == household?.PrimaryPerson2ID ? "orange" : "blue";
                        return (
                            <>
                                <tr>
                                    <td rowSpan={2} style={{width: "10px", textAlign: "center", verticalAlign: "middle"}} className={colorClass}><strong>{i+1}</strong></td>
                                    <td rowSpan={2} className={colorClass}><strong>{o?.Description}</strong></td>
                                    <td rowSpan={2}><img style={{maxHeight: '20px'}} src={o?.Champion === household?.PrimaryPerson1ID ? person1 : o?.Champion === household?.PrimaryPerson2ID ? person2 : o?.Champion === 0 ? both : other}/></td>
                                    <td className={colorClass}>{dimensions?.find(d => d.DimensionOfLifeID == o?.DimensionOfLifeID)?.DimensionOfLife}</td>
                                    <td rowSpan={2}><img className="action-plan-image" src={o?.AssistanceNeeded ? assistance1 : o?.DIY ? assistance2 : undefined}/></td>
                                    {months?.map(q => {
                                        const currentMonth = new Date(q === "" ? 0 : year, MonthsByQuarter.indexOf(q));
                                        const actionItems = o?.ActionItemList?.filter(a =>  shouldAppearInThisMonth(a, currentMonth))
                                        return (
                                            <td rowSpan={2} className="dark-turquoise">
                                                {actionItems?.map(a => {
                                                    return (
                                                        <p className={a?.AssistanceNeeded ? "purple" : "dark-turquoise"}>
                                                            {a?.AssistanceNeeded ? 
                                                                <em>- {a?.Description} </em> 
                                                            : 
                                                            <>- {a?.Description} </> }
                                                        </p>
                                                    )
                                                })}
                                            </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    <td className={colorClass}>{metrics?.find(m => m.MetricOfSuccessID == o?.MetricOfSuccessID)?.MetricOfSuccess}</td>
                                </tr>
                            </>
                        )
                    })}
                </table>
                <div className="action-plan-details-table">
                    <div className="action-plan-f-col">
                        <p className="blue" style={{marginTop: "2px", marginBottom: "2px"}}>Who</p>
                        <div className="action-plan-f-row clearfix" style={{display: "flex", justifyContent: "space-evenly"}}>
                            <div className="action-plan-legend">
                                <img src={person1} className="action-plan-legend-img"/>
                                <p className="blue action-plan-legend-text">{persons?.find(p => p?.PersonID === household?.PrimaryPerson1ID)?.FirstName}</p>
                            </div>
                            <div className="action-plan-legend">
                                <img src={person2} className="action-plan-legend-img"/>
                                <p className="blue action-plan-legend-text" >{persons?.find(p => p?.PersonID === household?.PrimaryPerson2ID)?.FirstName}</p>
                            </div>
                            <div className="action-plan-legend">
                                <img src={both} className="action-plan-legend-img"/>
                                <p className="blue action-plan-legend-text">Both</p>
                            </div>
                            <div className="action-plan-legend">
                                <img src={other} className="action-plan-legend-img"/>
                                <p className="blue action-plan-legend-text">Other</p>
                            </div>
                        </div>
                    </div>
                    <div className="action-plan-f-col">
                        <p className="blue" style={{marginTop: "2px", marginBottom: "2px"}}>Assistance</p>
                        <div className="action-plan-f-row clearfix" style={{display: "flex", justifyContent: "space-evenly"}}>
                            <div>
                                <img src={assistance1} className="action-plan-legend-img"/>
                                <p className="purple action-plan-legend-text"><em>Assisted</em></p>
                            </div>
                            <div>
                                <img src={assistance2} className="action-plan-legend-img"/>
                                <p className="blue action-plan-legend-text">DIY</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </>
  )
}


export default ActionPlanSummaryQuarter;

import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import moment from "moment";
import person1 from '../WhyReport/images/person1.png'
import person2 from '../WhyReport/images/person2.png';
import both from '../WhyReport/images/both.png';
import assistance1 from "../CurationSummaryReport/images/assistance1.png";
import assistance2 from "../CurationSummaryReport/images/assistance2.png";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

export interface GanttChartProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  year: number;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const GanttChart = ({ household, persons, objectives, year }: GanttChartProps): ReactElement => {
 
  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];
  const dimensions = ['Self', 'Family', 'Work-life', 'Community'];

  const headerProps = {
    showHeader: true,
    title: "Gantt Chart Report",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
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
            <div className="body-copy">
            {/* <div className={ "body-copy" : "body-copy rotate-270"}> */}
                <table className="gantt-chart-table">
                    <tr>
                          <th rowSpan={2}></th>
                          <th rowSpan={2}>Priorities</th>
                          <th>Dimension</th>
                          <th rowSpan={2}>DIY or Assisted</th>
                          <th rowSpan={2}>JAN 2022</th>
                          <th rowSpan={2}>FEB 2022</th>
                          <th rowSpan={2}>MAR 2022</th>
                          <th rowSpan={2}>APR 2022</th>
                          <th rowSpan={2}>MAY 2022</th>
                          <th rowSpan={2}>JUN 2022</th>
                          <th rowSpan={2}>JUL 2022</th>
                          <th rowSpan={2}>AUG 2022</th>
                          <th rowSpan={2}>SEP 2022</th>
                          <th rowSpan={2}>OCT 2022</th>
                          <th rowSpan={2}>NOV 2022</th>
                          <th rowSpan={2}>DEC 2022</th>
                    </tr>
                    <tr>
                          <th>Metric</th>
                    </tr>
                    {objectives?.map((o,i) => {
                        const colorClass = o?.PersonID == household?.PrimaryPerson1ID ? "dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "orange" : "blue";
                        const startDate = o?.StartDate ? moment(o?.StartDate).toDate() : undefined;
                        const endDate = o?.ProjectedEndDate ? moment(o?.ProjectedEndDate).toDate() : undefined;
                        const noDate = moment('0001-01-01 00:00:00').toDate();
                        return (
                            <>
                                <tr>
                                <td rowSpan={2} className={colorClass}><strong>{i+1}</strong></td>
                                <td rowSpan={2} className={colorClass}><strong>{o?.Description}</strong></td>
                                <td className={colorClass}>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                <td rowSpan={2} style={{textAlign: "center"}}><img height="20" src={o?.AssistanceNeeded ? assistance1 : o?.DIY ? assistance2 : undefined}/></td>
                                {months?.map((m,i) => {
                                    const currentDate = moment( (i+1) + '/' + year, 'M/YYYY').toDate();
                                    if(startDate && moment(startDate).diff(noDate,'days') != 0) {
                                        if(endDate && moment(endDate).diff(noDate,'days') != 0) {
                                            if(moment(currentDate).diff(startDate,'days') > 0  && moment(endDate).diff(currentDate,'days') > 0) {
                                                return (<td rowSpan={2} className={colorClass + ' background'}></td>)
                                            }
                                        } else {
                                            if(moment(currentDate).diff(startDate,'days') > 0) {
                                                return (<td rowSpan={2} className={colorClass + ' background'}></td>)
                                            }
                                        }
                                    }
                                    return (<td rowSpan={2}></td>)
                                })}
                            </tr>
                            <tr>
                                <td className={colorClass}>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                            </tr>
                            </>
                        )
                    })}
                </table>
                <div className="gantt-short-details-table">
                    <div className="f-col">
                        <p className="blue">Who</p>
                        <div className="f-row clearfix">
                            {household?.PrimaryPerson1ID ? 
                            <>
                                <img src={person1}/>
                                <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID)?.FirstName}</p>
                            </> : null}

                            {household?.PrimaryPerson2ID ? 
                            <>
                                <img src={person2}/>
                                <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson2ID)?.FirstName}</p>
                            </> : null}

                            {household?.PrimaryPerson1ID && household?.PrimaryPerson2ID? 
                            <>
                                <img src={both}/>
                                <p>Both</p>
                            </> : null}
                        </div>
                    </div>
                    <div className="f-col">
                        <p className="blue">Assistance</p>
                        <div className="f-row clearfix">
                            <img src={assistance1}/>
                            <p className="purple"><em>Assisted</em></p>
                            <img src={assistance2}/>
                            <p className="blue">DIY</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}


export default GanttChart;

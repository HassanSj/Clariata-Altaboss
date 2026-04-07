import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import person1 from "../WhyReport/images/person1.png"
import person2 from "../WhyReport/images/person2.png"
import both from "../WhyReport/images/both.png"
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

export interface PriorityRankingProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

const PriorityRanking = ({ household, persons, objectives }: PriorityRankingProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: "Priority Ranking Report",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: reportLogo
  };

  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];
  const dimensions = ['Self', 'Family', 'Work-life', 'Community'];

  let index = 0;

  const objectivesToShow: Objective[] = objectives?.filter(obj => !obj.IsHidden) ?? []
  console.log(objectivesToShow);
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
          <div className="priority-ppw-top">
                  <div className="body-copy">
                  {objectivesToShow?.some(o => o?.TimeframeID == 1) ?
                     <div>
                     <table className="priority-table">
                        <thead>
                           <tr>
                              <th></th>
                              <th>Now</th>
                              <th>Who</th>
                              <th>Dimension</th>
                              <th>Metric</th>
                              <th>DIY</th>
                              <th>Assisted</th>
                           </tr>
                        </thead>
                        <tbody>
                            {objectivesToShow?.map((o) => {
                                if(o?.TimeframeID == 1) {
                                    index++;
                                    return (
                                        <tr>
                                            <td>{o?.Rank}</td>
                                            <td>{o?.Description}</td>
                                            <td>{o?.PersonID === 0 ? "Both " : persons?.find(p => p?.PersonID == o?.PersonID)?.FirstName}  </td>
                                            <td>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                            <td>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                                            <td>{o?.DIY ? '•' : ''}</td>
                                            <td>{o?.AssistanceNeeded ? '•' : ''}</td>
                                        </tr>
                                    )
                                }
                            })}
                           
                        </tbody>
                    </table>
                    </div> : null }
                    {objectivesToShow?.some(o => o?.TimeframeID == 2) ?
                    <>
                    {/* <div className="newPage"></div>
                    <Header showHeader={headerProps.showHeader}
                    title={headerProps.title} 
                    subTitle={headerProps.subTitle}
                    image={headerProps.image} 
                    familyName={headerProps.familyName} 
                    headerNoRight={headerProps.headerNoRight} 
                    reportLogo={headerProps.reportLogo}
                    worksheet={headerProps.worksheet}
                    storyofus={headerProps.storyofus}/> */}
                    <div>
                    <table className="priority-table">
                        <thead>
                           <tr>
                              <th></th>
                              <th>Later</th>
                              <th>Who</th>
                              <th>Dimension</th>
                              <th>Metric</th>
                              <th>DIY</th>
                              <th>Assisted</th>
                           </tr>
                        </thead>
                        <tbody>
                            {objectivesToShow?.map((o) => {
                                if(o?.TimeframeID == 2) {
                                    index++;
                                    return (
                                        <tr>
                                            <td>{o.Rank}</td>
                                            <td>{o?.Description}</td>
                                            <td>{o?.PersonID === 0 ? "Both " : persons?.find(p => p?.PersonID == o?.PersonID)?.FirstName}  </td>
                                            <td>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                            <td>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                                            <td>{o?.DIY ? '•' : ''}</td>
                                            <td>{o?.AssistanceNeeded ? '•' : ''}</td>
                                        </tr>
                                    )
                                }
                            })}
                           
                        </tbody>
                    </table>
                    </div>
                    </> : null }
                    {objectivesToShow?.some(o => o?.TimeframeID == 3) ?
                    <>
                    {/* <div className="newPage"></div>
                    <Header showHeader={headerProps.showHeader}
                    title={headerProps.title} 
                    subTitle={headerProps.subTitle}
                    image={headerProps.image} 
                    familyName={headerProps.familyName} 
                    headerNoRight={headerProps.headerNoRight} 
                    reportLogo={headerProps.reportLogo}
                    worksheet={headerProps.worksheet}
                    storyofus={headerProps.storyofus}/>*/}
                    <div> 
                    <table className="priority-table">
                        <thead>
                           <tr>
                              <th></th>
                              <th>Long Term</th>
                              <th>Who</th>
                              <th>Dimension</th>
                              <th>Metric</th>
                              <th>DIY</th>
                              <th>Assisted</th>
                           </tr>
                        </thead>
                        <tbody>
                            {objectivesToShow?.map((o) => {
                                if(o?.TimeframeID == 3) {
                                    index++;
                                    return (
                                        <tr>
                                            <td>{o.Rank}</td>
                                            <td>{o?.Description}</td>
                                            <td>{o?.PersonID === 0 ? "Both " : persons?.find(p => p?.PersonID == o?.PersonID)?.FirstName}  </td>
                                            <td>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                            <td>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                                            <td>{o?.DIY ? '•' : ''}</td>
                                            <td>{o?.AssistanceNeeded ? '•' : ''}</td>
                                        </tr>
                                    )
                                }
                            })}
                           
                        </tbody>
                    </table>
                    </div>
                    </>  : null}
                    {objectivesToShow?.some(o => o?.TimeframeID == 0) ?
                     <>
                     {/* <div className="newPage"></div>
                     <Header showHeader={headerProps.showHeader}
                     title={headerProps.title} 
                     subTitle={headerProps.subTitle}
                     image={headerProps.image} 
                     familyName={headerProps.familyName} 
                     headerNoRight={headerProps.headerNoRight} 
                     reportLogo={headerProps.reportLogo}
                     worksheet={headerProps.worksheet}
                     storyofus={headerProps.storyofus}/> */}
                     <div>
                     <table className="priority-table">
                        <thead>
                           <tr>
                              <th></th>
                              <th>Other</th>
                              <th>Who</th>
                              <th>Dimension</th>
                              <th>Metric</th>
                              <th>DIY</th>
                              <th>Assisted</th>
                           </tr>
                        </thead>
                        <tbody>
                            {objectivesToShow?.map((o) => {
                                if(o?.TimeframeID == 0) {
                                    index++;
                                    return (
                                        <tr>
                                            <td>{o.Rank}</td>
                                            <td>{o?.Description}</td>
                                            <td>{o?.PersonID === 0 ? "Both " : persons?.find(p => p?.PersonID == o?.PersonID)?.FirstName}  </td>
                                            <td>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                            <td>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                                            <td>{o?.DIY ? '•' : ''}</td>
                                            <td>{o?.AssistanceNeeded ? '•' : ''}</td>
                                        </tr>
                                    )
                                }
                            })}
                           
                        </tbody>
                    </table>
                    </div>
                    </> : null }
                </div>
            </div>

    </>
  )
}


export default PriorityRanking;

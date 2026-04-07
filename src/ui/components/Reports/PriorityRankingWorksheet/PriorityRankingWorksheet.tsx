import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import { convertStringToDateText } from "~/ui/constants/utils";
import moment from "moment";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";

export interface PriorityRankingWorksheetProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param quarter
 * @param year
 */
 export const getPriorityRankingWorksheetProps = async (householdId: number, interviewId: number, ) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
  
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
  
    const res = await api.objective.list(householdId, interviewId);
    let objectives = res?.data;
    objectives?.sort((a, b) => a.Rank && b.Rank ? (a.Rank > b.Rank ? 1 : -1) : -1);
    
    return {
      household: household?.data,
      persons: persons?.data,
      objectives: objectives,
    };
  }

const PriorityRankingWorksheet = ({ household, persons, objectives, isOpen, onClose }: PriorityRankingWorksheetProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Priority Ranking Worksheet',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    isOpen,
    onClose,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: ["8.5in", "11in"],
    fileName: "Priority-Ranking-Worksheet",
    scale: 1,
    subject: "Dream: Priority Ranking Worksheet",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    landscape: false,
  }

  const headerProps = {
    showHeader: true,
    title: "Priority Ranking Worksheet",
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

  const objectivesToShow: Objective[] = objectives?.filter(obj => !obj.IsHidden) ?? []
  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => {
        router.back();
        }}
        style={{ width: '151px', marginLeft: '0px', marginBottom: '15px' }}
      >
         Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions}>
        <>
        <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
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
                  <div className="priority-worksheet-body-copy">
                     <table className="priority-worksheet">
                        <thead>
                            <th></th>
                            <th></th>
                            <th colSpan={3}>Priority Phase</th>
                            <th colSpan={4}>Completion Window</th>
                            <th colSpan={2}>Assistance</th>
                        </thead>
                        <tbody>
                            <tr className="priority-header">
                                <td colSpan={2}>Rank</td>
                                <td>Priority</td>
                                <td>Dimension</td>
                                <td>Metric</td>
                                <td>Now</td>
                                <td>Later</td>
                                <td>Long Term</td>
                                <td>Start Date</td>
                                <td>DIY</td>
                                <td>Assisted</td>
                            </tr>
                            {objectivesToShow?.map(o => {
                                return (
                                    <tr>
                                        <td style={{width: "10px"}}>{o?.Rank}</td>
                                        <td style={{width: "10px"}}></td>
                                        <td style={{textAlign: "left"}}>{o?.Description}</td>
                                        <td>{o?.DimensionOfLifeID ? dimensions[o?.DimensionOfLifeID-1] : ''}</td>
                                        <td>{o?.MetricOfSuccessID ? metrics[o?.MetricOfSuccessID-1] : ''}</td>
                                        {o?.TimeframeID == 1 ? <td> &#8226;</td> : <td></td> }
                                        {o?.TimeframeID == 2 ? <td> &#8226;</td> : <td></td> }
                                        {o?.TimeframeID == 3 ? <td> &#8226;</td> : <td></td> }

                                        <td>{o?.StartDate && (moment('01/01/0001').subtract(2000, 'years').diff(o?.StartDate, 'days'))? convertStringToDateText(o?.StartDate, o?.StartDateType) : ''}</td>
                                        {o?.DIY ? <td> &#8226;</td> : <td></td> }
                                        {o?.AssistanceNeeded ? <td> &#8226;</td> : <td></td> }
                                    </tr>
                                )
                            })}
                           
                        </tbody>
                        </table>
                        </div>
                        </div>
                    </ReportWrapper>
        </>
      </PDFReportExport>
    </>
  )
}


export default PriorityRankingWorksheet;

import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getCouplePicture, getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import person1 from "../WhyReport/images/person1.png"
import person2 from "../WhyReport/images/person2.png"
import both from "../WhyReport/images/both.png"
import PriorityRanking from "./PriorityRanking";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";
import { PageMargin } from "@progress/kendo-drawing/pdf";

export interface PriorityRankingReportProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param quarter
 * @param year
 */
 export const getPriorityRankingReportProps = async (householdId: number, interviewId: number, ) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
  
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
  
    const objectives = await api.objective.list(householdId, interviewId);
    
    return {
      household: household?.data,
      persons: persons?.data,
      objectives: objectives?.data,
    };
  }

const PriorityRankingReport = ({ household, persons, objectives }: PriorityRankingReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Priority Ranking Report',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    header: true,
  }

  const margins : PageMargin = {
    left: "0pt",
    right: "0pt",
    top: "0pt",
    bottom: "0pt",
}

  const options: PDFExportProps = {
    paperSize: ["8.5in", "11in"],
    fileName: "Priority-Ranking-Report",
    scale: 1,
    subject: "Priority Ranking Report",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    landscape: false,
  }

  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];
  const dimensions = ['Self', 'Family', 'Work-life', 'Community'];

  let index = 0;

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
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={false} margins={margins}>
          <>
          <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)}  >
            <PriorityRanking household={household} persons={persons} objectives={objectives}/>
          </ReportWrapper>
        </>
      </PDFReportExport>
    </>
  )
}


export default PriorityRankingReport;

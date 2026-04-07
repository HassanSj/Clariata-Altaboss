import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getCouplePicture, getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
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
import GanttChart from "./GanttChart";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";

export interface GanttChartReportProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  year: number;
  isOpen?: boolean;
  onClose?: () => unknown;
  isModal?: boolean;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param quarter
 * @param year
 */
 export const getGanttChartReportProps = async (householdId: number, interviewId: number, year: number, showAll?: boolean) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
  
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
  
    const objectives = await api.objective.list(householdId, interviewId);

    let selectedObjectives: Objective[] = [];

    if(!showAll || typeof showAll == 'undefined') {
        const res = await api.objective.getSelectedList(householdId);
        const selectedList  = res?.data?.SelectedObjectiveList as Objective[];

        selectedObjectives = objectives?.data?.filter( objective => {
            if(selectedList.some(o => o.ObjectiveID === objective.ObjectiveID)){
                return objective;
            };
        })
    }
    else {
         selectedObjectives = objectives?.data;
    }
    
    return {
      household: household?.data,
      persons: persons?.data,
      objectives: selectedObjectives,
      year: year ? year: 2022
    };
  }

const GanttChartReport = ({ household, persons, objectives, year, isOpen, onClose, isModal }: GanttChartReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Gantt Chart Report',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Gantt-Chart-Report",
    scale: 1,
    subject: "Direction: Gannt Chart Report",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    landscape: true,
    
  }  

  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];
  const dimensions = ['Self', 'Family', 'Work-life', 'Community'];

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
            <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} isLandscape={true} isWide={true}  >
              <GanttChart household={household} persons={persons} objectives={objectives} year={year} />
            </ReportWrapper>
        </PDFReportExport>
    </>
  )
}


export default GanttChartReport;

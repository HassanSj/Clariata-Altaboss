import React, {ReactElement} from "react";
import {Family} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
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
import ActionPlanSummaryQuarter from "./ActionPlanSummaryQuarter";
import { getCouplePicture } from "../StoryOfUsReport/StoryOfUs";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";

export interface ActionPlanSummaryQuarterReportProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  year: number;
  quarter: number;
  dimensions?: DimensionOfLife[];
  metrics?: MetricOfSuccess[];
  startMonth?:number;
  endMonth?:number;
  isOpen?: boolean;
  onClose?: () => unknown;
  goBack?: boolean;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const MonthsByQuarter = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param quarter
 * @param year
 * @param startMonth
 * @param endMonth
 */
 export const getActionPlanSummaryReportProps = async (householdId: number, interviewId: number, quarter: number, year: number, startMonth?:number, endMonth?:number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
  
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
  
    const objectives = await api.objective.list(householdId, interviewId);

    const res = await api.objective.getSelectedList(householdId);
    const selectedList  = res?.data?.SelectedObjectiveList as Objective[];

    const selectedObjectives = objectives?.data?.filter( objective => {
        if(selectedList.some(o => o.ObjectiveID === objective.ObjectiveID)){
            return objective;
        };
    })

    for (let selectedObjective of selectedObjectives) {
        const actionItems = await api.actionitem.listFull(householdId, selectedObjective?.ObjectiveID, interviewId);
        selectedObjective.ActionItemList = actionItems;
    }

    const dimensions = await api.dimensionofsuccess.list();
    const metrics = await api.metricofsuccess.list();
    
    return {
      household: household?.data,
      persons: persons?.data,
      objectives: selectedObjectives,
      quarter: quarter,
      year: year,
      dimensions: dimensions?.data,
      metrics: metrics?.data,
      startMonth: startMonth,
      endMonth: endMonth
    };
  }

const ActionPlanSummaryQuarterReport = ({ 
                                      household, 
                                      persons,
                                      objectives,
                                      year,
                                      quarter,
                                      dimensions,
                                      metrics,
                                      startMonth,
                                      endMonth,
                                      isOpen,
                                      onClose,
                                      goBack }: ActionPlanSummaryQuarterReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Action Plan Summary',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    isOpen,
    onClose,
    header: true
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Action-Plan-Summary",
    scale: 1,
    subject: 'Action Plan Summary',
    author: household?.CreatedBy,
    keepTogether: ".keep-together"
  }
  let pages = []
  const selectedMonths:string[] = (MonthsByQuarter.slice(startMonth, endMonth ? endMonth + 1 : startMonth)).flatMap(mon => mon);
  if(selectedMonths?.length < 3){
    pages?.push({months: selectedMonths})
  }
  else{
    for (let i = 0; i < selectedMonths.length; i += 3) {
      const chunk = selectedMonths.slice(i, i + 3).flatMap(mon => mon);
      pages?.push({ months: chunk });
    }
  }

  if(pages && pages[pages.length - 1]?.months?.length < 3){
    while(pages[pages.length - 1]?.months?.length < 3){
      pages[pages.length - 1]?.months.push("");
    }
  }
  return (
    <>
      {goBack ?
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
      :
      null}
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
        {
          pages?.map((p, index) => {
            return (
              <>
                <ReportWrapper
                  reportTitle={options.subject}
                  ownerId={Number(household?.CreatedBy)}
                  householdId={Number(household?.HouseholdID)}
                >
                  <ActionPlanSummaryQuarter
                    household={household}
                    persons={persons}
                    objectives={objectives}
                    year={year}
                    quarter={quarter}
                    dimensions={dimensions}
                    metrics={metrics}
                    months={p?.months}
                  />
                </ReportWrapper>
                {
                  index + 1 !== pages?.length
                  ?
                  <div className="newPage"></div>
                  :
                  null
                }
              </>
            );
          })
        }
      </PDFReportExport>
    </>
  )
}


export default ActionPlanSummaryQuarterReport;

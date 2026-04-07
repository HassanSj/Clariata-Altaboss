import {ReactElement, useEffect, useState} from "react"
import {isNullOrUndefined} from "util"
import api from "~/services/api"
import {Household} from "~/types/api/household"
import {Objective} from "~/types/api/models"
import {Person} from "~/types/api/person"
import {getFamilyName, getCouplePicture} from "../StoryOfUsReport/StoryOfUsReport"
import CurationSummary, { CurationSummaryPage, getCurationSummaryPages } from "./CurationSummary"
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import ReportWrapper from "../ReportWrapper/ReportWrapper"
import { useStoreState } from "~/store/hooks"
import { Button } from "@material-ui/core"
import router from "next/router"


export interface CurationSummaryReportProps {
    household?: Household;
    persons?: Person[];
    curationPriorities?: Objective[];
    curationPages?: CurationSummaryPage[];
    isOpen?: boolean;
    onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const getPersonFullName = (person: Person | undefined) => {
    if (person?.FirstName) {
        return (person?.PreferredName ? person?.PreferredName : person?.FirstName) + ' ' + person?.LastName;
    }
    return '';
}

export const getCurationPriorities = async (householdId: number, interviewId: number, objectives: Objective[]) => {
    const res = await api.objective.getSelectedList(householdId);
    const selectedList = res?.data?.SelectedObjectiveList as Objective[];


    const curationPriorities = objectives?.filter(objective => {
        if (selectedList.some(o => o.ObjectiveID === objective.ObjectiveID)) {
            return objective;
        }
    })

    if(curationPriorities?.length > 0) {

        for (const curatedPriority of curationPriorities) {
            const stakeholders = await api.objectivestakeholder.listFull(householdId, interviewId, curatedPriority?.ObjectiveID);
            if(stakeholders && stakeholders?.length > 0) curatedPriority.Stakeholders = stakeholders;

            const actionItems = await api.actionitem.listFull(householdId, curatedPriority?.ObjectiveID, interviewId);
            if(actionItems && actionItems?.length > 0) curatedPriority.ActionItemList = actionItems;
        }

    }

    return curationPriorities;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getCurationSummaryData = async (householdId: number, interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
        // TODO - handle no evaluation id
    }


    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);

    const objectives = await api.objective.list(householdId, interviewId);
    const curationPriorities = await getCurationPriorities(householdId, interviewId, objectives?.data);

    let curationPages = await getCurationSummaryPages(curationPriorities);

    return {
        household: household?.data,
        persons: persons?.data,
        curationPriorities,
        curationPages
    };
}

const CurationSummaryReport = ({
                                   household,
                                   persons,
                                   curationPriorities,
                                   curationPages,
                                   isOpen,
                                   onClose
                               }: CurationSummaryReportProps): ReactElement => {

    const {dreamInterviewId} = useStoreState(state => state.interview);

    // const [curationPages, setCurationPages] = useState<CurationSummaryPage[]>();
    // const [curationPriorities, setCurationPriorities] = useState<Objective[]>();


    const reportOptions: IReportOptions = {
        title: 'Curation Summary Report',
        storyofus: true,
        familyName: getFamilyName(household, persons),
        familyImage: household ? getCouplePicture(household) : undefined,
        reportLogo: reportLogo,
        isOpen,
        onClose,
        header: true,
    }

    const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Curation-Sumamry-Report",
        scale: 1,
        subject: "Direction: Curation Summary Report",
        author: household?.CreatedBy,
        keepTogether: ".keep-together",
        landscape: false,
      }

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
        <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
            <>           

                {curationPages?.map((priorityPage, i) => {
                    return(
                        <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} includePageBreak={((i+1) < curationPages.length)} >
                            <CurationSummary key={"Priority" + i} household={household} persons={persons} curationPriorities={priorityPage.objectives}/>
                        </ReportWrapper>
                    )
                })}
            
            </>
        </PDFReportExport>
        </>
    )

}

export default CurationSummaryReport;

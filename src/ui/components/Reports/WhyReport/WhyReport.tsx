import React, {ReactElement, useState} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import person1 from './images/person1.png';
import person2 from './images/person2.png';
import both from './images/both.png';
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import WhyComponent from "./WhyComponent";
import { useStoreState } from "~/store/hooks";
import { getCouplePicture } from "../StoryOfUsReport/StoryOfUs";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";
import useMountEvents from "~/ui/hooks/useMountEvents";


export interface WhyReportProps {
  household?: Household;
  objectives?: Objective[];
  persons?: Person[];
  dimensions?: DimensionOfLife[];
  metrics?: MetricOfSuccess[];
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";

export interface WhyReportPage {
  priorities: Objective[];
}

export const getWhyReportPages = async (objectives?: Objective[]) => {

  const whyPages: WhyReportPage[] = [];

  const whyReportPages = objectives ? objectives.length/10 : 0;
  for (let i = 0; i < whyReportPages; i++)
  {
      const begin = i * 10;
      const end = begin + 10;

      if(objectives)
      {
          const priorities : WhyReportPage = {
            priorities: objectives?.slice(begin, end)
          }

          whyPages.push(priorities);        
      }
  };

  return whyPages
}

/**
 * Fetch report data.
 * @param householdId
 * @param personId
 */
 export const getWhyReportData = async (householdId: number, interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);

    const objectives = await api.objective.list(householdId, interviewId);

    const selectedobjectives = objectives.data.filter(x => x.IsHidden == false);

    // const res = await api.objective.getSelectedList(householdId);
    // const selectedList  = res?.data?.SelectedObjectiveList as Objective[];

    // const selectedObjectives = objectives?.data?.filter( objective => {
    //     if(selectedList.some(o => o.ObjectiveID === objective.ObjectiveID)){
    //         return objective;
    //     };
    // })

    for (let selectedObjective of selectedobjectives) {
        if(selectedObjective?.InterviewResponseID)
        {
            const res = await api.interviewresponse.get(householdId, interviewId, selectedObjective?.InterviewResponseID);
            selectedObjective.Why = res?.data?.WhyIsThisImportant;
        }
    }

    const dimensions = await api.dimensionofsuccess.list();
    const metrics = await api.metricofsuccess.list();
    
    return {
      household: household?.data,
      persons: persons?.data,
      objectives: selectedobjectives,
      dimensions: dimensions?.data,
      metrics: metrics?.data
    };
  }

const WhyReport = ({ household, persons, objectives, dimensions, metrics }: WhyReportProps): ReactElement => {

  const { selectedHousehold } = useStoreState((state) => state.household);
  const [pages, setPages] = useState<WhyReportPage[]>([]);

  const reportOptions: IReportOptions = {
    title: 'The "Why" Report',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "The-Why-Report",
    scale: 1,
    subject: 'Dream: The "Why" Report',
    author: selectedHousehold.CreatedBy,
    keepTogether: ".keep-together",
    landscape: false,
  }

  useMountEvents({
    onMounted: async () => {
      const whyReportPages = await getWhyReportPages(objectives);
      console.log(whyReportPages);
      setPages(whyReportPages);
    },
  });

  return (
    <>
     <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => {
        router.back()
        }}
        style={{width:"151px", marginLeft:"0px", marginBottom:"15px"}}
      >
        Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
        <>
        {pages.map((page, counter) => {
          return (
            <WhyComponent key={"why" + counter} household={household} persons={persons} objectives={page.priorities} dimensions={dimensions} metrics={metrics} page={counter} />
          );
        })}
        </>
      </PDFReportExport>
    </>
  )
}


export default WhyReport;

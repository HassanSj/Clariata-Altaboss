import React, {ReactElement} from "react";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import api from "~/services/api";
import { isNullOrUndefined } from "util";
import { Household } from "~/types/api/household";
import { getDefaultFamilyPhotoSrc } from "~/ui/constants/user";
import { Person } from "~/types/api/person";
import { Button, Grid } from "@material-ui/core";
import LifeGraph from "./LifeGraph";
import { getCouplePicture } from "../StoryOfUsReport/StoryOfUs";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import router from "next/router";

export const chartColors = [ '#71C7C7', '#173E68', '#F15929', '#34699D' ];

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";

export const getChartData = async (household: Household, householdId: number, interviewId: number, isMetric?: boolean) => {
  let primaryPersonIds = [0];
  if(household?.PrimaryPerson1ID) primaryPersonIds.push(household?.PrimaryPerson1ID);
  if(household?.PrimaryPerson2ID) primaryPersonIds.push(household?.PrimaryPerson2ID);

  const metricRes = await api.metricofsuccess.list();
  const metrics = metricRes?.data;
  const dimensionRes = await api.dimensionofsuccess.list();
  const dimensions = dimensionRes?.data;

  const interview = await api.interview.getFull(householdId, interviewId);

  let chartData:{ value:number, color:string, category?:string }[][] = [];
  interview?.QuestionsAndResponses?.map(qr => {
    const id = isMetric ? qr.Question?.MetricOfSuccessID : qr?.Question?.DimensionOfLifeID;
    if(typeof id != 'undefined'){
      if(qr.Responses && qr.Responses?.length > 0) {
          qr.Responses.filter(x => x.Hidden == false).forEach(r => {
            if(typeof r.AppliesTo != 'undefined') {
              chartData[r.AppliesTo] = ( typeof chartData[r.AppliesTo] != 'undefined' ) ? chartData[r.AppliesTo] : [];
              chartData[r.AppliesTo][id] = ( typeof chartData[r.AppliesTo][id] != 'undefined') ? chartData[r.AppliesTo][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
              chartData[r.AppliesTo][id].value = ( chartData[r.AppliesTo][id].value != 0) ? chartData[r.AppliesTo][id].value + 1 : 1;

              //Add for both if spouse, and for spouses if both
              if(r.AppliesTo == 0)
              {
                primaryPersonIds.forEach(p => {
                  chartData[p] = ( typeof chartData[p] != 'undefined' ) ? chartData[p] : [];
                  chartData[p][id] = ( typeof chartData[p][id] != 'undefined') ? chartData[p][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
                  chartData[p][id].value = ( chartData[p][id].value != 0) ? chartData[p][id].value + 1 : 1;
                })
              } else {
                chartData[0] = ( typeof chartData[0] != 'undefined' ) ? chartData[0] : [];
                chartData[0][id] = ( typeof chartData[0][id] != 'undefined') ? chartData[0][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
                chartData[0][id].value = ( chartData[0][id].value != 0) ? chartData[0][id].value + 1 : 1;
              }
            }
          });
      } else {
        primaryPersonIds.forEach(p => {
          chartData[p] = ( typeof chartData[p] != 'undefined' ) ? chartData[p] : [];
          chartData[p][id] = ( typeof chartData[p][id] != 'undefined') ? chartData[p][id] : {value: 0, color: chartColors[id-1], category: isMetric ? metrics[id-1]?.MetricOfSuccess : dimensions[id-1]?.DimensionOfLife};
        })
      }
    }
  });
  return chartData;
}

export const getChartImages = async ( chartData:{ value:number, color:string, category?:string }[][], persons?: Person[], household?: Household, isMetric?: boolean, showLabels?: boolean, noText?: boolean, backgroundColor?: string, ringSize?: number) => {
  const chartImages : string[] = [];

  const filteredChartData = chartData.map((val, ind) => ({index: ind, value: val}))

  for(const o of filteredChartData) {
    const c = o?.value;
    const i = o?.index;
    const colors: string[] = [];
    const values: number[] = [];
    const labels: string[] = [];
    c?.forEach(d => {
      if(d.value > 0) {
      colors.push(d?.color);
      values.push(d?.value);
      labels.push(d?.category ? d?.category : '');
      }
    })
    const charRequest = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
        labels: labels,
      },
      options: {
        cutoutPercentage: ringSize ? ringSize : 50,
        legend: {
          display: false
        },
        plugins: {
          datalabels: {
            display: showLabels ? showLabels : false,
            font: {
              size: 20,
            },
            color: '#FFFFFF'
          },
          doughnutlabel: noText ? null : {
            labels: [{
              text: i === 0 ? 'COMBINED' : `${persons?.find(p => p?.PersonID === (i === 1 ? household?.PrimaryPerson1ID : household?.PrimaryPerson2ID))?.FirstName?.toUpperCase()}'S`,
              font: {
                size: 20,
                weight: 'bold'
              },
              color: '#6DD0CB'
            }, {
              text: isMetric ? 'METRICS' : 'DIMENSIONS',
              font: {
                size: 20,
                weight: 'bold'
              }
            }, {
              text: isMetric ? 'OF SUCCESS' : 'OF LIFE',
              font: {
                size: 20,
                weight: 'bold'
              }
            }]
          }
        }
      }
    }
    const url = JSON.stringify(charRequest);
    let u = new URLSearchParams(url).toString();
    if(u.endsWith("=")) {
      u = u.substring(0, u.length - 1);
    }
    const size = i === 0 ? 400 : 200;
    u = `https://quickchart.io/chart?backgroundColor=%23${backgroundColor ? backgroundColor : 'ffffff'}&width=${size}&height=${size}&c=` + u;

    chartImages[i] = u 
  }

  return chartImages;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getLifeGraphData = async (householdId: number, interviewId: number, isMetric?: boolean) => {
  // Null check
  if (isNullOrUndefined(householdId)) {
  // TODO - handle no evaluation id
  }


  const household = await api.household.get(householdId);
  
  
  const persons = await api.person.list(householdId);
  let chartData = await getChartData(household?.data, householdId, interviewId, isMetric);

  chartData = chartData.filter(v => !!v);

  const chartImages = await getChartImages(chartData, persons?.data, household?.data,  isMetric, true);

  return {
    household: household?.data,
    chartData,
    chartImages,
    persons: persons?.data,
    isMetric: isMetric ? isMetric : false,
  };
}

export const getFamilyName = (household: Household | undefined, persons: Person[] | undefined) => {
  const spouse1 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson1ID);
  const spouse2 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson2ID);

  if(spouse2)
  {
    return spouse2.LastName == spouse1?.LastName ? `${spouse1?.FirstName} & ${spouse2.FullName}` :  `${spouse1?.FullName} & ${spouse2.FullName}`;
  }

  return `${spouse1?.FullName}`;


}

export const getFamilyPicture = (household: Household) => {
  return household?.PhotoURL ? household?.PhotoURL : getDefaultFamilyPhotoSrc();
}

const getTitle = (metric?: boolean) => {
  return metric ?  "Metrics of Success Lifegraphs" : "Dimensions of Life Lifegraphs"
}

export interface LifeGraphReportProps {
  household?: Household;
  chartData?: { value:number, color:string, category?:string }[][];
  chartImages?: string[];
  persons?: Person[];
  isMetric?: boolean;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const LifeGraphReport = ({ household, chartData, chartImages, persons, isMetric, isOpen, onClose }: LifeGraphReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    storyofus: true,
    title: getTitle(isMetric),
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    isOpen,
    onClose,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Succcess-Lifegraph",
    title: getTitle(isMetric),
    scale: 1,
    subject: "Dream: " + getTitle(isMetric),
    author: household?.CreatedBy,
    keepTogether: ".keep-together"
  }

  const getChartTitle = (personId: number) => {
    const metric = isMetric? "METRICS" : "DIMENSIONS";
    const person = personId == 0 ? "COMBINED" : "" + persons?.find(p => p.PersonID == personId)?.FirstName?.toUpperCase() + "'S"; 

    return {
      line1: `${person}`,
      line2: metric,
      line3: "OF SUCCESS"
    }
  }

  const chImages = chartImages?.filter(ch => ch)
  return (
    <>
     <Button
      variant="contained"
      size="small"
      color="primary"
      onClick={() => {
      router.back()
      }}
      style={{ width: '151px', marginLeft: '0px', marginBottom: '15px' }}
      >
          Go Back
      </Button>
    <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}> 
      <>
        <ReportWrapper reportTitle={options.title} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
          <LifeGraph household={household} chartData={chartData} chartImages={chartImages} persons={persons} isMetric={isMetric} />
        </ReportWrapper>
      </>
    </PDFReportExport>
    </>
  )
}


export default LifeGraphReport;

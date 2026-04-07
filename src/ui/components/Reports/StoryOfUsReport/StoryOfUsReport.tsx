import React, {ReactElement, useEffect, useState} from "react";
import api from "~/services/api";
import { isNullOrUndefined } from "util";
import { Household } from "~/types/api/household";
import { QuestionAndResponse } from "~/types/api/questionAndResponse";
import { getBothPhotoSrc, getDefaultFamilyPhotoSrc } from "~/ui/constants/user";
import { Person } from "~/types/api/person";
import { WizardState } from "~/types/wizard/wizard";
import { getInterviewWizardFull } from "~/services/interview";
import { InterviewResponse } from "~/types/api/interviewResponse";
import moment from 'moment'; 
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { Button, Collapse } from "@material-ui/core";
import StoryOfUs, { getStoryOfUsReportData } from "./StoryOfUs";
import { User } from "~/types/api/user";
import { logoBase64, logoBase64WithouText, printBase64 } from "~/ui/components/Reports/PDFReportExport/images";
import { ReportSpecificResponses } from "../FamilyStoryReport/FamilyStoryReport";
import { useStoreState } from "~/store/hooks";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { useRouter } from "next/router";


export interface StoryOfUsData {
  OurStory: ReportSpecificResponses[],
  OurLegacyAndOurAdvice: ReportSpecificResponses[],
  RulesAndTraditions: ReportSpecificResponses[],
}


export const getStoryOfUsData = async (householdId: number, interviewId: number) => {

  let story: ReportSpecificResponses[] = [];
  let legacy: ReportSpecificResponses[] = [];
  let traditions: ReportSpecificResponses[] = [];
  let responses : InterviewResponse[] = [];
  let resClarifying: AxiosResponse<InterviewResponse[]>;
  let clarifyingResponses: InterviewResponse[];

  // const household = await api.household.get(householdId);
  // const persons = await api.person.list(householdId);

  //Our Story (435, 342, 221)
  let res = await api.interviewresponse.list(householdId, interviewId, 435);
  if(res?.data) {
    responses = res?.data;

    resClarifying = await api.interviewresponse.list(householdId, interviewId, 436);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }

    if(responses?.length > 0) story.push({title: "HOW WE MET", responses: responses.filter(x => x.Hidden == false)}); 
  }

  res = await api.interviewresponse.list(householdId, interviewId, 342);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 437);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 438);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 441);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) story.push({title: "OUR WEDDING", responses: responses.filter(x => x.Hidden == false)}); 

  res = await api.interviewresponse.list(householdId, interviewId, 221);
  responses = res?.data;
  if(responses && responses?.length > 0) story.push({title: "OUR FONDEST MEMORY", responses: responses.filter(x => x.Hidden == false)}); 

  //Our Legacy and Our Advice (215, 427)
  res = await api.interviewresponse.list(householdId, interviewId, 215);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 301);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 302);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 303);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 304);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) legacy.push({title: "OUR JOURNEY", responses: responses.filter(x => x.Hidden == false)}); 

  res = await api.interviewresponse.list(householdId, interviewId, 427);
  responses = res?.data;
  if(responses && responses?.length > 0) legacy.push({title: "OUR ADVICE", responses: responses.filter(x => x.Hidden == false)});

  //Rituals and Traditions (206, 285, 397, 400, 205, 385)
  res = await api.interviewresponse.list(householdId, interviewId, 206);
  responses = res?.data
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 282);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 394);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 284);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) traditions.push({title: "FAVORITE FAMILY HOLIDAYS", responses: responses.filter(x => x.Hidden == false)});
  
  res = await api.interviewresponse.list(householdId, interviewId, 285);
  responses = res?.data;
  if(responses && responses?.length > 0) traditions.push({title: "NEW FAMILY HOLIDAYS", responses: responses.filter(x => x.Hidden == false)});

  res = await api.interviewresponse.list(householdId, interviewId, 397);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 398);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 399);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) traditions.push({title: "FAVORITE TRADITIONS", responses: responses.filter(x => x.Hidden == false)});

  res = await api.interviewresponse.list(householdId, interviewId, 400);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 401);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 402);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) traditions.push({title: "NEW TRADITIONS", responses: responses.filter(x => x.Hidden == false)});

  res = await api.interviewresponse.list(householdId, interviewId, 205);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 278);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 386);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 387);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 388);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 280);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) traditions.push({title: "RELIGION", responses: responses.filter(x => x.Hidden == false)});

  res = await api.interviewresponse.list(householdId, interviewId, 385);
  responses = res?.data;
  resClarifying = await api.interviewresponse.list(householdId, interviewId, 279);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 389);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 390);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
    resClarifying = await api.interviewresponse.list(householdId, interviewId, 391);
    if(resClarifying?.data)
    {
      clarifyingResponses = resClarifying.data;
      
      clarifyingResponses.map((clarifyingResponse) => {
        responses.push(clarifyingResponse);
      });
    }
  if(responses && responses?.length > 0) traditions.push({title: "", responses: responses.filter(x => x.Hidden == false)});

  const storyOfUsData: StoryOfUsData = {
    OurStory: story,
    OurLegacyAndOurAdvice: legacy,
    RulesAndTraditions: traditions,
  }

  return storyOfUsData;
}

export const getFamilyName = (household: Household | undefined, persons: Person[] | undefined) => {
  const spouse1 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson1ID);
  const spouse2 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson2ID);

  console.log(spouse2);

  if(spouse2)
  {
    let spouse1FullName = spouse1?.FullName ? spouse1?.FullName : spouse1?.FirstName + " " + spouse1?.LastName;
    let spouse2FullName = spouse2?.FullName ? spouse2?.FullName : spouse2?.FirstName + " " + spouse2?.LastName;

    return spouse2.LastName == spouse1?.LastName ? `${spouse1?.FirstName} & ${spouse2FullName}` :  `${spouse1FullName} & ${spouse2FullName}`;
    
  }

  return `${spouse1?.FullName}`;


}

export const getFamilyPicture = (household: Household) => {
  return household?.PhotoURL ? household?.PhotoURL : getDefaultFamilyPhotoSrc();
}

export const getPrimaryPicture = (household: Household) => {
  return household?.PhotoURL ? household?.PhotoURL : getDefaultFamilyPhotoSrc();
}

export const getCouplePicture = (household: Household) => {
  return household?.CouplePhotoURL ? household?.CouplePhotoURL : getBothPhotoSrc();
}

export interface StoryOfUsReportProps {
  //storyofUsData?: StoryOfUsData;
  household?: Household;
  persons?: Person[];
}


const StoryOfUsReport = (): ReactElement => {

  const router = useRouter();
  const { discoverInterviewId } = useStoreState((state) => state.interview);
  const { selectedHousehold } = useStoreState((state) => state.household);
  const [storyData, setStoryData] = useState<StoryOfUsData | undefined>();

  const reportOptions: IReportOptions = {
    storyofus: true,
    title: "The Story Of Us",
    familyName: getFamilyName(selectedHousehold, selectedHousehold.Persons),
    familyImage: getCouplePicture(selectedHousehold),
    header: true
  }

  const options: PDFExportProps = {
    paperSize: ["8.5in", "11in"],
    scale: 1,
    fileName: "Story-Of-Us-Report",
    subject: "Discover: Story of Us Report",
    author: selectedHousehold.CreatedBy,
    keepTogether: ".keep-together",
    repeatHeaders: false,
  }

  const loadReportData = async () => {
    
    const storyOfUsData = await getStoryOfUsData(selectedHousehold.HouseholdID, discoverInterviewId);
    setStoryData(storyOfUsData);
  }

  useEffect(() => {    
    loadReportData();
  }, [])

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
        <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold?.CreatedBy)} householdId={Number(selectedHousehold?.HouseholdID)} >
                <StoryOfUs storyOfUsData={storyData} household={selectedHousehold} persons={selectedHousehold.Persons} />
        </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default StoryOfUsReport;

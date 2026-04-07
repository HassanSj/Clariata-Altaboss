import React, {ReactElement, useEffect, useState} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { InterviewResponse } from "~/types/api/interviewResponse";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExport, PDFExportProps } from "@progress/kendo-react-pdf";
import FamilyStory from "./FamilyStory";
import { composeSortDescriptors } from "@progress/kendo-data-query";
import InterviewsList from "../../Interviews/InterviewsList";
import { useStoreState } from "~/store/hooks";
import moment from "moment";
import { logoBase64, logoBase64WithouText, printBase64 } from "~/ui/components/Reports/PDFReportExport/images";
import { User } from "~/types/api/user";
import {Button} from "@material-ui/core";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import useMountEvents from "~/ui/hooks/useMountEvents";
import router from "next/router";


export interface FamilyStoryData {
  BeliefsAndValues: ReportSpecificResponses[],
  OurFamilyToday: ReportSpecificResponses[],
  GivingThanks: ReportSpecificResponses[],
  GivingBack: ReportSpecificResponses[]
}

export interface FamilyStoryReportProps {
  data?: FamilyStoryData;
  household?: Household;
  persons?: Person[];
  isOpen?: boolean;
  pageNumber?: number;
  onClose?: () => unknown;
  
}

export interface ReportSpecificResponses {
    title: String;
    responses: InterviewResponse[];
}

export interface FamilyStoryReportData {
    title: String;
    data: ReportSpecificResponses[];
}

export const getFamilyStoryData = async (householdId: number, interviewId: number) => {
   let data : FamilyStoryReportData[] = [];  

    //Fetch Beliefs(Responses to question 207, 208, 404, 405)
    //Fetch Clarify Question Responses(286, 237, 289, 290, 406, 407, 410, 408, 409)

    let beliefs: ReportSpecificResponses[] = [];

    let lifeLessons: InterviewResponse[] = [];
    //TO DO: See if API can be called to get multiple reponses. There is too many calls to API
    let res = await api.interviewresponse.list(householdId, interviewId, 207);
    if(res?.data && res?.data?.length > 0) lifeLessons = lifeLessons.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 286);
    if(res?.data && res?.data?.length > 0) lifeLessons = lifeLessons.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 287);
    if(res?.data && res?.data?.length > 0) lifeLessons = lifeLessons.concat(res?.data);
    
    beliefs.push({title: "LIFE LESSONS", responses: lifeLessons.filter(x => x.Hidden == false)});

    let coreValues: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 208);
    if(res?.data && res?.data?.length > 0) coreValues = coreValues.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 289);
    if(res?.data && res?.data?.length > 0) coreValues = coreValues.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 290);
    if(res?.data && res?.data?.length > 0) coreValues = coreValues.concat(res?.data);
    
    beliefs.push({title: "CORE VALUES", responses: coreValues.filter(x => x.Hidden == false)});

    let legacy: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 404);
    if(res?.data && res?.data?.length > 0) legacy = legacy.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 406);
    if(res?.data && res?.data?.length > 0) legacy = legacy.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 407);
    if(res?.data && res?.data?.length > 0) legacy = legacy.concat(res?.data);
    if(res?.data && res?.data?.length > 0) beliefs.push({title: "LEGACY", responses: legacy.filter(x => x.Hidden == false)}); 

    let quotes: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 405);
    if(res?.data && res?.data?.length > 0) quotes = quotes.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 410);
    if(res?.data && res?.data?.length > 0) quotes = quotes.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 408);
    if(res?.data && res?.data?.length > 0) quotes = quotes.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 409);
    if(res?.data && res?.data?.length > 0) quotes = quotes.concat(res?.data);
    
    beliefs.push({title: "QUOTES TO LIVE BY", responses: quotes.filter(x => x.Hidden == false)}); 

    data.push({title: "Beliefs and Values", data: beliefs});

    //Fetch Our Family Today (Responses to question 198, 353, 443, 252)
    //Fetch Clarify Question Responses(253, 354, 355, 356, 358, 359, 360, 444, 445, 251)

    let today: ReportSpecificResponses[] = [];
    let children: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 198);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 253);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }
    res = await api.interviewresponse.list(householdId, interviewId, 354);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }
    res = await api.interviewresponse.list(householdId, interviewId, 355);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }
    res = await api.interviewresponse.list(householdId, interviewId, 356);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }
    res = await api.interviewresponse.list(householdId, interviewId, 358);
    if(res?.data && res?.data?.length > 0) {
      children = children.concat(res?.data);
    }

    today.push({title: "CHILDREN", responses: children.filter(x => x.Hidden == false)}); 

    let grandchildren: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 353);
    if(res?.data && res?.data?.length > 0) grandchildren = grandchildren.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 359);
    if(res?.data && res?.data?.length > 0) grandchildren = grandchildren.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 360);
    if(res?.data && res?.data?.length > 0) grandchildren = grandchildren.concat(res?.data);
    
    today.push({title: "GRANDCHILDREN", responses: grandchildren.filter(x => x.Hidden == false)});

    let pets: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 443);
    if(res?.data && res?.data?.length > 0) pets = pets.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 444);
    if(res?.data && res?.data?.length > 0) pets = pets.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 445);
    if(res?.data && res?.data?.length > 0) pets = pets.concat(res?.data);
    
    today.push({title: "FAMILY PETS", responses: pets.filter(x => x.Hidden == false)}); 

    let future: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 252);
    if(res?.data && res?.data?.length > 0) future = future.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 251);
    if(res?.data && res?.data?.length > 0) future = future.concat(res?.data);
    
    today.push({title: "FUTURE", responses: future.filter(x => x.Hidden == false)});

    data.push({title: "Our Family Today", data: today});

    //Fetch Giving Thanks (Responses to question 212, 383)
    //Fetch Clarify Question Responses(297)

    let thanks: ReportSpecificResponses[] = [];

    let thankful: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 212);
    if(res?.data && res?.data?.length > 0) thankful = thankful.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 297);
    if(res?.data && res?.data?.length > 0) thankful = thankful.concat(res?.data);
    
    thanks.push({title: "WE ARE MOST THANKFUL FOR", responses: thankful.filter(x => x.Hidden == false)}); 

    res = await api.interviewresponse.list(householdId, interviewId, 383);
    
    thanks.push({title: "RELATIONSHIPS TO FOSTER", responses: res?.data.filter(x => x.Hidden == false)}); 

    data.push({title: "Giving Thanks", data: thanks});

    //Fetch Giving BAck (Responses to question 210, 211)
    //Fetch Clarify Question Responses(293, 292, 464, 295, 296)

    let back: ReportSpecificResponses[] = [];

    let philantrophy: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 210);
    if(res?.data && res?.data?.length > 0) philantrophy = philantrophy.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 293);
    if(res?.data && res?.data?.length > 0) philantrophy = philantrophy.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 292);
    if(res?.data && res?.data?.length > 0) philantrophy = philantrophy.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 464);
    if(res?.data && res?.data?.length > 0) philantrophy = philantrophy.concat(res?.data);
    
    back.push({title: "OUR FAMILY PHILANTROPHY", responses: philantrophy.filter(x => x.Hidden == false)});

    let care: InterviewResponse[] = [];
    res = await api.interviewresponse.list(householdId, interviewId, 211);
    if(res?.data && res?.data?.length > 0) care = care.concat(res?.data);
    //Clariying Questions
    res = await api.interviewresponse.list(householdId, interviewId, 295);
    if(res?.data && res?.data?.length > 0) care = care.concat(res?.data);
    res = await api.interviewresponse.list(householdId, interviewId, 296);
    if(res?.data && res?.data?.length > 0) care = care.concat(res?.data);
    
    back.push({title: "CAUSES WE CARE ABOUT", responses: care.filter(x => x.Hidden == false)}); 

    data.push({title: "Giving Back", data: back});

    const familyStoryData: FamilyStoryData = {
      BeliefsAndValues: beliefs,
      OurFamilyToday: today,
      GivingThanks: thanks,
      GivingBack: back
    }
    console.log(familyStoryData);
    return familyStoryData;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getFamilyStoryReportData = async (householdId: number, interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
        // TODO - handle no evaluation id
    }
    
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);

    const data = await getFamilyStoryData(householdId, interviewId);
    
    
    return {
        household: household?.data,
        persons: persons?.data,
        data: data
    };
}

const FamilyStoryReport = ({ data, household, persons, isOpen, onClose }: FamilyStoryReportProps): ReactElement => {
  const { discoverInterviewId } = useStoreState((state) => state.interview);

  const reportOptions: IReportOptions = {
    title: 'Family Story',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getFamilyPicture(household) : undefined,
    isOpen,
    onClose,
    header: false,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Family-Story-Report",
    scale: 1,
    subject: "Discover: Family Story Report",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    margin: 0 
  }

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
          <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
              <FamilyStory household={household} persons={persons} data={data} pageNumber={1}/>
          </ReportWrapper>
              <div className="newPage"/>
          <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
              <FamilyStory household={household} persons={persons} data={data} pageNumber={2}/>
          </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default FamilyStoryReport;

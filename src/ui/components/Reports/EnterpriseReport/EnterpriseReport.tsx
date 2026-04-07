import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { InterviewResponse } from "~/types/api/interviewResponse";
import { FamilyStoryReportData, ReportSpecificResponses } from "../FamilyStoryReport/FamilyStoryReport";
import moment from "moment";
import {formatDate} from "@telerik/kendo-intl";
import {convertStringToDate} from "~/ui/constants/utils";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import Enterprise from "~/ui/components/Reports/EnterpriseReport/Enterprise";
import { getCouplePicture } from "../StoryOfUsReport/StoryOfUs";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Company } from "~/types/api/company";
import { Button } from "@material-ui/core";
import router from "next/router";


export interface EnterpriseData {
  title: string;
  value: string;
}

export interface EnterpriseReportProps {
  enterpriseData?: EnterpriseData[];
  data?: FamilyStoryReportData[];
  household?: Household;
  persons?: Person[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

export const getEnterprise = async (householdId: number, people: Person[]) => {
  const enterpriseData: EnterpriseData[] = [];
  const companies: Company[] = [];
  console.log(householdId);
  
  const enterpriseRes = await api.household.listCompanies(householdId, people);

  console.log(companies);
    // get first enterprise;
  const enterprise = enterpriseRes[0];
  if(enterprise ) {
    enterpriseData.push({title: "NAME", value: enterprise.Name});
    if(enterprise.Address) enterpriseData.push({title: "ADDRESS", value: enterprise.Address});
    if(enterprise.Phone) enterpriseData.push({title: "PHONE NUMBER", value: enterprise.Phone});
    if(enterprise.Email) enterpriseData.push({title: "EMAIL", value: enterprise.Email});
    if(enterprise.Website) enterpriseData.push({title: "WEBSITE", value: enterprise.Website});
    if(enterprise.FoundedDate) {
      enterpriseData.push({title: "YEAR FOUNDED", value: moment(enterprise.FoundedDate).year().toString()});
    }
    if(enterprise.EmployeeCount) enterpriseData.push({title: "NUMBER OF EMPLOYEES", value: enterprise.EmployeeCount.toString()});
    if(enterprise.Revenue) enterpriseData.push({title: "ANNUAL REVENUE", value: `$${enterprise.Revenue} per year`});
    
  }

  return enterpriseData
}

export const getEnterpriseResponses = async (householdId: number, interviewId: number) => {
  const data : FamilyStoryReportData[] = [];

  // Fetch Background(Responses to question 305, 306, 308)

  const background: ReportSpecificResponses[] = [];

  let res = await api.interviewresponse.list(householdId, interviewId, 305);
  if(res?.data && res?.data?.length > 0) background.push({title: "", responses: res?.data.filter(x => x.Hidden == false)}); 

  res = await api.interviewresponse.list(householdId, interviewId, 306);
  if(res?.data && res?.data?.length > 0) background.push({title: "", responses: res?.data.filter(x => x.Hidden == false)}); 

  res = await api.interviewresponse.list(householdId, interviewId, 308);
  if(res?.data && res?.data?.length > 0) background.push({title: "", responses: res?.data.filter(x => x.Hidden == false)}); 

  data.push({title: "Background", data: background});

  // Fetch Our Enterprise Today
  const today: ReportSpecificResponses[] = [];

  // current role(419)
  res = await api.interviewresponse.list(householdId, interviewId, 419);
  if(res?.data && res?.data?.length > 0) today.push({title: "CURRENT ROLE AND RESPONSIBILITIES", responses: res?.data.filter(x => x.Hidden == false)}); 

  // who is involved(418, 420, 421)
  res = await api.interviewresponse.list(householdId, interviewId, 418);
  let responses : InterviewResponse[] = res?.data;
  res = await api.interviewresponse.list(householdId, interviewId, 420);
  responses = [...responses, ...res?.data];
  res = await api.interviewresponse.list(householdId, interviewId, 421);
  responses = [...responses, ...res?.data];

  if(responses && responses?.length > 0) today.push({title: "WHO IS INVOLVED", responses: responses.filter(x => x.Hidden == false)}); 

  // current state(415, 309, 311, 312, 315, 313, 318)
  res = await api.interviewresponse.list(householdId, interviewId, 415);
  responses = res?.data.filter(x => x.Hidden == false);
  res = await api.interviewresponse.list(householdId, interviewId, 309);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 311);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 312);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 315);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 313);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 318);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];

  if(responses && responses?.length > 0) today.push({title: "CURRENT STATE", responses: responses.filter(x => x.Hidden == false)});

  // advice(319, 317, 307, 316)
  res = await api.interviewresponse.list(householdId, interviewId, 319);
  responses = res?.data.filter(x => x.Hidden == false);
  res = await api.interviewresponse.list(householdId, interviewId, 317);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 307);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];
  res = await api.interviewresponse.list(householdId, interviewId, 316);
  responses = [...responses, ...res?.data.filter(x => x.Hidden == false)];

  if(responses && responses?.length > 0) today.push({title: "ADVICE", responses: responses.filter(x => x.Hidden == false)});

  // succession(320, 413)
  res = await api.interviewresponse.list(householdId, interviewId, 320);
  responses = res?.data;
  res = await api.interviewresponse.list(householdId, interviewId, 413);
  responses = [...responses, ...res?.data];

  if(responses && responses?.length > 0) today.push({title: "SUCCESSION", responses: responses.filter(x => x.Hidden == false)});

  data.push({title: "Our Enterprise Today", data: today});

  return data;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getEnterpriseReportData = async (householdId: number, interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
        // TODO - handle no evaluation id
    }
    console.log(householdId);
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
    console.log(persons);
    const enterpriseData = await getEnterprise(householdId, persons.data);
    const data = await getEnterpriseResponses(householdId, interviewId);
    
    return {
        household: household?.data,
        persons: persons?.data,
        data,
        enterpriseData,
    };
}

const EnterpriseReport = ({ enterpriseData, data, household, persons, isOpen, onClose }: EnterpriseReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Our Enterprise',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    isOpen,
    onClose,
    header: true
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Our-Enterprise-Report",
    scale: 1,
    subject: "Discover: Our Enterprise Report",
    author: household?.CreatedBy,
    keepTogether: ".keep-together"
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
        style={{width:"151px", marginLeft:"0px", marginBottom:"15px"}}
      >
        Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
          <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
                    <Enterprise enterpriseData={enterpriseData} data={data} household={household} persons={persons} /> 
            </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default EnterpriseReport;

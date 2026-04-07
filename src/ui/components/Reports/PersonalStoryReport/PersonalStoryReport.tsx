import React, {ReactElement, useState} from "react";
import {Family} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
// import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
// import { Household } from "~/types/api/household";
import moment from "moment";
import { FamilyStoryReportData, ReportSpecificResponses } from "../FamilyStoryReport/FamilyStoryReport";
import api from "~/services/api";
import {ApiRequestType, OwnerModelType, OwnerType, PersonRelationshipType, PersonType} from "~/ui/constants/api";
import { InterviewResponse } from "~/types/api/interviewResponse";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import { isNullOrUndefined } from "util";
import {OwnerParams} from "~/types/relations";
import {EducationItem} from "~/types/api/educationItem";
import {convertStringToDateText, personBirthdate} from "~/ui/constants/utils";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExport, PDFExportProps } from "@progress/kendo-react-pdf";
import household from "~/store/household";
import { Household } from "~/types/api/household";
import PersonalStory from "~/ui/components/Reports/PersonalStoryReport/PersonalStory";
import { logoBase64, logoBase64WithouText, printBase64 } from "~/ui/components/Reports/PDFReportExport/images";
import { User } from "~/types/api/user";
import { Button } from "@material-ui/core";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { useStoreState } from "~/store/hooks";
import router from "next/router";

export interface PersonalStoryData {
  BiographicalSummary: ReportSpecificResponses[],
  FamilyandAncestors: ReportSpecificResponses[],
  PeopleWhoHaveInfluencedMe: ReportSpecificResponses[],
  RelationshipsToFoster: ReportSpecificResponses[]
}

export interface ClientProfileProps {
  personalData?: PersonalStoryData;
  educationData?: EducationItem[];
  person?: Person;
  isOpen?: boolean;
  onClose?: () => unknown;
}

export const getPersonalResponses = async (householdId: number, interviewId: number, personId: number) => {
  let data : FamilyStoryReportData[] = [];
  let bio: ReportSpecificResponses[] = [];
  let responses : InterviewResponse[] = [];
  const newParagraph: InterviewResponse = {Paragraph: true};   

  //Fetch Name(Response to question 434) 

  let res = await api.interviewresponse.list(householdId, interviewId, 434);
  if(res?.data) {
    responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);
    if(responses?.length > 0) bio.push({title: "ABOUT MY NAME", responses: responses.filter(x => x.Hidden == false)}); 
  }

  //Fetch Growing up(Responses to question 428,429,430,432,433)

  res = await api.interviewresponse.list(householdId, interviewId, 428);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 429);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 430);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 432);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 433);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];
  if(responses && responses?.length > 0) bio.push({title: "GROWING UP", responses: responses.filter(x => x.Hidden == false)}); 

  //Fetch Learning first paragraph (Response to question 350,351,233)

  res = await api.interviewresponse.list(householdId, interviewId, 350);
  responses = res?.data?.filter(r => r.AppliesTo === personId);

  res = await api.interviewresponse.list(householdId, interviewId, 351);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 233);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
    // bio.push({title: "LEARNING", responses: responses}); 
  }

  //Fetch Learning second paragraph (Response to question 195,231,442)

  res = await api.interviewresponse.list(householdId, interviewId, 195);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 231);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 442);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    bio.push({title: "LEARNING", responses: responses.filter(x => x.Hidden == false)}); 
  }

  //Fetch Advice about education (Response to question 238)

  res = await api.interviewresponse.list(householdId, interviewId, 238);
  if(res?.data) {
    responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);
    // if(responses?.length > 0) {
    //   bio.push({title: "ADVICE ABOUT EDUCATION", responses: responses})
    // }   

    bio.push({title: "ADVICE ABOUT EDUCATION", responses: responses.filter(x => x.Hidden == false)})
  }

  //Fetch Extracurricular Activities (Response to question 235)

  res = await api.interviewresponse.list(householdId, interviewId, 235);
  if(res?.data) {
    responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);
    if(responses?.length > 0) bio.push({title: "EXTRACURRICULAR ACTIVITIES", responses: responses.filter(x => x.Hidden == false)}); 
  }

  //Fetch careerpath first paragraph (Response to question 196,240,242)

  res = await api.interviewresponse.list(householdId, interviewId, 196);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 240);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 242);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch careerpath second paragraph (Response to question 411,241,243,416,417)

  res = await api.interviewresponse.list(householdId, interviewId, 411);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 241);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 243);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 416);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 417);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    bio.push({title: "CAREER PATH", responses: responses.filter(x => x.Hidden == false)}); 
  }

  if(bio?.length > 0) data.push({title: "Biographical Summary", data: bio});


  let family: ReportSpecificResponses[] = [];

  //Fetch significant ancestors first paragraph (Response to question 201,265,266,267,268,269,270)

  res = await api.interviewresponse.list(householdId, interviewId, 201);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 265);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 266);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 267);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 268);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 269);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 270);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch significant ancestors second paragraph (Response to question 203,272,273)

  res = await api.interviewresponse.list(householdId, interviewId, 203);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 272);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 273);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    family.push({title: "SIGNIFICANT ANCESTORS", responses: responses.filter(x => x.Hidden == false)});
  }

  //Fetch grandparents (Response to question 200, 259, 260, 262, 263)
  res = await api.interviewresponse.list(householdId, interviewId, 200);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 259);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 260);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 262);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 263);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) family.push({title: "GRANDPARENTS", responses: responses.filter(x => x.Hidden == false)});

  //Fetch parents first paragraph (Response to question 197,455,456,457,458,459)

  res = await api.interviewresponse.list(householdId, interviewId, 197);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 455);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 456);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 457);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 458);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 459);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch parents second paragraph (Response to question 460,462)

  res = await api.interviewresponse.list(householdId, interviewId, 460);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 462);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch parents third paragraph (Response to question 452)

  res = await api.interviewresponse.list(householdId, interviewId, 452);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    family.push({title: "PARENTS", responses: responses.filter(x => x.Hidden == false)});
  }

  //Fetch siblings first paragraph (Response to question 463)

  res = await api.interviewresponse.list(householdId, interviewId, 463);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch siblings second paragraph (Response to question 337,338)

  res = await api.interviewresponse.list(householdId, interviewId, 337);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 338);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch siblings third paragraph (Response to question 341,381,382)

  res = await api.interviewresponse.list(householdId, interviewId, 341);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 381);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 382);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    family.push({title: "SIBLINGS", responses: responses.filter(x => x.Hidden == false)});
  }

  //Fetch extended family (Response to question 204,275)
  res = await api.interviewresponse.list(householdId, interviewId, 204);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 275);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) family.push({title: "EXTENDED FAMILY", responses: responses.filter(x => x.Hidden == false)});

  if(family?.length > 0) data.push({title: "Family and Ancestors", data: family});

  let influence: ReportSpecificResponses[] = [];

  //Fetch influence first paragraph (Response to question 264)

  res = await api.interviewresponse.list(householdId, interviewId, 264);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch influence second paragraph (Response to question 371,372,373)

  res = await api.interviewresponse.list(householdId, interviewId, 371);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0 || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 372);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 373);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    responses.push(newParagraph);
  }

  //Fetch influence third paragraph (Response to question 277)

  res = await api.interviewresponse.list(householdId, interviewId, 277);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) {
    influence.push({title: "", responses: responses.filter(x => x.Hidden == false)});
  }

  if(influence?.length > 0) data.push({title: "People Who Have Influenced Me", data: influence});

  //Fetch letter (Response to question 213,298)
  let letter: ReportSpecificResponses[] = [];

  res = await api.interviewresponse.list(householdId, interviewId, 213);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 298);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) letter.push({title: "", responses: responses.filter(x => x.Hidden == false)});

  if(letter?.length > 0) data.push({title: "My Letter of Thanks", data: letter});

  //Fetch relationships (Response to question 214,299,300)
  let relationships: ReportSpecificResponses[] = [];

  res = await api.interviewresponse.list(householdId, interviewId, 214);
  responses = res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0);

  res = await api.interviewresponse.list(householdId, interviewId, 299);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  res = await api.interviewresponse.list(householdId, interviewId, 300);
  responses = [...responses, ...res?.data?.filter(r => r.AppliesTo === personId || r.AppliesTo === 0)];

  if(responses && responses?.length > 0) relationships.push({title: "", responses: responses.filter(x => x.Hidden == false)});

  if(relationships?.length > 0) data.push({title: "Relationships To Foster", data: relationships});

  //data.push({title: "Relationships To Foster", data: relationships});

  const personalStoryData: PersonalStoryData = {
    BiographicalSummary: bio,
    FamilyandAncestors: family,
    PeopleWhoHaveInfluencedMe: influence,
    RelationshipsToFoster: relationships
  }

  return personalStoryData;
}

export const getEducation = async (personId: number | undefined, householdId? : number | undefined) => {
  const ownerParams: OwnerParams = {
    requestType: ApiRequestType.LIST,
    modelName: OwnerModelType.EDUCATION,
    ownerType: OwnerType.PERSON,
    householdId: householdId
  };

  let educationList: EducationItem[] = [];

  const resEd = await api.education.list({...ownerParams, personId: personId});
    resEd?.data?.forEach(ed => {
        ed.PersonID = personId;
    });
  
  console.log(resEd?.data)
  educationList = [...educationList as EducationItem[], ...resEd?.data];

  return educationList;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
 export const getPersonalStoryReportData = async (householdId: number, interviewId: number, personId: number) => {
  // Null check
  if (isNullOrUndefined(householdId)) {
      // TODO - handle no evaluation id
  }
  console.log(personId);
  
  // Fetch data
  const household = await api.household.get(householdId);
  const person = await api.person.get(personId, householdId);
  const personalData = await getPersonalResponses(householdId, interviewId, personId);
  const educationData = await getEducation(personId, householdId);
  
  return {
      household: household?.data,
      person: person?.data,
      personalData: personalData,
      educationData: educationData
  };
}


const PersonalStoryReport = ({ personalData, person, educationData, isOpen, onClose }: ClientProfileProps): ReactElement => {

  const { selectedHousehold } = useStoreState((state) => state.household);
  const getPersonName = (person:Person) => {
    const preferredName = person.PreferredName ? `${person.PreferredName} ` : person.FirstName ? person.FirstName + ' ' : '';
    const lastName = person.LastName ? person.LastName + ' ' : '';
    return preferredName + lastName;
  }

  const divClass = (title?: string) : string => {
    if(title == "People Who Have Influenced Me" || title == "My Letter of Thanks") {
        return "bcr-bottom-alt"
    }
    else
    {
      return "bcr-bottom"
    }
  }

  const displayPersonalInfo = (person?: Person, title?: string) => {
    if(title == "Biographical Summary") {
      return (
        <>
        <div className="bcr-content">
        <h3 style={{ color: "#72c6c7", textTransform: "uppercase", fontSize: "14px", lineHeight: "20px", fontWeight: "bold", marginBlockStart: "0px", marginBlockEnd: "0px", marginInlineStart: "0px", marginInlineEnd: "0px"}}>
          BIRTHDATE
        </h3>
        <p style={{fontSize: "12px", marginTop: "1px"}}>
          {
            
            personBirthdate(person)
          }                               
          </p>
        </div>
        <div className="bcr-content">
        <h3 style={{ color: "#72c6c7", textTransform: "uppercase", fontSize: "14px", lineHeight: "20px", fontWeight: "bold", marginBlockStart: "0px", marginBlockEnd: "0px", marginInlineStart: "0px", marginInlineEnd: "0px"}}>
          BIRTHPLACE
        </h3>
        <p style={{fontSize: "12px", marginTop: "1px"}}>
            {person?.Birthplace}
            {console.log(person?.Birthplace)}
          </p>
        </div>
        <div className="bcr-content">
        <h3 style={{ color: "#72c6c7", textTransform: "uppercase", fontSize: "14px", lineHeight: "20px", fontWeight: "bold", marginBlockStart: "0px", marginBlockEnd: "0px", marginInlineStart: "0px", marginInlineEnd: "0px"}}>
          EDUCATION/DEGREE
        </h3>
        <p style={{fontSize: "12px", marginTop: "1px"}}>
            {educationData?.map(ed => {
                return (
                  <>
                    {ed.EducationDescription?.concat(" - ", String(ed.InstitutionName), " (", convertStringToDateText(ed.CompletionDate, Number(ed.CompletionDateString)), ")")}
                  <br/>
                  </>
                );
            })}
          </p>
        </div>
        {/* <div>
        <h3 style={{ color: "#72c6c7", textTransform: "uppercase", fontSize: "14px", lineHeight: "20px", fontWeight: "bold", marginBlockStart: "0px", marginBlockEnd: "0px", marginInlineStart: "0px", marginInlineEnd: "0px"}}>
            ACTIVITIES/HOBBIES
          </h3>
          <p style={{fontSize: "12px", marginTop: "1px"}}>
            {person?.}
            </p>
        </div> */}
      </>
      )
    }
  }

  const educationList = getEducation(person?.PersonID, person?.HouseholdID);  
  
  const reportOptions: IReportOptions = {
    title: 'Personal Story',
    storyofus: true,
    familyName: person ? getPersonName(person) : '',
    familyImage: getPhotoUrlOrDefault(person),
    isOpen,
    onClose,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Personal-Story-Report",
    scale: 1,
    subject: "Discover: Personal Story Report",
    author: selectedHousehold.CreatedBy,
    keepTogether: ".keep-together",
    margin: 0 
  } 

  const ids: number[] = [];

  let birthdate = moment(person?.DateOfBirth, "MM-DD-YYYY")

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
      <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold.CreatedBy)} householdId={Number(person?.HouseholdID)} >
          <PersonalStory personalData={personalData} person={person} educationData={educationData} pageNumber={1} />
          </ReportWrapper>
          <div className="newPage"/>
          <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold.CreatedBy)} householdId={Number(person?.HouseholdID)} >
                <PersonalStory personalData={personalData} person={person} educationData={educationData} pageNumber={2} />
          </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default PersonalStoryReport;

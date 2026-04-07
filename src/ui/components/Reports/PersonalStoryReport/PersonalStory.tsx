import React, {ReactElement} from "react";
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
import { PDFExportProps } from "@progress/kendo-react-pdf";
import household from "~/store/household";
import { Household } from "~/types/api/household";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { PersonalStoryData } from "./PersonalStoryReport";

export interface ClientProfileProps {
  personalData?: PersonalStoryData;
  educationData?: EducationItem[];
  person?: Person;
  isOpen?: boolean;
  onClose?: () => unknown;
  pageNumber: number;
}


export const getOwner = (person?: Person) => {
  if(person?.HouseholdID)
  {
    console.log(person);
    api.household.get(person?.HouseholdID).then(res => res.data).then(data => {
      if(data) {
        console.log(data);
        let household = data as Household;
        if(household?.CreatedBy)
        {
          
          return household?.CreatedBy;
        }
      }
    });      
  }

  return "";
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
    
  educationList = [...educationList as EducationItem[], ...resEd?.data];


  return educationList;
}

export const generateResponseSummaryFromResponsesArray = (responses:InterviewResponse[]) => {
  let response: string = "";
  responses.forEach(r => {    
    if(r.ResponseText) {
        response = response + r?.ResponseText?.replace(/●/g, "") + " ";
        response = response.replace(/\s\s+/g, '').replace(/^\s+/g, '') + " ";
    }
  }
  )
  return response;
}

export const checkColumn = (title: string) => {
  switch(title){
    case "People Who Have Influenced Me":    
      return 2;
    case "Relationships to Foster":
      return 2;
    default:
      return 2
  }
}


const PersonalStory = ({ personalData, person, educationData, pageNumber }: ClientProfileProps): ReactElement => {

  const ownerId = getOwner(person);

  const getPersonName = (person:Person) => {
    const preferredName = person.PreferredName ? `${person.PreferredName} ` : person.FirstName ? person.FirstName + ' ' : '';
    const maidenName = person.OriginalSurname ? '(' + person.OriginalSurname + ') ' : ''; 
    const lastName = person.LastName ? person.LastName + ' ' : '';
    return preferredName + maidenName + lastName;
  }

  const divClass = (title?: string) : string => {
    if(title == "People Who Have Influenced Me" || title == "Relationships to Foster") {
        return "personalstory-row-1"
    }
    else
    {
      return "personalstory-row"
    }
  }

  const headerProps = {
    showHeader: true,
    title: "Personal Story",
    subTitle: null,
    storyofus: true,
    familyName: person ? getPersonName(person) : '',
    image: getPhotoUrlOrDefault(person),
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
  };

  return (
    <>
      <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={headerProps.image} 
          familyName={headerProps.familyName} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
          {pageNumber == 1 ? 
            <>
            <PersonalStorySection sectionData={personalData?.BiographicalSummary} title="Biographical Summary" person={person} educationData={educationData} />
            <PersonalStorySection sectionData={personalData?.FamilyandAncestors} title="Family and Ancestors" person={person} educationData={educationData} />
            </>
          :
          <>
          <PersonalStorySection sectionData={personalData?.PeopleWhoHaveInfluencedMe} title="People Who Have Influenced Me" person={person} educationData={educationData} />
          <PersonalStorySection sectionData={personalData?.RelationshipsToFoster} title="Relationships To Foster" person={person} educationData={educationData} />
          </>
          }
    </>
  )
}


export default PersonalStory;

interface PersonalStorySectionProps {
  sectionData?: ReportSpecificResponses[];
  educationData?: EducationItem[];
  person?: Person;
  title: string;
}


const PersonalStorySection = ({sectionData, educationData, person, title}: PersonalStorySectionProps) => {

  console.log(person?.DateOfBirth);

  const displayPersonalInfo = (person?: Person, title?: string) => {
    if(title == "Biographical Summary") {
      return (
        <>
        <div className="no-break">
          <h3 className="personalstory-row-h3">
            BIRTHDATE
          </h3>
          <div className="personalstory-row-p">
            {
              personBirthdate(person)
            }                               
            </div>
        </div>
        <div className="no-break">
          <h3 className="personalstory-row-h3">
            BIRTHPLACE
          </h3>
          <div className="personalstory-row-p">
              {person?.Birthplace}
            </div>
        </div>
        <div className="no-break">
        <h3 className="personalstory-row-h3">
          EDUCATION/DEGREE
        </h3>
        <div className="personalstory-row-p">
            {educationData?.map(ed => {
                return (
                  <>
                    {ed.EducationDescription?.concat(" - ", String(ed.InstitutionName), " (", convertStringToDateText(ed.CompletionDate, Number(ed.CompletionDateString)), ")")}
                  <br/>
                  </>
                );
            })}
          </div>
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

  return (
    <>
      <div className="personalstory-table">
      <div>
        <div className="personalstory-header">
          {title}
          </div>
      </div>
      <div>
        <div>
          <div className={checkColumn(title) == 2 ? "personalstory-row" : "personalstory-row-1"}>
            { displayPersonalInfo(person, title) }
            {sectionData?.map((qd,i) => {
              if(qd.responses && qd.responses.length > 0) {
                return (
                    <div className="no-break">
                        {qd?.title != "" ? 
                          <h3 className="personalstory-row-h3">
                            {qd?.title}
                          </h3> : null }
                          <div className="personalstory-row-p">
                              {generateResponseSummaryFromResponsesArray(qd.responses as InterviewResponse[])}
                        </div>
                    </div>
                )
              }
            })}
            </div>
          </div>
      </div>
    </div>
    </>

  )
}

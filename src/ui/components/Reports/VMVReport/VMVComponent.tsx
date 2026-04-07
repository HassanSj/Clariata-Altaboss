import React, {ReactElement} from "react";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import api from "~/services/api";
import { isNullOrUndefined } from "util";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import { getInterviewWizardFull } from "~/services/interview";
import { InterviewResponse } from "~/types/api/interviewResponse";
import { getCouplePicture, getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { width } from "@material-ui/system";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

export const getVMVResponses = async (householdId: number, interviewId: number, persons: Person[], household: Household) => {
  const primaryPerson = persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID);

  let vision = ''; 
  let res = await api.interviewresponse.list(householdId, interviewId, 322);
  if(res?.data && res?.data.length > 0) vision += `The ${primaryPerson?.LastName} Family aspires to be `;
  vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;
  res = await api.interviewresponse.list(householdId, interviewId, 323);
  if(res?.data && res?.data.length > 0) vision += 'We intend to leave a legacy of being ';
  vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;
  res = await api.interviewresponse.list(householdId, interviewId, 324);
  if(res?.data && res?.data.length > 0) vision += 'We will strive to be ';
  vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;

  let mission1 = '';
  res = await api.interviewresponse.list(householdId, interviewId, 325);
  if(res?.data && res?.data.length > 0) mission1 += `We, the ${primaryPerson?.LastName} Family, believe that our purpose as a family is to `;
  mission1 += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;
  res = await api.interviewresponse.list(householdId, interviewId, 326);
  if(res?.data && res?.data.length > 0) mission1 += `We are unique because we `;
  mission1 += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}`;
  res = await api.interviewresponse.list(householdId, interviewId, 327);
  if(res?.data && res?.data.length > 0) mission1 += `, and we are at our best when we `;
  mission1 += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;

  let mission2: string[] = [];

  let str = `Improving as a family by `;
  res = await api.interviewresponse.list(householdId, interviewId, 328);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);

  str = `Making our home a place of `;
  res = await api.interviewresponse.list(householdId, interviewId, 331);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);

  str = `Interacting with each other in a spirit of `;
  res = await api.interviewresponse.list(householdId, interviewId, 332);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);
  
  str = `Maintaining our responsibility to each other by `;
  res = await api.interviewresponse.list(householdId, interviewId, 333);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);

  str = `Serving each other by `;
  res = await api.interviewresponse.list(householdId, interviewId, 329);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);

  str = `Supporting our community by `;
  res = await api.interviewresponse.list(householdId, interviewId, 330);
  str += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText : ''}.`;
  if(res?.data && res?.data?.length > 0 ) mission2.push(str);

  const coreValues = await api.interviewresponse.list(householdId, interviewId, 321);

  return {
    vision: vision,
    mission1: mission1,
    mission2: mission2,
    coreValues: coreValues?.data
  }
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getVMVReportData = async (householdId: number, interviewId: number) => {
  // Null check
  if (isNullOrUndefined(householdId)) {
  // TODO - handle no evaluation id
  }

  
  // Fetch data
  const household = await api.household.get(householdId);
  const persons = await api.person.list(householdId);
  
  const responses = await getVMVResponses(householdId, interviewId, persons?.data, household?.data);

  return {
    household: household?.data,
    persons: persons?.data,
    ...responses
  };
}

export interface VMVReportProps {
  household?: Household;
  persons?: Person[];
  vision?: string;
  mission1?: string;
  mission2?: string[];
  coreValues?: InterviewResponse[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

const VMVComponent = ({ household, persons, vision, mission1, mission2, coreValues }: VMVReportProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: "Vision, Mission, Core Values",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
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
    <div>
      {vision != '' ?
      <>
      <div className="vmv-table">
        <div>
          <div className="vmv-section-title">
            <p>Vision</p>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div className="vmv-bcr-bottom no_table">
                {vision}
              </div>
            </div>
          </div>
        </div>
      </div>
      </> : null }
      {mission1 != '' || (mission2 && mission2?.length > 0) ?
      <>
        <div className="vmv-table">
        <div>
          <div className="vmv-section-title">
            <p>Mission</p>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div className="vmv-bcr-no-bottom">
                {mission1}
              </div>
            </div>
          </div>
        </div>
        {mission2 && mission2?.length > 0 ?
        <div>
          <div>
              <div className="vmv-bcr-bottom-columns">
              <h3>WE WILL ACCOMPLISH THIS BY: </h3>
                      {mission2?.map(m => {
                          return (
                              <p>• {m}</p>
                          )
                      })}
              </div>
          </div>
        </div> : null }
      </div>
      </> : null }
      {coreValues && coreValues?.length > 0 ?
      <>
        <div className="vmv-table">
        <div>
          <div className="vmv-section-title">
          <p>Core Values</p>
          </div>
        </div>
        <div>
          <div>
            <div className="vmv-bcr-bottom-columns">
                      <h3>OUR GUIDING PRINCIPLES ARE: </h3>
                      {coreValues?.map(m => {
                          return (
                              <p>• {m?.ResponseText}: {m?.WhyIsThisImportant}</p>
                          )
                      })}
            </div>
          </div>
        </div>
      </div>
      </> : null }
    </div>  
    </>
    
  )
}

export const VMVComponentSmallTable = ({ household, persons, vision, mission1, mission2, coreValues, isOpen, onClose }: VMVReportProps): ReactElement => {
  return (
    <table className="dlpr-text">
      <tr>
        {vision != '' ?
        <td>
            <h3>VISION</h3>
            <div className="dlpr-content">
                <p>{vision}</p>
            </div>
        </td> : null }
        {coreValues && coreValues?.length > 0 ?
        <td rowSpan={2}>
            <h3>CORE VALUES</h3>
            <div className="dlpr-content">
                <h4>OUR GUIDING PRINCIPLES ARE:</h4>
                <ul>
                  {coreValues?.map(m => {
                      return (
                        <li><span>{m?.ResponseText}</span></li>
                      )
                  })}
                </ul>
            </div>
        </td> : null }
      </tr>
      <tr>
        {mission1 != '' || (mission2 && mission2?.length > 0) ?
        <td>
            <h3>MISSION</h3>
            <div className="dlpr-content">
                {mission1 != '' ? <p>{mission1}</p> : null }
                {mission2 && mission2?.length > 0 ? 
                <>
                  <h4>WE WILL ACCOMPLISH THIS BY:</h4>
                  <div className="dlpr-two-cols-ul">
                      <ul>
                      {mission2?.map(m => {
                          return (
                            <li><span>{m}:</span></li>
                          )
                      })}
                      </ul>
                  </div>
                </> : null }
            </div>
        </td> : null }
      </tr>
  </table>
    
  )
}



export default VMVComponent;

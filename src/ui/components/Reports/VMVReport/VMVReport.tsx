import React, {ReactElement, useEffect, useState} from "react";
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
import VMVComponent from "./VMVComponent";
import { logoBase64WithouText } from "../PDFReportExport/images";
import { User } from "~/types/api/user";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";

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

export const VMVComponentSmallTable = ({ household, persons, vision, mission1, mission2, coreValues, isOpen, onClose }: VMVReportProps): ReactElement => {

  return (
    <table className="dlpr-text" style={{backgroundColor: "#7acaca", border: "20px solid #7acaca"}}>
      <tr>
        {vision != '' ?
        <td style={{width: "60%", backgroundColor: "#FFFFFF", borderBottom: "20px solid #7acaca", borderRight: "20px solid #7acaca"}}>
          <div>
            <div className="blue" style={{fontSize: "18px", fontWeight: "600", padding: "5px 20px", borderBottom: "2px solid #d64f23", backgroundColor: "#eef8f7"}}>VISION</div>
          </div>
          <div>
            <div className="dlpr-content" style={{padding: "5px 20px"}}>
                <p>{vision}</p>
            </div>
          </div>            
        </td> : null }
        {coreValues && coreValues?.length > 0 ?
        <td rowSpan={2} style={{width: "40%", backgroundColor: "#FFFFFF", verticalAlign: "top"}}>
          <div>
            <div className="blue" style={{fontSize: "18px", fontWeight: "600", padding: "5px 15px", borderBottom: "2px solid #d64f23", backgroundColor: "#eef8f7"}}>CORE VALUES</div>
            <div className="dlpr-content" style={{padding: "5px 15px"}}>
                <h4 style={{color: "#7acaca"}}>OUR GUIDING PRINCIPLES ARE:</h4>
                <ul>
                  {coreValues?.map(m => {
                      return (
                        <>
                        <li><span>{m?.ResponseText}: {m?.WhyIsThisImportant}</span></li>
                        <br/>
                        </>
                      )
                  })}
                </ul>
            </div>
          </div>
        </td> : null }
      </tr>
      <tr>
        {mission1 != '' || (mission2 && mission2?.length > 0) ?
        <td style={{backgroundColor: "#FFFFFF", borderRight: "20px solid #7acaca"}}>
          <div>
            <div className="blue" style={{fontSize: "18px", fontWeight: "600", padding: "5px 15px", borderBottom: "2px solid #d64f23", backgroundColor: "#eef8f7"}}>MISSION</div>
            <div className="dlpr-content" style={{padding: "5px 15px"}}>
                {mission1 != '' ? <p>{mission1}</p> : null }
                {mission2 && mission2?.length > 0 ? 
                <>
                  <h4 style={{color: "#7acaca"}}>WE WILL ACCOMPLISH THIS BY:</h4>
                  <div className="dlpr-two-cols-ul">
                      <ul>
                      {mission2?.map(m => {
                          return (
                            <li><span>{m}</span></li>
                          )
                      })}
                      </ul>
                  </div>
                </> : null }
            </div>
          </div>
        </td> : null }
      </tr>
  </table>
    
  )
}

const VMVReport = ({ household, persons, vision, mission1, mission2, coreValues, isOpen, onClose }: VMVReportProps): ReactElement => {

  const [owner, setOwner] = useState<User>();

  const reportOptions: IReportOptions = {
    storyofus: true,
    title: "Vision, Mission, Core Values",
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    isOpen,
    onClose,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Vision-Mission-Values-Report",
    scale: 1,
    subject: 'Dream: Vision, Mission, Core Values',
    author: household?.CreatedBy,
    keepTogether: "tr",
    landscape: false,
  }

  const getOwnerInfo = async () => {

    let user = (await api.user.getHouseholdUser(String(household?.CreatedBy), Number(household?.HouseholdID)))?.data as User;

    setOwner(user);
    
}

useEffect(() => {    
    getOwnerInfo();
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
          <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
            <VMVComponent household={household} persons={persons} vision={vision} mission1={mission1} mission2={mission2} coreValues={coreValues} isOpen={isOpen} onClose={onClose} />
          </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default VMVReport;

import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import { FamilyStoryReportData, ReportSpecificResponses } from "../FamilyStoryReport/FamilyStoryReport";

import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

interface EnterpriseData {
  title: string;
  value: string;
}

interface EnterpriseProps {
  enterpriseData?: EnterpriseData[];
  data?: FamilyStoryReportData[];
  household?: Household;
  persons?: Person[];
}

const Enterprise = ({ enterpriseData, data, household, persons }: EnterpriseProps): ReactElement => {
  
  const headerProps = {
    showHeader: true,
    title: "Enterprise Report",
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
        {enterpriseData && enterpriseData?.length > 0 ?
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
          <table className="enterprise-table keep-together">
            <thead>
              <tr>
                <th className="enterprise-header">
                Enterprise Details
                </th>
              </tr>
            </thead>
          <tbody>
            <tr>
              <td>
                <div className="enterprise-row">
                  {enterpriseData?.map((e,i) => {
                      return (
                          <div>
                              <h3 className="enterprise-row-h3">
                                {e?.title}</h3>
                                <p className="enterprise-row-p">
                                  {e.value}
                                </p>
                          </div>
                      )
                  })}
                </div>
              </td>
            </tr>
            </tbody>
        </table></> : null }
        {data?.map((d)=> {
          if(d.data.length > 0) {
            return (
              <>
                <table className="enterprise-table">
                  <thead>
                    <th className="enterprise-header">
                      {d.title}
                    </th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="enterprise-row">
                          {d.data.map((qd,i) => {
                            if(qd.responses && qd.responses.length > 0) {
                              return (
                                  <div>
                                      {qd?.title !== "" ? <h3 className="enterprise-row-h3">{qd?.title}</h3> : null }
                                      {qd.responses.map(r => {
                                          return (
                                            <p className="enterprise-row-p">
                                              {r.ResponseText}
                                            </p>
                                          )
                                      })}
                                  </div>
                              )
                            }
                          })}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            );
          }
        })}  
    </>
  )
}


export default Enterprise;

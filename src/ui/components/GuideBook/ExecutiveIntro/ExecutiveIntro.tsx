import React, {ReactElement} from "react";
import { Objective } from "~/types/api/models";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";

export interface ExecutiveIntroProps {
  ownerName?: string;
  familySurname?: string;
  selectedObjectives?: Objective[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

const ExecutiveIntro = ({ ownerName, familySurname, selectedObjectives, isOpen, onClose }: ExecutiveIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'ExecutiveIntro',
    storyofus: true,
    static: true,
    isOpen,
    onClose
  }

  return (
    <>

        <table className="table-page">
          <tbody>
          <tr>
            <td style={{verticalAlign: "top"}}>
            <div className="executive-page">
            <div className="executive-page-title">
                <p className="blue"><strong>Your Plan: At A Glance</strong></p>
            </div>

            <div className="executive-content">
              <div>
              <strong>You asked yourself what success would look like</strong> if you could paint the perfect picture of the future for you
              and your family. You took the time to understand what you needed to do and what it would take to overcome the
              barriers and constraints that were keeping you from realizing what you want to achieve. Working with {ownerName ? `${ownerName} ` : ''}
              you developed your <strong>Clariata LifeMap plan</strong> that is designed to help you use what you have to achieve
              what you want.
              </div>
            </div>

            <div className="executive-content">
              The {familySurname ? familySurname : '' }, working in concert with {ownerName ? ownerName :  "us"}, completed the <strong>LifeMap Process</strong>
              to create a family LifeMap plan. It lays out the LifeMap objectives based on their importance, what resources are
              needed to accomplish each objective, and the timing for action. A <strong>LifeMap Action Plan</strong> has been developed for
              the family for the next twelve months to enhance the family’s potential to achieve the successes and goals it has
              set forth.
            </div>

            <div className="executive-priority-header orange">
              <em>There are {selectedObjectives?.length} primary objectives the family has identified
              to pursue in the coming months. They are:</em>
            </div>

            <div className="executive-priority-list ">
                <div className="executive-priority-list-items">
                    {selectedObjectives?.map((o,i) => {
                        return (
                            <p className="executive-priority-list-item">
                                <span className="orange">{i+1}.</span> {o?.Description}
                            </p>
                        )
                    })}
                </div>
            </div>
            <div className="executive-content">
              The {familySurname ? familySurname : '' } is committed to achieving and/or making significant progress on each of the
              primary LifeMap objectives listed above. In addition to the primary initiatives the {familySurname ? familySurname : '' } family will
              pursue with {ownerName ? ownerName :  "us"}, there are additional LifeMap metrics of success the family will pursue on its
              own.
            </div>
            <div className="executive-content">
              All of the family’s <strong>metrics of success</strong> are included in the <strong>Dream Section</strong> of the Guidebook because it is
              important to keep in mind that, whether big or small, each metric will have demands on the family’s resources.
              For example, how would you decide if it’s the right time to build your dream home?
            </div>
            <div className="executive-content">
              The {familySurname ? familySurname : '' } will meet with {ownerName ? ownerName :  "us"} on a periodic basis to review progress and
              refine the strategy as appropriate. Progress reports will also be provided by {ownerName ? ownerName :  "us"} to the {familySurname ? familySurname : '' }. 
              <strong>The family plans to update their LifeMap plan annually.</strong>
            </div>
            </div>
          </td>
          </tr>
          <tr>
          <td valign="bottom">
                  <div style={{marginLeft: "54px", marginBottom: "20px"}}>
                     <table className="pdf-footer-table">
                           <tr>
                           <td className="pdf-footer-table-td" rowSpan={2}><img src={logoBase64WithouText} className="pdf-footer-logo" /></td>
                              <td className="pdf-footer-table-td">
                                 <div className="pdf-footer-createdby">
                                       Guidebook | Prepared By {ownerName}
                                 </div>
                              </td>
                           </tr>
                           <tr>
                              <td className="pdf-footer-copyright">
                                 &copy; 2022 Clariata, LLC. All Rights Reserved.
                              </td>
                           </tr>
                     </table>
                  </div>
               </td>
         </tr>
          </tbody>
          </table>
    </>
  )
}


export default ExecutiveIntro;

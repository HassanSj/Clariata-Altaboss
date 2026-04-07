import React, {ReactElement} from "react";
import { Objective } from "~/types/api/models";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import FinalLogo from './images/final_icon.png';
import familyPicture from './images/family.png';
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";

export interface FinalIntroProps {
  ownerName?: string;
  firmName?: string;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const FinalIntro = ({ ownerName, firmName, isOpen, onClose }: FinalIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'FinalIntro',
    storyofus: true,
    static: true,
    isOpen,
    onClose
  }

  return (
    <>
        <table className="table-page">
           <tr>
              <td style={{verticalAlign: "top"}}>
                 <div className="final-page">
               <div className="logo">
                  <img className="final-logo" src={FinalLogo} />
               </div>
               <div className="final-page-title blue">
                  <p className="blue"><strong>Final Thoughts</strong></p>
               </div>
               <div className="final-content">
                  The LifeMap Process has been life-changing for the families we serve at {firmName ? firmName :  ""}. This
                  holistic new approach to planning for the future has opened their minds and their hearts to what really matters.
               </div>
               <div className="final-content-large">
                  The LifeMap Process provides a straightforward means to use what you have to pursue
                  what you want based on what is important to you; providing direction on how best to use
                  the resources you have at your disposal.
               </div>
               <div className="final-content">
               What does this mean? It means you are in control of what you need to do or have done.
               </div>
               <div className="final-content">
                  As an example, what if your tax advisor contacts you and recommends a strategy with significant tax benefits?
                  Would it be beneficial for you to follow the advisor’s recommendation? Within the context of what needs to be
                  evaluated, such a move may be more detrimental than helpful. What if the advisor’s strategy required most of
                  the cash you have available while at the same time you are planning for your daughter’s wedding? Which is
                  more important?
               </div>
               <div className="final-content">
                  This is not to say that a tax saving strategy is a bad idea. But you must be able to make resource allocation
                  decisions fully aware of all that is important to you. The LifeMap Process gives you and your advisory team 
                  the full picture of what you need and want based on what is important to you. Tax
                  savings and funding weddings are both important.
               </div>
               <div className="final-content">
               Using this balanced approach, you can make the best decisions for you and your family in how you choose to
               allocate your resources in pursuit of what matters most.
               </div>
               <div className="final-content">
                  The LifeMap Process can be a powerful tool for your family. Whether you are addressing pursuits on your own
                  or through the assistance of {ownerName ? ownerName :  "your advisor"}, you can achieve your dreams.
               </div>
               <div className="final-content">
                  <p className="orange"><em>Let’s get started!</em></p>
               </div>
               <div className="final-image-container">
                  <img className="final-image" src={familyPicture} />
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
        </table>

    </>
  )
}


export default FinalIntro;

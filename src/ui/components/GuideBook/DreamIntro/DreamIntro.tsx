import React, {ReactElement} from "react";
import { Objective } from "~/types/api/models";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";
import DreamLogo from './images/Clariata5DIcon_Dream.png';
import vacation from './images/vacation.png';

export interface DreamIntroProps {
  ownerName?: string;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const DreamIntro = ({ ownerName, isOpen, onClose }: DreamIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'DreamIntro',
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
              <div className="dream-page">
            <div className="logo">
                <img className="dream-logo" src={DreamLogo}/>
            </div>
            <div className="dream-page-title">
                <p className="blue"><strong>Dream: What does success look like?</strong></p>
            </div>
            <div className="dream-page-subtitle">
                <p className="orange"><em>What does a well-lived life look like for the family, today and in the future?</em></p>
            </div>  
            <table className="dream-content">
              <tr>
                <td colSpan={2} style={{paddingBottom: "10px"}}>
                  <div className="dream-content">
                    It’s the journey that matters. Where you end up is of little significance if you didn’t take time to <strong>live each moment</strong>.
                    True success in life is measured more by the quality of your journey than by reaching your eventual destination.
                  </div>
                  <div className="dream-content">
                    What does a journey, filled with successes mean to you, and <strong>what does a well-lived life look</strong> like for you and
                    your family? This vision for your life is the core of the LifeMapping process.
                  </div>
                  <div className="dream-content">
                    The LifeMap Process gives you the ability to fully articulate your vision of what a well-lived life means to you.
                    Simply put, it will help you <strong>determine where you want to go with your life</strong>. The goals and aspirations you
                    identify through the LifeMapping process give you clarity on your direction.
                  </div>
                </td>
              </tr>  
              <tr >
                <td>
                    <img className="dream-image" src={vacation} />
                </td>
                <td>
                <div className="dream-list">
                  <div className="dream-list-title">
                      You were asked during the Dream Interview what you personally want for yourself,
                      your family, in the work place, and within your community in terms of:
                      
                  </div>
                  <div className="dream-list-items">
                      <div className="dream-list-item">
                        <span className="orange">–</span> Enjoyment and Happiness
                      </div>
                      <div className="dream-list-item">
                        <span className="orange">–</span>  Goals and Accomplishments
                      </div>
                      <div className="dream-list-item">
                        <span className="orange">–</span> Making a difference
                      </div>
                      <div className="dream-list-item">
                        <span className="orange">–</span> Values and Beliefs that will stand as your legacy
                      </div>
                  </div>
                </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="dream-content">
                    Having invested the time to articulate what you want, you are on your way to pursuing what matters most to you
                    and your family. Knowing where you want to go, what you want to do, and what this means to you makes it much
                    easier to decide <strong>how you will use your resources</strong> to achieve what matters most to you.
                  </div>
                  <div className="dream-content">
                    While each of the metrics of success identified in the interview are important, some are more important than
                    others. And some require immediate consideration while others can be addressed later. In the final step of the
                    Dream phase, those metrics necessary to address in the coming year were compiled into the <strong>Priority Grid</strong> at
                    the beginning of this section.
                  </div>
                </td>
              </tr>
            </table>
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


export default DreamIntro;

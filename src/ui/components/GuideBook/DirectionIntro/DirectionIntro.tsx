import React, {ReactElement} from "react";
import { Objective } from "~/types/api/models";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";
import DirectionLogo from './images/Clariata5DIcon_Direction.png';
import notes from './images/notes.png';

export interface DirectionIntroProps {
  ownerName: string,
  isOpen?: boolean;
  onClose?: () => unknown;
}

const DirectionIntro = ({ ownerName, isOpen, onClose }: DirectionIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'DirectionIntro',
    storyofus: true,
    static: true,
    isOpen,
    onClose
  }

  return (
    <>
        <table className="table-page">
          <tr>            
            <td style={{verticalAlign: "top"}} >
              <div className="direction-page">
            <div className="logo">
                <img className="direction-logo" src={DirectionLogo}/>
            </div>
            <div className="direction-page-title">
                <p className="blue"><strong>Direction: What needs to be done to make our dreams real?</strong></p>
            </div>
            <div className="direction-page-subtitle">
                <p className="orange"><em>How will our family reach our goals and priorities? What do we need to do to be successful?</em></p>
            </div>
            <table>
              <tr>
                <td colSpan={2}>
                  <div className="direction-content">
                    The Direction phase of the process creates a roadmap for you and your family based on your vision for the future. Then you determine the timing for pursuing each metric of success. Finally, you ascertain what of your resources will be needed to achieve each of your prioritized metrics of success.
                  </div>
                  <div className="direction-content">
                    What might this look like?
                  </div>
                  <div className="direction-content">
                    The strategic planning framework of the LifeMap Process <strong>brings everything together</strong> to pursue what is
                    important in living your life fully.
                  </div>
                  <div className="direction-content">
                    Most people are overwhelmed by the number of priorities they’ve listed as being important to them. And, of
                    course, they are all important. But you cannot pursue everything at once. As you examine your list of priorities,
                    what kinds of resources should be allocated to each pursuit? Where do you start? Which measures of
                    success command your time and attention now and which will have to wait?
                  </div>
                  <div className="direction-content">
                    <strong>The “how” of the LifeMap process</strong> comes to life in the creation, implementation, and execution of the LifeMap
                    strategy. This is the bridge to the practical side of how families can best manage their affairs to pursue what
                    matters most. This phase of the process provides the mechanism and methodology for allocating your
                    resources.
                  </div>
                  <div className="direction-content">
                    In this phase, your family will decide on <strong>how best to pursue what matters most</strong>. You will consider how to
                    allocate and employ your time, your abilities, your connections, and your economic resources in your endeavors.
                  </div>
                  <div className="direction-content">
                    The LifeMap strategy pulls everything together. It lays out your objectives and goals based on their importance,
                    what resources are needed to accomplish each objective, and the timing for action. The LifeMap strategy will
                    also make it easier for your advisors to work together in helping you in your pursuits.
                  </div>
                </td>
              </tr>
              <tr className="direction-content">
                <td><img className="direction-image" src={notes}/></td>
                <td className="direction-content-right">                   
                      <div className="direction-content">
                      In this section, the LifeMap strategy will break down the
                      year in quarterly segments and focus on what needs to be
                      done by month on one or more considerations. The strategy
                      will also define the who, what, where, why, and how
                      necessary to accomplish your objectives.
                      </div>
                      <div className="direction-content">Properly executed, the LifeMap strategy will serve as the
                      roadmap for the <strong>development of the family’s action plan</strong> to achieve what matters most.
                      </div>
                </td>
              </tr>
            </table>
            {/* <p className="padding-b-15">Having invested the time to articulate what you want, you are on your way to pursuing what matters most to you
                and your family. Knowing where you want to go, what you want to do, and what this means to you makes it much
                easier to decide <strong>how you will use your resources</strong> to achieve what matters most to you.
            </p>
            <p className="padding-b-15 turquoise-divider">While each of the metrics of success identified in the interview are important, some are more important than
                others. And some require immediate consideration while others can be addressed later. In the final step of the
                Dream phase, those metrics necessary to address in the coming year were compiled into the <strong>Priority Grid</strong> at
                the beginning of this section.
            </p> */}
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


export default DirectionIntro;

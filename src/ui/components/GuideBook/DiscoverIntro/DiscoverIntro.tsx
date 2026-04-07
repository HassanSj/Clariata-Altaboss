import React, {ReactElement} from "react";
import { Objective } from "~/types/api/models";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";
import DiscoverLogo from "./images/Clariata5DIcon_Discover.png";
import DiscoverImage from "./images/discover_image.png";

export interface DiscoverIntroProps {
  ownerName: string,
  isOpen?: boolean;
  onClose?: () => unknown;
}

const DiscoverIntro = ({ ownerName, isOpen, onClose }: DiscoverIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'DiscoverIntro',
    storyofus: true,
    static: true,
    isOpen,
    onClose
  }

  return (
    <>
        <table className="table-page keep-together">
          <tr>
            <td style={{verticalAlign: "top"}}>
              <div className="discover-page">
            <div className="logo">
                <img className="discover-logo" src={DiscoverLogo}/>
            </div>
            <div className="discover-page-title">
                <p className="blue"><strong>Discover: What Gives Your Family Life?</strong></p>
            </div>
            <div className="discover-page-subtitle">
                <p className="orange"><em>What do you know about your family? What is your story? Why is this important?</em></p>
            </div>
            <table className="discover-content">
              <tr>
                <td><img className="discover-image" src={DiscoverImage}/></td>
                <td className="discover-content-right">
                  <div>                    
                      <div className="discover-content-right-title">
                        The LifeMap Process is a values-based
                        understanding of who you and your
                        family are and what you care about.
                      </div>
                      <div className="discover-content">You didn’t just spring into existence yesterday.
                        You’ve come from somewhere, and that
                        somewhere says a lot about who you are
                      </div>
                      <div className="discover-content">And so, the <strong>LifeMap Process</strong> begins with a
                        conversation about your family story. As the story
                        unfolds, it reveals patterns, values, and
                        experiences that influenced you and your family.
                        The farther back you go, the more you may learn
                        about why you are who you are today
                      </div>
                  </div>
                </td>
              </tr>
              <tr>
                  <td colSpan={2}>
                    <div className="discover-content">
                      As you shared your story a diagram of your <strong>family tree</strong> and <strong>timeline</strong> were developed. The family tree is a visual
                      representation of your family’s roots. It provides insight with respect to patterns of activity, behavior, and
                      attitudes that are transmitted across generations. It’s a combination of genealogical information, such as births,
                      deaths, marriages, and separations, and a timeline of important life events. Here is where the <strong>values, beliefs,
                      and behaviors that have formed your family</strong> are found.
                    </div>
                    <div className="discover-content">
                      Once completed, the Legacy of Five Family Tree (grandparents through grandchildren) becomes a powerful
                      depiction of <strong>your family’s life story</strong> oftentimes triggering moments of recognition as family members study the
                      tree and begin to realize how events and patterns have shaped their own lives.
                    </div>
                    <div className="discover-content">
                      As family traditions are passed on from one generation to the next, so too are the values embodied in them.
                      Carrying on these traditions can deepen relationships and promote closeness and cohesiveness within the
                      family. As the family grows, <strong>honoring and celebrating the family’s traditions</strong> becomes ever more important in
                      keeping the family together. 
                    </div>
                    <div className="discover-content">
                      Understanding where you’ve come from is an important step in <strong>living your life fully</strong> as you pursue what matters
                      most. It provides the historic context of what you stand for. Your life journey and that of your family have helped
                      form who you are. It gives meaning and purpose to how you make decisions. 
                    </div>
                    <div className="discover-content">
                      <strong>What do you stand for? What do you believe? Which of your values will others see as your legacy?</strong>
                    </div>
                    
                  </td>
              </tr>
              </table>            
              <div className="turquoise-divider">                                                            
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


export default DiscoverIntro;

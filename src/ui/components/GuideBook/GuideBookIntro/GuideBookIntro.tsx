import React, {ReactElement} from "react";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import logo from "./images/logo.png";
import pc from "./images/pc.png";
import walking from "./images/walking.png";
import orange_arrow from "./images/orange-arrow.png";
import { logoBase64WithouText } from "../../Reports/PDFReportExport/images";

export interface GuideBookIntroProps {
  ownerName?: string;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const GuideBookIntro = ({ ownerName, isOpen, onClose }: GuideBookIntroProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'GuideBookIntro',
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
                <div className="introduction-page">
                    <div className="introduction-title">
                        <p className="blue"><strong>Introduction</strong></p>
                    </div>

                    <div className="introduction-logo">
                            <img className="introduction-logo-img" src={logo}/>
                        {/* <div className="introduction-logo-text">
                            <p className="blue">Clariata</p>
                        </div> */}
                    </div>
                        <table className="introduction-section keep-together">
                            <tr>
                                <td>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <div className="introduction-section-header orange">
                                    <em>Welcome to your personal LifeMap Guidebook.</em>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <div className="introduction-section-content">
                                <div>
                                    <p>
                                        The Guidebook outlines your LifeMap plan, designed to help you, your family and your advisory team use what
                                        you have to achieve what you want. Whether it’s delegating certain activities to others or giving you the time to
                                        do what you want, this plan will help you align your resources, bringing the right people together to assist you in
                                        your pursuits and providing you with the information you need to make knowledgeable decisions.
                                    </p>
                                    <p>
                                        The Guidebook can be used by you {ownerName ? `and/or ${ownerName} ` : ''}as well as anyone else you need to help you
                                        pursue what matters most.
                                    </p>
                                </div>
                                <div>
                                    <table>
                                        <tr>
                                            <td>
                                                <div className="introduction-consent-columns">
                                                    <div className="introduction-content-column-one">
                                                        <div className="introduction-section-header turquoise">
                                                            <strong>The 5-D LifeMap Process</strong>
                                                        </div>
                                                        <p>
                                                            The LifeMap Process creates a roadmap for you
                                                            and your family. Initially, in the <strong>Discover</strong> phase of
                                                            the process, you shared your story to gain clarity
                                                            on who you are, based on your and your family’s
                                                            journey. Then in the <strong>Dream</strong> phase you described
                                                            what a well-lived life looks like for you today and in
                                                            the future using the Success Mapping tool.
                                                        </p>
                                                        <p>
                                                            In the <strong>Direction</strong> phase a strategy was established
                                                            to bring order and logic to what needs to be done
                                                            to pursue what is most important to you at any
                                                            given time. <strong>This Guidebook is a summation of
                                                            your LifeMap strategy.</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{display: "inline-block", verticalAlign: "top"}}>
                                                <div className="introduction-content-column-two">
                                                    <div className="introduction-content-column-two-item">
                                                        <div className="introduction-content-arrow">
                                                            <img src={orange_arrow}/>
                                                        </div>
                                                        <div className="introduction-content-arrow-group">
                                                        <div className="introduction-content-arrow-header turquoise">
                                                                DISCOVER
                                                        </div>
                                                        <div className="introduction-content-arrow-text">
                                                            What gives your family life?
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="introduction-content-column-two-item">
                                                        <div className="introduction-content-arrow">
                                                            <img src={orange_arrow}/>
                                                        </div>
                                                        <div className="introduction-content-arrow-group">
                                                            <div className="introduction-content-arrow-header turquoise">
                                                                DREAM
                                                            </div>
                                                            <div className="introduction-content-arrow-text">
                                                            What does a well-lived life look like for you?
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="introduction-content-column-two-item">
                                                        <div className="introduction-content-arrow">
                                                            <img src={orange_arrow}/>
                                                        </div>
                                                        <div className="introduction-content-arrow-group">
                                                            <div className="introduction-content-arrow-header turquoise">
                                                            DIRECTION
                                                            </div>
                                                            <div className="introduction-content-arrow-text">
                                                            What do we need to do?
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="introduction-content-column-two-item">
                                                        <div className="introduction-content-arrow">
                                                            <img src={orange_arrow}/>
                                                        </div>
                                                        <div className="introduction-content-arrow-group">
                                                            <div className="introduction-content-arrow-header turquoise">
                                                            DEEPEN
                                                            </div>
                                                            <div className="introduction-content-arrow-text">
                                                            How will {ownerName ? `and ${ownerName} ` : ''} help us?
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="introduction-content-column-two-item">
                                                        <div className="introduction-content-arrow">
                                                            <img src={orange_arrow}/>
                                                        </div>
                                                        <div className="introduction-content-arrow-group">
                                                            <div className="introduction-content-arrow-header turquoise">
                                                            DESTINY
                                                            </div>
                                                            <div className="introduction-content-arrow-text">
                                                            How do we prepare for the future?
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div>
                                    <p>
                                        The <strong>Deepen</strong> phase of the process focuses on the details of what needs to be done by {ownerName ? `and/or ${ownerName} ` : ''} to help you achieve your priorities.</p>
                                    <p>
                                        The next phase of the process, <strong>Destiny</strong> provides a set of tools and information your family can use to prepare for the future.
                                    </p>
                                    <p>
                                        This Guidebook is a summation of your LifeMap strategy. 
                                    </p>
                                </div>
                                <div className="introduction-section-content-bottom">
                                    The implementation of the LifeMap Process will put you in control of your destiny. Now you {ownerName ? `and ${ownerName} ` : ''}can begin to focus on what comes next.
                                </div>
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

    {/* SECOND PAGE */}
    <div className="newPage" />

    <table className="table-page">
        <tr>
            <td style={{verticalAlign: "top"}}>
            <div className="introduction-page">
                <div className="introduction-section">
                    <div className="introduction-section-header blue">
                        <strong>How to Use the Guidebook</strong>
                    </div>
                    <div className="introduction-section-content">
                        <p>
                        The LifeMap plan focuses on upcoming goals and priorities. At the beginning of each planning period, {ownerName ? `${ownerName}'s` :  "our"}
                        team will work with you to update your plan. The plan will list a schedule of actions to be taken
                        during that period, who will manage each action step, and what resources will be needed (time, abilities, funds,
                        etc.). {ownerName ? `and ${ownerName}'s ` : ''}implementation plan will also list measurable outcomes for each step. The master
                        schedule and action planning steps are included in the Guidebook. At a future date, you can opt to move to a
                        different time period such as a quarterly schedule if that’s more appealing.
                        </p>
                        <p>
                        {ownerName ? `and ${ownerName} ` : ''}will provide periodic progress reports. The report will provide information on the status
                        of each objective including what’s been done, the next step(s), by whom, and timing. {ownerName ? `and ${ownerName} ` : ''}
                        will also alert you when an action item requires your input or activity
                        </p>
                    </div>
                    <div className="introduction-section-content-bottom orange"> 
                        A summary of the implementation process and commentary for each step of the process follows:
                    </div>
                    <div className="introduction-content-columns" style={{marginTop: "25px"}}>
                        <div className="introduction-content-column-one">
                                <div className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow}/>
                                    </div>
                                    <div className="introduction-content-arrow-text">
                                        Where are we going?
                                    </div>
                                </div>
                                <div className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow}/>
                                    </div>
                                    <div className="introduction-content-arrow-text">
                                        Where are we now?
                                    </div>
                                </div>
                                <div className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow}/>
                                    </div>
                                    <div className="introduction-content-arrow-text">
                                        How will we get there?
                                    </div>
                                </div>
                                <div className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow}/>
                                    </div>
                                    <div className="introduction-content-arrow-text">
                                        How are we doing??
                                    </div>
                                </div>
                                <div className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow}/>
                                    </div>
                                    <div className="introduction-content-arrow-text">
                                        Adjust the plan as needed
                                    </div>
                                </div>                        
                        </div>
                        <div className="introduction-content-column-two">
                            <div className="introduction-pc-img">
                                <img src={pc}/>
                            </div>                    
                        </div>
                    </div>
                    <div className="introduction-walking">
                        <div className="introduction-walking-column-one">
                                <img className="introduction-walking-img" src={walking}/>
                        </div>
                        <div className="introduction-walking-column-two blue">
                            The LifeMap Process gives you and your advisory team the full picture of what you need and want based on what is important to you.
                        </div>
                    </div> 
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

    {/* THIRD PAGE */}
    <div className="newPage" />

    <table className="table-page">
        <tr>
            <td style={{verticalAlign: "top"}}>
            <div className="introduction-page">
                <div className="introduction-section">
                    <div className="introduction-section-header turquoise">
                        <strong>Implementation Steps</strong>
                    </div>
                    <div className="introduction-section-content">
                        <div className="introduction-content-columns">
                            <div className="introduction-content-column-one">
                                <div  className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow} />
                                    </div>
                                    <div>
                                        <div className="introduction-content-arrow-text orange">
                                            Clarification of your LifePlan strategic objectives for the period
                                        </div>
                                        <div className="introduction-section-content">
                                        List the priorities and implementation steps for each priority to be addressed in the upcoming period.
                                        </div>
                                    </div>
                                </div>
                                <div  className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow} />
                                    </div>
                                    <div>
                                        <div className="introduction-content-arrow-text orange">
                                        Situation assessment
                                        </div>
                                        <div className="introduction-section-content">
                                        For each of your success metric priorities ask yourself, “Where am I now?” An understanding of the
                                        current condition provides a baseline for what needs to be done. On an ongoing basis, this step will
                                        be important to assess where you are in the implementation process relative to what you are trying
                                        to accomplish.
                                        <div className="introduction-list">
                                            <div className="introduction-list-title">
                                                To assess the current condition, the following questions should be considered:
                                            </div>
                                            <div className="introduction-list-items">
                                            <div className="introduction-list-item"><span className="orange">–</span> What factors are influencing the current condition?</div>
                                            <div className="introduction-list-item"><span className="orange">–</span> What challenges do you face in pursuing this priority?</div>
                                            <div className="introduction-list-item"><span className="orange">–</span> What do you need to achieve this priority?</div>
                                            <div className="introduction-list-item"><span className="orange">–</span> How will this priority impact you and your family?</div>
                                            <div className="introduction-list-item"><span className="orange">–</span> What problems have you encountered in previous efforts to pursue this priority?</div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div  className="introduction-content-column-one-item">
                                    <div className="introduction-content-arrow">
                                        <img src={orange_arrow} />
                                    </div>
                                    <div>
                                        <div className="introduction-content-arrow-text orange">
                                        Plan the coming month’s actions to be taken to achieve the objective
                                        </div>
                                        <div className="introduction-section-content">
                                        {ownerName ? ownerName :  "We"} will work with you to address how the priority will be pursued.
                                        <div className="introduction-list">
                                            <div className="introduction-list-title">
                                                Use the following questions to map out the execution tasks of the implementation plan:
                                            </div>
                                            <div className="introduction-list-items">
                                                <div><span className="orange">–</span> What are the tasks and steps to be taken in pursuit of each metric? (Consideration must be
                                                    paid to the priority and sequencing of tasks and steps.)
                                                </div>
                                                <div className="introduction-list-item"><span className="orange">–</span> Who will be the Champion (accountable and responsible) for this priority?</div>
                                                <div className="introduction-list-item"><span className="orange">–</span> What is the due date?</div>
                                                <div className="introduction-list-item"><span className="orange">–</span> What are the expected outcomes?</div>
                                                <div className="introduction-list-item"><span className="orange">–</span> What are the metrics associated with this priority?</div>
                                                <div className="introduction-list-item"><span className="orange">–</span> What are the resources required to achieve this priority?</div>
                                                <div className="introduction-list-item"><span className="orange">–</span> What is the current status of this priority?</div>
                                            </div>
                                            <div className="guidebook-stars">{

                                            }
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

    {/* FOURTH PAGE */}
    <div className="newPage" />

    <table className="table-page">
        <tr>
            <td style={{verticalAlign: "top"}}>
            <div className="introduction-page">
            <div className="introduction-section">
                <div className="introduction-section-content">
                    <div className="introduction-content-columns">
                        <div className="introduction-content-column-one">
                            <div  className="introduction-content-column-one-item">
                                <div className="introduction-content-arrow">
                                    <img src={orange_arrow} />
                                </div>
                                <div>
                                    <div className="introduction-content-arrow-text orange">
                                        Monitor progress
                                    </div>
                                    <div className="introduction-section-content">
                                        <p>Progress reviews after each period help to see where you are, what has been accomplished, what is
                                        behind schedule, and what steps need to be taken to get back on track. Monitoring and evaluation
                                        ensures that everyone is following the direction established during the LifeMapping process
                                        </p>
                                        <p>
                                        Progress reviews are a good time to see if you over- or under-estimated what could be accomplished and make adjustments. This is also a good time to review the assumptions that the LifeMap strategy was built upon and decide if they are still valid
                                        </p>
                                        <p>
                                        Remember that your LifeMap is a living document that needs to reflect reality.
                                        </p>
                                        <div className="introduction-list">
                                            <div className="introduction-list-title">
                                                Some questions that should be asked during progress reviews with {ownerName ? ownerName :  "us"} are:
                                            </div>
                                            <div className="introduction-list-items">
                                                <div className="introduction-list-item"><span className="orange">– </span>Current status of objectives? Are they on or off schedule with the implementation timeline? If so,
                                                        why? There are lessons to be learned whether you are on or off schedule. Lessons that may be
                                                        helpful going forward
                                                </div>
                                                <div className="introduction-list-item"><span className="orange">– </span>What challenges are you encountering? What has been getting in the way?</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Do you have the right people involved and sufficient resources?</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Is the scheduled timeline realistic?</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Any updates to the timeline required? Why?</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>What can {ownerName ? ownerName :  "we"} do to help you be successful?</div>
                                            </div>
                                        </div>
                                        <div className="introduction-list">
                                            <div className="introduction-list-title">
                                                Annual Reviews are a good time to take a fresh look at your LifePlan and conduct:
                                            </div>
                                            <div className="introduction-list-items">
                                                <div className="introduction-list-item"><span className="orange">– </span>Review of the year’s accomplishments</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Understand what was not achieved and why</div>
                                                <div className="introduction-list-item"><span className="orange">– </span> Conduct a review of all factors (personal or external) to see what has shifted in the environment. The LifeMap must reflect reality</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Make adjustments to your LifeMap plan for the next year and communicate to everyone and develop the tactics for the next year</div>
                                                <div className="introduction-list-item"><span className="orange">– </span>Begin the process of tracking and reviewing again</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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


export default GuideBookIntro;

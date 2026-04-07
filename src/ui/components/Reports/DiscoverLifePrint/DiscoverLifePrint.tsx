import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import {User} from "~/types/api/user";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions, logoBase64WithouText} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {getFamilyName, getFamilyPicture} from "../StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import api from "~/services/api";
import {Objective} from "~/types/api/models";
import {getDefaultPhotoSrc, getPhotoUrlOrDefault} from "~/ui/constants/user";
import {getChartData} from "../LifeGraphReport/LifeGraphReport";
import DonutChart from "../../Charts/DonutChart";
import DiscoverLogo from "./images/Clariata5DIcon_Discover.png";
import {Enabled, GroupByType, ElbowType, NavigationMode, PageFitMode} from 'basicprimitives';
import { replaceWhiteSpaceWithEnter } from "../FamilyTreeReport/FamilyTree";
// import { getTimelineData, TimelineFilters } from "../TimelineReport/TimelineReport";
import { getVMVResponses, VMVComponentSmallTable } from "../VMVReport/VMVReport";
import { InterviewResponse } from "~/types/api/interviewResponse";
import {FamDiagram} from 'basicprimitivesreact';
import { ExecOptionsWithBufferEncoding } from "child_process";
import PDFReportExport from "../PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { IReportOptions } from "../PDFReportExport/PDFReportExport";
import { CustomFilter, getTimelineData, TimelineFilters } from "../../Timeline/TimelineReport";
import { TimelineData, TimelineLifePrint } from "~/ui/components/Reports/TimelineReport/TimelineReport";
import { TimelineItem } from "~/types/api/timelineItem";
import { AutoComplete } from "@progress/kendo-react-dropdowns";


export interface WhyData {
    objectiveId: number;
    why?: string;
}

export interface DiscoverLifePrintProps {
    household?: Household;
    persons?: Person[];
    timelineItems?: TimelineData;
    treeData?: any;
    vision?: string;
    mission1?: string;
    mission2?: string[];
    coreValues?: InterviewResponse[];
    owner: string;
    isOpen?: boolean;
    onClose?: () => unknown;
}

export const getOwner = async (household: Household) => {

    let ownerId = String(household.CreatedBy);
    const ownerResponse = await api.user.getUser(ownerId);
    const owner = await ownerResponse.data;

    return {
        owner
    }
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param selectedPriorities
 */
export const getDiscoverLifePrintData = async (householdId: number, interviewId: number, startYear: Date, endYear : Date, filters: TimelineFilters[], customFilter: CustomFilter) => {

    // Fetch data
    const householdResponse = await api.household.get(householdId);
    const household = await householdResponse.data;
    const persons = await api.person.list(householdId);
    const tree = await api.familytree.get(householdId, true);
    const timelineItems = await getTimelineData(householdId, startYear, endYear, filters, customFilter);
    console.log(timelineItems);
    const vmv = await getVMVResponses(householdId, interviewId, persons?.data, household);

    console.log("Vision:" + vmv.vision)

    const owner = await getOwner(household);

    const ownerName = owner.owner.FirstName + " " + owner.owner.LastName;

    return {
        household: household,
        persons: persons?.data,
        treeData: tree?.data,
        timelineItems: timelineItems,
        vision: vmv.vision,
        mission1: vmv.mission1,
        mission2: vmv.mission2,
        coreValues: vmv.coreValues,
        owner: ownerName
    }

}


const DiscoverLifePrint = ({
                            household,
                            persons,
                            timelineItems,
                            treeData,
                            vision,
                            mission1,
                            mission2,
                            coreValues,
                            owner,
                            isOpen,
                            onClose,
                        }: DiscoverLifePrintProps): ReactElement => {

    console.log("timelineItems");
    console.log(timelineItems);

    const reportOptions: IReportOptions = {
        storyofus: true,
        title: "Disover LifePrint",
        familyName: getFamilyName(household, persons),
        familyImage: household ? getFamilyPicture(household) : undefined,
        isOpen,
        onClose,
        header: false,
        }
    
        const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Discover-LifePrint",
        scale: 1,
        subject: 'Discover LifePrint',
        author: household?.CreatedBy,
        keepTogether: "keep-together",
        landscape: false,
        }

    const config = {
        pageFitMode: PageFitMode.AutoSize,
        autoSizeMaximum: {width: 1600, height: 1400},
        cursorItem: 2,
        // linesWidth: 1.5,
        scale: 1.25,
        padding: { left: 25, right: 0, top: 25, bottom: 0 },
        linesColor: '#183f69',
        normalLevelShift: 40,
        //dotLevelShift: 0,
        lineLevelShift: 40,
        //normalItemsInterval: 10,
        //dotItemsInterval: 10,
        //lineItemsInterval: 0,
        //arrowsDirection: GroupByType.Parents,
        //connectorType: GroupByType.None,
        //elbowType: ElbowType.None,
        showExtraArrows: false,
        hasSelectorCheckbox: Enabled.False,
        hasButtons: Enabled.False,
        buttonsPanelSize: 40,
        //navigationMode: NavigationMode.Inactive,
        // @ts-ignore
        defaultTemplateName: "contactTemplate",
        //showFrame: Enabled.False,
        alignByLevels: true,
        templates: [{
          name: "contactTemplate",
          itemSize: {width: 80, height: 176},
          minimizedItemSize: {width: 3, height: 3},
          highlightPadding: {left: 2, top: 2, right: 2, bottom: 2},
          // @ts-ignore
          onItemRender: ({context: itemConfig}) => {
            return (
              <div className="person_card">
                            {/* <img src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()} title={itemConfig.title} style={{
                              width: '79px',
                              height: '79px'
                            }} /> */}
                            <img crossOrigin="anonymous"  src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()} title={itemConfig.title} style={{width: '79px', height: '79px' }}/>
                            <p className="person_name">
                                <strong>{replaceWhiteSpaceWithEnter(itemConfig.title)}</strong>
                            </p>
                            <p className="person_age">
                                <strong>{itemConfig?.description}
                                </strong>
                            </p>
                        </div>
            )
          },
          // @ts-ignore
          cursorPadding: { left: 3, top: 3, right: 3, bottom: 3 },
          cursorBorderWidth: 2,
        }],
        items: treeData,
    };


    return (
        <>
        <PDFReportExport reportOptions={reportOptions} options={options} excludeFooter={true}>
            <table className="LifePrint-Display" style={{width: "2485px", maxHeight: "1645px", margin: "10px", padding: "10px", border: "thin solid #ffffff", borderCollapse: "collapse"}}>
                <tbody>
                    <tr>
                        <td rowSpan={2} style={{width: "1260px", border: "thin solid #7acaca", verticalAlign: "top", maxHeight: "1400px", overflow: "-moz-hidden-unscrollable", marginRight: "10px"}} className="dlpr-col-50 dlpr-border dlpr-timeline">
                        <span className="lifeprint-heading">{household?.HouseholdName} Timeline</span>

                            {/* timeline report component */}
                            <div className="lifeprint-timeline">
                                <TimelineLifePrint timelineItems={timelineItems} 
                                    household={timelineItems?.household} 
                                    persons={persons}
                                    primaryOne={timelineItems?.primaryOne}
                                    primaryTwo={timelineItems?.primaryTwo} />
                            </div>
                        </td>
                            
                        <td style={{width: "1260px", height: "1400px", border: "thin solid #7acaca", backgroundColor: "#eef8f7", marginLeft: "10px", verticalAlign: "top"}}>
                            <span className="lifeprint-heading-alt">Legacy of Five Family Tree</span>
                            {/* family tree component */}
                            <div className="lifeprint-famtree" style={{backgroundColor: "#eef8f7", alignItems: "center"}}>
                                <FamDiagram config={config}/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                    <td style={{width: "1260px", border: "thin solid #7acaca", backgroundColor: "#eef8f7", verticalAlign: "top", marginLeft: "10px"}}>
                            <div>
                                <VMVComponentSmallTable household={household}
                                                                        persons={persons}
                                                                        vision={vision}
                                                                        mission1={mission1}
                                                                        mission2={mission2}
                                                                        coreValues={coreValues} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                        <div className="dlpr-footer">
                            {/* Footer from other lifeprints */}
                            <div style={{display: "flex", flexDirection: "row", border: "thin solid #7acaca", padding: "0px"}}>
                                <div style={{flex: "1", marginTop: "auto", marginBottom: "auto"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img className="module-logo" src={DiscoverLogo}/>
                                    </div>        
                                </div>
                                <div style={{flex: "1", alignContent: "flex-start", borderRight: "thin solid #7acaca"}}>
                                    <p className="blue" style={{fontSize: "59px", verticalAlign: "center"}}>Discover</p>
                                </div>
                                <div style={{alignContent: "center", borderRight: "thin solid #7acaca", paddingLeft: "25px", paddingRight: "25px"}}>
                                    <p style={{fontSize: "15px", textAlign: "center"}} className="title turquoise">KEY QUESTION</p>
                                    <p style={{fontSize: "34px", fontWeight: "600", textAlign: "center"}} className="question blue">What are your hopes and dreams for your children and grandchildren?</p>
                                </div>
                                <div style={{flex: "2", display: "flex", flexDirection: "column", borderRight: "thin solid #7acaca"}}>
                                    <div style={{display: "flex", flexDirection: "row", borderBottom: "thin solid #7acaca", backgroundColor: "#eef8f7", height: "70px"}}>
                                        <div style={{flex: "1"}}>
                                            <img style={{maxHeight: "70px", width: "auto"}} src={household ? getFamilyPicture(household) : undefined}/>
                                        </div>
                                        <div style={{flex: "3", alignSelf: "center"}}>
                                            <p style={{fontSize: "16px", fontWeight: "600", textAlign: "left"}} className="blue">{getFamilyName(household, persons)}</p>
                                        </div>
                                        <div style={{flex: "1"}}>
                                            <p>{Date.now}</p>
                                        </div>
                                    </div>
                                    <div style={{flex: "1", display: "flex", flexDirection: "row"}}>
                                            <div className="f-col-left" style={{paddingLeft: "15px"}}>
                                                <p className="blue" style={{ fontSize: "11px", fontWeight: "600"}}>
                                                    {owner}
                                                </p>
                                            </div>
                                        {/* <div className="f-col-right">
                                            <div className="f-col-inline">
                                                <p className="blue">Financial<br/> Advisor </p>
                                            </div>
                                            <div className="f-col-inline">
                                                <img src="images/header-img.jpg"/>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div style={{flex: "1", padding: "5px"}}>
                                    <div style={{textAlign: "center"}}>
                                        <img style={{height: "70px", width: "auto"}} src={logoBase64WithouText}/>
                                        <div style={{textAlign: "center", fontSize: "42px", fontWeight: "600"}} className="blue">Clariata</div>
                                        <div style={{textAlign: "center", fontSize: "11px", fontWeight: "600"}} className="orange">
                                            clariata.com
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* END Footer from other lifeprints */}

                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </PDFReportExport>
        </>
    )
}


export default DiscoverLifePrint;

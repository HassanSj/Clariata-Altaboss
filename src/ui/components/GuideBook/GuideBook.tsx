import React, {ReactElement, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import {Family, getHouseholdFamily} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
import { PDFExport, savePDF, PDFExportProps, PageTemplateProps } from "@progress/kendo-react-pdf";
import { logoBase64, logoBase64WithouText, printBase64 } from "~/ui/components/Reports/PDFReportExport/images";
import {Household} from "~/types/api/household";
import api from "~/services/api";
import LegacyOfFiveFamily from "../Reports/LegacyOfFiveFamilyProfile/LegacyOfFiveFamily";
import GuideBookCover from "./GuideBookCover";
import {User} from "~/types/api/user";
import ChapterSeparator from "./ChapterSeparator";
import {ChapterType} from "./ChapterSeparator/ChapterSeparator";
import StoryOfUs, { getStoryOfUsReportData } from "../Reports/StoryOfUsReport/StoryOfUs";
import {getInterviewWizardFull} from "~/services/interview";
import {getStoryOfUsQuestionsAndResponsesArray} from "../Reports/StoryOfUsReport/StoryOfUs";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import FamilyStory from "../Reports/FamilyStoryReport/FamilyStory";
import {FamilyStoryData, FamilyStoryReportData, getFamilyStoryData} from "../Reports/FamilyStoryReport/FamilyStoryReport";
import {
    EnterpriseData,
    getEnterprise,
    getEnterpriseResponses
} from "../Reports/EnterpriseReport/EnterpriseReport";
import Enterprise from "../Reports/EnterpriseReport/Enterprise";
import FamilyTree from "../Reports/FamilyTreeReport/FamilyTree";
import {getVMVResponses} from "../Reports/VMVReport/VMVReport";
import {InterviewResponse} from "~/types/api/interviewResponse";
import PriorityGrid from "../Reports/PriorityGridReport/PriorityGrid";
import {Objective} from "~/types/api/models";
import WhyComponent from "../Reports/WhyReport/WhyComponent";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import LifeGraph from "../Reports/LifeGraphReport/LifeGraph";
import {getLifeGraphData} from "../Reports/LifeGraphReport/LifeGraphReport";
import PriorityRanking from "../Reports/PriorityRankingReport/PriorityRanking";
import CurationSummary, { CurationSummaryPage, getCurationSummaryPages } from "../Reports/CurationSummaryReport/CurationSummary";
import {getCurationPriorities} from "../Reports/CurationSummaryReport/CurationSummaryReport";
import ActionPlanSummaryQuarter from "../Reports/ActionPlanSummaryQuarterReport/ActionPlanSummaryQuarter";
import GanttChart from "../Reports/GanttChartReport/GanttChart";
import GuideBookContent from "./GuideBookContent";
import GuideBookIntro from "./GuideBookIntro";
import PersonalStory, { getEducation } from "../Reports/PersonalStoryReport/PersonalStory";
import {getPersonalResponses, PersonalStoryData} from "../Reports/PersonalStoryReport/PersonalStoryReport";
import TimelineReport from "../Reports/TimelineReport";
import ExecutiveIntro from "./ExecutiveIntro";
import DreamIntro from "./DreamIntro";
import DirectionIntro from "./DirectionIntro";
import FinalIntro from "./FinalIntro";
import DiscoverIntro from "./DiscoverIntro";
import moment from "moment";
import VMVComponent from "../Reports/VMVReport/VMVComponent";
import ActionPlanSummaryQuarterReport from "../Reports/ActionPlanSummaryQuarterReport";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import { getStoryOfUsData, StoryOfUsData } from "../Reports/StoryOfUsReport/StoryOfUsReport";
import ReportWrapper from "../Reports/ReportWrapper/ReportWrapper";
import { EducationItem } from "~/types/api/educationItem";
import { getWhyReportPages, WhyReportPage } from "../Reports/WhyReport/WhyReport";
import { TimelineData } from "../Reports/TimelineReport/TimelineReport";
import { getTimelineData } from "../Timeline/TimelineReport";

export interface GuideBookProps {
    household?: Household;
    family?: Family;
    persons?: Person[];
    owner?: User;
    storyOfUsData?: StoryOfUsData;
    storyOfUsQuestionsAndResponses?: {id: number, title: string, section: number, questionOrder: number, questionResponse: QuestionAndResponse[]}[];
    familyStoryData?: FamilyStoryData;
    enterprise?: EnterpriseData[];
    enterpriseData?: FamilyStoryReportData[];
    //timelineData?: { date: number, description: string, icon?: string, picture?: string }[];
    timelineData?: TimelineData;
    vmvResponses?: {
        vision: string;
        mission1: string;
        mission2: string[];
        coreValues: InterviewResponse[];
    };
    treeData?: any;
    objectives?: Objective[];
    selectedObjectives?: Objective[];
    dimensions?: DimensionOfLife[];
    metrics?: MetricOfSuccess[];
    dimensionsGraph?: { household: Household,
                        chartData: {
                            value: number;
                            color: string;
                            category?: string;
                        }[][],
                    chartImages: string[],
                    persons: Person[],
                    isMetric: boolean
                    metrics?: any;
                    }
    metricsGraph?: { household: Household,
                        chartData: {
                            value: number;
                            color: string;
                            category?: string;
                        }[][],
                    chartImages: string[],
                    persons: Person[],
                    isMetric: boolean
                    metrics?: any;
                    }
    curationPriorityPages?: CurationSummaryPage[];
    curationPriorities?: Objective[];
    whyReportPages?: WhyReportPage[],
    year?: number;
    quarters?: QuarterData[];
    spouse1?: Person;
    spouse2?: Person;
    personalStoryDataSpouse1?: PersonalStoryData;
    personalStoryDataSpouse2?: PersonalStoryData;
    educationDataSpouse1?: EducationItem[];
    educationDataSpouse2?: EducationItem[];    
    actionPlanStartDate?: string;
    actionPlanEndDate?: string;
    coverPage?: boolean;
    toc?: boolean;
    introduction?: boolean;
    atAGlanceCover?: boolean;
    atAGlance?: boolean;
    discoverCover?: boolean;
    discoverIntro?: boolean;
    vmv?: boolean,
    storyofus?: boolean;
    person1?: boolean;
    person2?: boolean;
    familyStory?: boolean;
    enterpriseReport?: boolean;
    timeline?: boolean;
    familyTree?: boolean;
    legacyOfFive?: boolean;
    dreamCover?: boolean;
    dreamIntro?: boolean;
    priorityGrid?: boolean;
    dimension?: boolean;
    metric?: boolean;  
    why?: boolean;
    gantt?: boolean;
    directionCover?: boolean;
    directionIntro?: boolean;
    priorityRanking?: boolean;
    curationSummary?: boolean;
    actionPlan?: boolean;
    finalCover?: boolean;
    finalIntro?: boolean;
}

/**
 * Fetch guidebook data.
 * @param householdId
 * @param discoverInterviewId
 * @param dreamInterviewId
 * @param legacyOfFive
 * @param person1
 * @param person2
 * @param storyOfUs
 * @param familyStory
 * @param enterprise
 * @param timeline
 * @param tree
 * @param vmv
 * @param priorityGrid
 * @param why
 * @param dimension
 * @param metric
 * @param priorityRanking
 * @param curationSummary
 * @param actionPlan
 * @param gantt
 * @param year
 * @param quarter
 * @param actionPlanStartDate
 * @param actionPlanEndDate
 */
// export const getGuidebookData = async (householdId: number, discoverInterviewId: number, dreamInterviewId: number, year?: number, quarter?: number) => {
export const getGuidebookData = async (householdId: number,
                                       discoverInterviewId: number,
                                       dreamInterviewId: number,
                                       coverPage: boolean,
                                       toc: boolean,
                                       introduction: boolean,
                                       atAGlanceCover: boolean,
                                       atAGlance: boolean,
                                       discoverCover: boolean,
                                       discoverIntro: boolean,
                                       vmv: boolean,
                                       storyOfUs: boolean,                                       
                                       person1: boolean,
                                       person2: boolean,                                       
                                       familyStory: boolean,
                                       enterprise: boolean,
                                       timeline: boolean,
                                       tree: boolean,
                                       legacyOfFive: boolean,
                                       dreamCover: boolean,
                                       dreamIntro: boolean,
                                       priorityGrid: boolean,
                                       why: boolean,
                                       dimension: boolean,
                                       metric: boolean,
                                       directionCover: boolean,
                                       directionIntro: boolean,
                                       priorityRanking: boolean,
                                       curationSummary: boolean,
                                       actionPlan: boolean,
                                       gantt: boolean,
                                       finalCover: boolean,
                                       finalIntro: boolean,
                                       actionPlanStartDate?: string,
                                       actionPlanEndDate?: string) => {

    const guidebookData: GuideBookProps = {
    };

    guidebookData.actionPlanEndDate = actionPlanEndDate
    guidebookData.actionPlanStartDate = actionPlanStartDate

    guidebookData.household = await api.household.getFull(householdId);
    guidebookData.family = await getHouseholdFamily(householdId, true);
    guidebookData.persons = (await api.person.list(householdId))?.data;
    guidebookData.owner = (await api.user.getHouseholdUser(String(guidebookData?.household?.CreatedBy), householdId))?.data as User;
    const wizard = await getInterviewWizardFull(householdId, discoverInterviewId);

    console.log("Story of Us " + storyOfUs)
    if (storyOfUs) {

        guidebookData.storyOfUsData = (await getStoryOfUsReportData(householdId, discoverInterviewId)).storyOfUsData;
        
        
        //let response = getStoryOfUsQuestionsAndResponsesArray(wizard);
        //guidebookData.storyOfUsQuestionsAndResponses = response;
    }
    if (familyStory) guidebookData.familyStoryData = await getFamilyStoryData(householdId, discoverInterviewId);
    if (enterprise) guidebookData.enterprise = await getEnterprise(householdId,guidebookData.persons);
    if (enterprise) guidebookData.enterpriseData = await getEnterpriseResponses(householdId, discoverInterviewId);
    if (tree) guidebookData.treeData = (await api.familytree.get(householdId, true))?.data;
    //if (timeline) guidebookData.timelineData = await getTimelineData(householdId, 0, 2022);
    //guidebookData.timelineData = getTimelineData(householdId,)
    if (vmv && guidebookData?.persons) guidebookData.vmvResponses = await getVMVResponses(householdId, discoverInterviewId, guidebookData?.persons, guidebookData?.household);
    guidebookData.objectives = (await api.objective.list(householdId, dreamInterviewId))?.data;

    const res = await api.objective.getSelectedList(householdId);
    const selectedList = res?.data?.SelectedObjectiveList as Objective[];

    for (let selectedObjective of guidebookData.objectives) {
        if(selectedObjective?.InterviewResponseID)
        {
            const res = await api.interviewresponse.get(householdId, dreamInterviewId, selectedObjective?.InterviewResponseID);
            selectedObjective.Why = res?.data?.WhyIsThisImportant;
        }
    }
    
    guidebookData.selectedObjectives = guidebookData?.objectives?.filter(objective => {
        if (selectedList.some(o => o.ObjectiveID === objective.ObjectiveID)) {
            return objective;
        }
    });

    guidebookData.dimensions = (await api.dimensionofsuccess.list())?.data;

    const curationPriorites = await getCurationPriorities(householdId, dreamInterviewId, guidebookData?.objectives);
    if (actionPlan && guidebookData?.objectives) guidebookData.curationPriorities = curationPriorites;
    if (curationSummary) guidebookData.curationPriorityPages = await getCurationSummaryPages(curationPriorites);
    if (person1 && guidebookData?.household.PrimaryPerson1ID) guidebookData.spouse1 = (await api.person.get(guidebookData?.household.PrimaryPerson1ID, householdId))?.data;
    if (person2 && guidebookData?.household.PrimaryPerson2ID) guidebookData.spouse2 = (await api.person.get(guidebookData?.household.PrimaryPerson2ID, householdId))?.data;

    if (guidebookData?.spouse1) guidebookData.personalStoryDataSpouse1 = await getPersonalResponses(householdId, discoverInterviewId, guidebookData?.spouse1?.PersonID);
    if (guidebookData?.spouse2) guidebookData.personalStoryDataSpouse2 = await getPersonalResponses(householdId, discoverInterviewId, guidebookData?.spouse2.PersonID);
    
    if (guidebookData?.spouse1) guidebookData.educationDataSpouse1 = await getEducation(guidebookData?.spouse1?.PersonID, householdId);
    if (guidebookData?.spouse2) guidebookData.educationDataSpouse2 = await getEducation(guidebookData?.spouse2?.PersonID, householdId);
    guidebookData.whyReportPages = await getWhyReportPages(guidebookData.objectives);
    guidebookData.legacyOfFive = legacyOfFive;
    guidebookData.year = moment(actionPlanStartDate).year();
    // guidebookData.quarter = getQuarterOfMonth(moment(actionPlanStartDate).month());
    guidebookData.quarters = generateQuarters(moment(actionPlanStartDate).toDate(), moment(actionPlanEndDate).toDate());
    guidebookData.coverPage = coverPage;
    guidebookData.toc = toc;
    guidebookData.introduction = introduction;
    guidebookData.atAGlanceCover = atAGlanceCover;
    guidebookData.atAGlance = atAGlance;
    guidebookData.discoverCover = discoverCover;
    guidebookData.discoverIntro = discoverIntro;
    guidebookData.vmv = vmv;
    guidebookData.storyofus = storyOfUs;
    guidebookData.person1 = person1;
    guidebookData.person2 = person2;
    guidebookData.familyStory = familyStory;
    guidebookData.enterpriseReport = enterprise;
    guidebookData.familyTree = tree;
    guidebookData.timeline = timeline;
    guidebookData.dreamCover = dreamCover;
    guidebookData.dreamIntro = dreamIntro;
    guidebookData.priorityGrid = priorityGrid;
    guidebookData.why = why;
    guidebookData.dimension = dimension;
    guidebookData.metric = metric;
    guidebookData.metrics = (await api.metricofsuccess.list())?.data;
    if (dimension) {
        guidebookData.dimensionsGraph = await getLifeGraphData(householdId, dreamInterviewId, false);
    }
    if (metric) {
        guidebookData.metricsGraph = await getLifeGraphData( householdId, dreamInterviewId, true);
    }    

    guidebookData.directionCover = directionCover;
    guidebookData.directionIntro = directionIntro;
    guidebookData.priorityRanking = priorityRanking;
    guidebookData.curationSummary = curationSummary;
    guidebookData.actionPlan = actionPlan;    
    guidebookData.gantt = gantt;
    guidebookData.finalCover = finalCover;
    guidebookData.finalIntro = finalIntro;

    return guidebookData;
}

type Quarter = 1|2|3|4

/**
 * Calculate which quarter a month belongs to
 * @param month Number of month, js month so january is 0
 */
function getQuarterOfMonth(month: number):Quarter{
    if(month <= 2){
        return 1
    }else if(month <= 5){
        return 2
    }else if(month <= 8){
        return 3
    }else{
        return 4
    }
}

interface QuarterData {
    year: number;
    quarter: Quarter;
}

/**
 * Generate range for quarterly action plan
 * @param start
 * @param end
 */
export function generateQuarters(start:Date, end: Date):QuarterData[]{
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()

    const startMonth = start.getMonth()
    const endMonth = end.getMonth()

    const quartersLog:{[key:number]:Quarter[]} = {}
    const quarters:QuarterData[] = []

    for(let year = startYear; year <= endYear; year++){
        const isStartYear = year === startYear
        const isEndYear = year === endYear

        for(let month = isStartYear ? startMonth : 0; month <= (isEndYear ? endMonth : 11); month ++){
            let needsToAdd = true;
            const currentQuarter = getQuarterOfMonth(month)

            if(quartersLog[year]){
                if(quartersLog[year].indexOf(currentQuarter) !== -1){
                    needsToAdd = false;
                }
            }

            if(needsToAdd){
                quarters.push({year, quarter: currentQuarter})

                if(!quartersLog[year]){
                    quartersLog[year] = []
                }

                quartersLog[year].push(currentQuarter)
            }
        }
    }

    return quarters
}

const GuideBook = ({
                       household,
                       family,
                       persons,
                       owner,
                       storyOfUsData,
                       storyOfUsQuestionsAndResponses,
                       familyStoryData,
                       enterprise,
                       enterpriseData,
                       treeData,
                       vmvResponses,
                       timelineData,
                       objectives,
                       selectedObjectives,
                       dimension,
                       dimensions,
                       metric,
                       metrics,
                       dimensionsGraph,
                       metricsGraph,
                       curationPriorities,
                       curationPriorityPages,
                       year,
                       quarters,
                       spouse1,
                       spouse2,
                       personalStoryDataSpouse1,
                       personalStoryDataSpouse2,
                       educationDataSpouse1,
                       educationDataSpouse2,
                       curationSummary,
                       actionPlan,
                       why,
                       whyReportPages,
                       gantt,
                       priorityRanking,
                       priorityGrid,
                       legacyOfFive,
                       actionPlanEndDate,
                       actionPlanStartDate,
                       coverPage,
                       toc,
                        introduction,
                        atAGlanceCover,
                        atAGlance,
                        discoverCover,
                        discoverIntro,
                        vmv,
                        storyofus,
                        person1,
                        person2,
                        familyStory,
                        enterpriseReport,
                        timeline,
                        familyTree,
                        dreamCover,
                        dreamIntro,
                        directionCover,
                        directionIntro,
                        finalCover,
                        finalIntro
                   }: GuideBookProps): ReactElement => {


    const actionPlanStart = actionPlanStartDate ?  new Date(actionPlanStartDate) : undefined
    const actionPlanEnd   = actionPlanEndDate ?  new Date(actionPlanEndDate) : undefined
    const actionPlanReportData = actionPlan ? generateQuarters(actionPlanStart!, actionPlanEnd!) : undefined

    const pdfExportComponent = React.useRef<PDFExport>(null); 

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            console.log("EXPORT");
          pdfExportComponent.current.save();
        }
      };

    const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "GuideBook",
    scale: 1,
    subject: "GuideBook",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    margin: 0 
    } 

    const PageTemplate = (props: PageTemplateProps) => {
        return (
            <>
            {props.pageNum != 1 ?
            <div style={{marginLeft: "54px", marginBottom: "20px"}}>
            <table className="pdf-footer-table">
                <tr>
                    <td className="pdf-footer-table-td" rowSpan={2}><img src={logoBase64WithouText} className="pdf-footer-logo" /></td>
                    <td className="pdf-footer-table-td">
                        <div className="pdf-footer-createdby">
                            Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
            : null }
            </>
        );
    }

    return (
        <>
            <p>
                <div>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={exportPDFWithComponent}
                    >Export Report</Button>
                </div>
            </p>
            <br />
            <p>
            <PDFExport ref={pdfExportComponent}
            paperSize={options.paperSize} creator="Clariata LLC" margin={options.margin? options.margin : 20} fileName={options.fileName} scale={options.scale} keepTogether={options.keepTogether}
            forcePageBreak=".newPage" landscape={options.landscape} >
                {/* ---------------------- Main Cover Page -------------------------- */}
                {coverPage ?
                    <>
                    { owner ? 
                        <>
                        <GuideBookCover familyName={household?.HouseholdName} ownerName={owner?.FirstName + " " + owner.LastName} firmName={owner?.FirmName}/>
                        <div className="newPage"/> 
                        </> : 
                        <>
                        <GuideBookCover familyName={household?.HouseholdName}/>
                        <div className="newPage"/>
                        </>
                    }
                    </> :null
                }
                {/* ---------------------- End Main Conver Page ---------------------- */}
                
                {/* ---------------------- Table of Contents ------------------------- */}
                {toc ? 
                    <>
                    <GuideBookContent/>               
                    <div className="newPage"/>
                    </> : null
                }
                {/* ---------------------- End Table of Content ---------------------- */}
                
                {/* ---------------------- How to Use Guidebook ---------------------- */}
                {introduction ?
                    <>
                    <GuideBookIntro ownerName={owner?.FirstName + " " + owner?.LastName}/>                
                    <div className="newPage"/>
                    </> : null
                }
                {/* ---------------------- End of How to Use Guidebook --------------- */}

                {/* ---------------------- At A Glance Separator --------------------- */}
                {atAGlanceCover ?
                    <>
                    <ChapterSeparator type={ChapterType.AT_A_GLANCE}/>               
                    <div className="newPage"/>
                    </> : null
                }
                {/* ---------------------- End of At A Glance Separtor --------------- */}

                {/* ---------------------- At  A Glance ------------------------------ */}
                {atAGlance ? 
                    <>
                    <ExecutiveIntro ownerName={owner?.FirstName + " " + owner?.LastName} familySurname={household?.HouseholdName}
                                    selectedObjectives={selectedObjectives}/> 
                    <div className="newPage"/>
                    </> : null
                }
                {/* ---------------------- End of At a Glance ------------------------ */}

                {/* ---------------------- DISCOVER------------------------ */}

                {/* ---------------------- Discover Separator ------------------------ */}
                {discoverCover ?
                    <>
                        <ChapterSeparator type={ChapterType.DISCOVER}/>
                        <div className="newPage"/>
                    </> : null 
                }
                {/* ---------------------- End of Discover Separator ----------------- */}

                {/* ---------------------- Discover intro ---------------------------- */}
                {discoverIntro ? 
                    <>
                        <DiscoverIntro ownerName={owner?.FirstName + " " + owner?.LastName}/>
                        <div className="newPage"/>
                    </> : null
                }
                {/* End of Discover Intro */}

                {/* Vision, Mission, Core Value Report */}
                {vmv && vmvResponses ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page">
                                    <VMVComponent household={household} persons={persons} vision={vmvResponses.vision}
                                        mission1={vmvResponses.mission1} mission2={vmvResponses.mission2}
                                        coreValues={vmvResponses.coreValues}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                        

                    </> : null
                }
                {/* End of Vision, Mission, Core Value Report */}

                {/* Story of Us Report */}
                {console.log("StoryOfUs")}
                {console.log(storyOfUsData)}
                {storyofus && storyOfUsData ?
                    <>
                        
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="content-page">
                                        <StoryOfUs storyOfUsData={storyOfUsData} household={household} persons={persons}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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

                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Story of Us Report */}

                {/* Personal Story Reports */}
                {person1 && spouse1 && personalStoryDataSpouse1 ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <PersonalStory personalData={personalStoryDataSpouse1} educationData={educationDataSpouse1} person={spouse1} pageNumber={1}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <PersonalStory personalData={personalStoryDataSpouse1} person={spouse1} pageNumber={2}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>

                    </> : null
                }

                {person2 && spouse2 && personalStoryDataSpouse2 ?
                    <>
                    <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <PersonalStory personalData={personalStoryDataSpouse2} educationData={educationDataSpouse2} person={spouse2} pageNumber={1}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <PersonalStory personalData={personalStoryDataSpouse2} person={spouse2} pageNumber={2}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                    </> : null
                }
                {/* End of Personal Story Reports */}

                {/* Family Story Report */}
                {familyStory && familyStoryData ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <FamilyStory household={household} persons={persons} data={familyStoryData} pageNumber={1}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <FamilyStory household={household} persons={persons} data={familyStoryData} pageNumber={2}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Family Story Report */}

                {/* Enterprise Summary */}
                {enterprise && enterpriseData ?
                    <>
                    <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <Enterprise enterpriseData={enterprise} data={enterpriseData} household={household}
                                          persons={persons}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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

                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Enterprise Summary */}

                {/* Ancestral Timeline */}
                {timeline && timelineData ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <TimelineReport timelineItems={timelineData} household={household} persons={persons}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Ancestral Timeline */}

                {/* Legacy Of five Family Tree */}
                {familyTree && treeData ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page-tree">
                                        <FamilyTree treeData={treeData} household={household} persons={persons}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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

                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Legacy Of five Family Tree */}

                {/* Legacy Of five Profile */}
                {legacyOfFive ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="content-page">
                                        <LegacyOfFiveFamily household={household} family={family} persons={persons}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>
                    </>
                    : null}
                {/* End of Legacy of Five Profile
                

                {/* ----------------------------DREAM--------------------------------- */}

                {/* Dream Cover */}
                {dreamCover ?
                    <>
                    <ChapterSeparator type={ChapterType.DREAM}/>
                    <div className="newPage"/>
                    </> : null
                }
                {/* End of Dream Cover */}                

                {/* Dream Content intro */}
                {dreamIntro ? 
                    <> 
                    <DreamIntro ownerName={owner?.FirstName}/>
                    <div className="newPage"/>
                    </> : null
                }
                {/* End of Dream Content intro */}

                {/* Priority Grid */}
                {priorityGrid && objectives ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page">
                                        <PriorityGrid household={household} persons={persons} objectives={objectives}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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

                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Priority Grid */}

                {/* The Why Report */}
                {why && selectedObjectives && dimensions && metrics ?
                    <>
                        {whyReportPages?.map((page: WhyReportPage, counter) => {
                        return (
                            <WhyComponent household={household} persons={persons} objectives={selectedObjectives}
                                metrics={metrics} dimensions={dimensions} page={counter}/>
                        )})}

                    </> : null
                }
                {/* End of The Why Report */}

                {/* Dimension of Success */}
                {dimension ?
                    <>        
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page">
                                        <LifeGraph household={household} persons={persons} isMetric={false}
                                         chartData={dimensionsGraph?.chartData} chartImages={dimensionsGraph?.chartImages} />
                                    </div>
                                    <br/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Dimension of Success */}

                {/* Metrics of Success */}
                {metric ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page">
                                        <LifeGraph household={household} persons={persons} isMetric={true}
                                         chartData={metricsGraph?.chartData} chartImages={metricsGraph?.chartImages}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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
                        
                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Metrics of Success */}

                {/* ----------------------------DIRECTION--------------------------------- */}

                {/* Direction separator */}
                {directionCover ? 
                    <>
                    <ChapterSeparator type={ChapterType.DIRECTION}/>
                    <div className="newPage"/>                    
                    </>
                    : null
                   }
                {/* End of Direction Separator */}

                {/* Direction Intro */}
                {directionIntro ? 
                    <>
                    <DirectionIntro ownerName={owner?.FirstName + " " + owner?.LastName}/>
                    <div className="newPage"/>
                    </>
                    : null 
                }
                {/* End of Direction Intro */}                

                {/* Priority Ranking Report */}
                {priorityRanking && objectives ?
                    <>
                        <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    <div className="report-page">
                                        <PriorityRanking household={household} persons={persons} objectives={objectives}/>
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
                                                        Guidebook | Prepared By {owner?.FirstName} {owner?.LastName}
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

                        <div className="newPage"/>

                    </> : null
                }
                {/* End of Priority Ranking Report */}
                {/* Curation Summary Report */}
                {curationSummary ?                        
                    curationPriorityPages?.map((priorityPage, i) => {
                        <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} includePageBreak={((i+1) < curationPriorityPages.length)} isWide={true} >
                            <CurationSummary key={"Priority" + i} household={household} persons={persons} curationPriorities={priorityPage.objectives}/>
                        </ReportWrapper>
                    })
                     : null
                }
                {/* End of Curation Summary Report */}

                {/* Action Plan Summary */}
                {actionPlan && quarters ?
                    <>
                        {quarters?.map(q => {
                            return (
                                <>
                                    <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} isWide={true} >
                                        <ActionPlanSummaryQuarter household={household} persons={persons} objectives={curationPriorities} year={q.year} quarter={q.quarter} dimensions={dimensions} metrics={metrics} />
                                    </ReportWrapper>
                                    <div className="newPage" />
                                </>
                            )
                        })
                    }
                    </> : null 
                }
                {/* End of Action Plan Summary */}

                {/* Gantt Chart Report */}
                {/* {gantt && year ?
                    <>
                    <table className="table-page">
                            <tr>
                                <td style={{verticalAlign: "top", paddingTop: "25px"}}>
                                    <div className="report-page">
                                        <GanttChart household={household} persons={persons} objectives={selectedObjectives}
                                          year={year}/>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <div className="newPage"/>

                    </> : null
                } */}
                {/* End of Gantt Chart Report */}

                {/* ----------------------------FINAL--------------------------------- */}

                {/* Final Thoughts Cover */}
                {finalCover ?
                    <>
                    <ChapterSeparator type={ChapterType.FINAL}/>
                    <div className="newPage"/>
                    </> : null 
                }
                {/* End of Final Thoughts Cover */}

                {/* Finak Thoughts */}
                {finalIntro ?
                    <>
                    <FinalIntro ownerName={owner?.FirstName + " " + owner?.LastName} firmName={owner?.FirmName}/>
                    </> : null
                }
                {/* End of Final Thoughts */}

            </PDFExport>
            </p>
        </>
    )
}


export default GuideBook;

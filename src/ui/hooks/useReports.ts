import useNotifications from "~/ui/hooks/useNotifications";
import {useRouter} from "next/router";
import {useStoreState} from "~/store/hooks";
import {ReportDefinition, ReportType, ReportTypes} from "~/ui/constants/reports";
import paths from "~/ui/constants/paths";
import React from "react";
import {buildUrlWithParams, getBase64FromUrl, StringKeyedObject} from "~/ui/constants/utils";
import {getFactorMatrixReportData} from "~/ui/components/Reports/FactorMatrixReport/FactorMatrixReport";
import api from "~/services/api";
import {getHouseholdFamily} from "~/services/reports/persons";
import {getFilteredInterviewQuestionsReportData, getInterviewQuestionsReportData} from "~/ui/components/Reports/InterviewQuestionsReport/InterviewQuestionsReport";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { getStoryOfUsReportData } from "../components/Reports/StoryOfUsReport/StoryOfUs";
import { User } from "~/types/api/user";
import { getLifeGraphData } from "../components/Reports/LifeGraphReport/LifeGraphReport";
import { getCurationSummaryData } from "../components/Reports/CurationSummaryReport/CurationSummaryReport";
import { getFamilyTreeReportData } from "../components/Reports/FamilyTreeReport/FamilyTreeReport";
import { getActionPlanSummaryReportProps } from "../components/Reports/ActionPlanSummaryQuarterReport/ActionPlanSummaryQuarterReport";
import { getWhyReportData } from "../components/Reports/WhyReport/WhyReport";
import { getPriorityGridReportProps } from "../components/Reports/PriorityGridReport/PriorityGridReport";
import { getPriorityRankingReportProps } from "../components/Reports/PriorityRankingReport/PriorityRankingReport";
import { getPriorityRankingWorksheetProps } from "../components/Reports/PriorityRankingWorksheet/PriorityRankingWorksheet";
import { getTimelineReportData, TimelineFilters } from "../components/Reports/TimelineReport/TimelineReport";
import { getGanttChartReportProps } from "../components/Reports/GanttChartReport/GanttChartReport";
import { getVMVReportData } from "../components/Reports/VMVReport/VMVReport";
import { getFamilyStoryReportData } from "../components/Reports/FamilyStoryReport/FamilyStoryReport";
import { getEnterpriseReportData } from "../components/Reports/EnterpriseReport/EnterpriseReport";
import { getGuidebookData } from "../components/GuideBook/GuideBook";
import { getPersonalStoryReportData } from "../components/Reports/PersonalStoryReport/PersonalStoryReport";
import {getDreamLifePrintData, SelectedPriorities} from "../components/Reports/DreamLifePrint/DreamLifePrint";
import {
  DirectionLifeprintData,
  getDirectionLifePrintData
} from "../components/Reports/DirectionLifePrint/DirectionLifePrint";
import { getDiscoverLifePrintData } from "../components/Reports/DiscoverLifePrint/DiscoverLifePrint";
import {ReportPdf} from "~/types/api/reportpdf";
import { getCurationInterviewData } from "../components/Reports/CurationInterviewWorksheet/CurationInterviewWorksheet";
import moment from "moment";
import { getStoryOfUsData } from "../components/Reports/StoryOfUsReport/StoryOfUsReport";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { ComplexityOfNeed } from "~/types/api/complexityOfNeed";
import { LegacyInterest } from "~/types/api/legacyInterest";
import usePersons from "./usePersons";
import useHousehold from "./useHousehold";
import { CustomFilter } from "../components/Timeline/TimelineReport";

const { 
        REPORTS_DREAM_INTERVIEW_QUESTIONS,
        REPORTS_DISCOVER_INTERVIEW_QUESTIONS,
        REPORTS_DISCOVER_MAIN_QUESTIONS,
        REPORTS_INTERVIEW,
        REPORTS_MATRIX,
        REPORTS_PROFILE,
        REPORTS, 
        REPORTS_EVALUATION, 
        REPORTS_STORY_OF_US, 
        REPORTS_LIFE_GRAPH, 
        REPORTS_CURATION_WORKSHEET, 
        REPORTS_CURATION_SUMMARY,
        REPORTS_CURATION_INTERVIEW_WORKSHEET,
        REPORTS_FAMILY_TREE,
        REPORTS_ACTION_PLAN_SUMMARY_QUARTER,
        REPORTS_WHY,
        REPORTS_FAMILY_PROFILE_WORKSHEET,
        REPORTS_LEGACY_OF_FIVE,
        REPORTS_PRIORITY_GRID,
        REPORTS_PRIORITY_RANKING,
        REPORTS_PRIORITY_RANKING_WORKSHEET,
        REPORTS_ANCESTRAL_TIMELINE,
        REPORTS_GANTT_CHART,
        REPORTS_VMV,
        REPORTS_VMV_WORKSHEET,
        REPORTS_FAMILY_STORY,
        REPORTS_OUR_ENTERPRISE,
        REPORTS_PERSONAL_STORY,
        REPORTS_PERSONAL_STORY_2,
        REPORTS_DREAM_LIFEPRINT,
        REPORTS_DISCOVER_LIFEPRINT,
        REPORTS_DIRECTION_LIFEPRINT,
        GUIDEBOOK,
        REPORTS_ACTION_STEP_WORKSHEET,
        REPORTS_ACTION_STEP_REPORT
      } = paths;

const useReports = () => {
  const notifications = useNotifications();
  const router = useRouter();

  const [sessionToken, setSessionToken] = React.useState<string>();
  const [reportType, setReportType] = React.useState<ReportType>();
  const [reportDefinition, setReportDefinition] = React.useState<ReportDefinition>();
  const [reportPath, setReportPath] = React.useState<string>('');
  const [reportParams, setReportParams] = React.useState<any>();
  const [reportProps, setReportProps] = React.useState<any>();
  const [showReport, setShowReport] = React.useState(false);
  const [showReportList, setShowReportList] = React.useState(true);

  const { users } = useStoreState((state) => state.user);
  const { evaluations, selectedEvaluation } = useStoreState((state) => state.evaluation);
  const { dreamInterviewId, discoverInterviewId, householdId, primary1Id, primary2Id } = useStoreState((state) => state.selected);
  const persons = usePersons();
  const household = useHousehold();
  //const {complexityOfNeeds, legacyInterest} = useStoreState(state => state.constants)
  const { data: complexityOfNeeds } = useSWR<ComplexityOfNeed[]>([`${process.env.NEXT_PUBLIC_API_URL}/complexityofneeds/list`, getAccessToken()], fetcher);
  const { data: legacyInterest } = useSWR<LegacyInterest[]>([`${process.env.NEXT_PUBLIC_API_URL}/legacyinterest/list`, getAccessToken()], fetcher);

  const populateToken = async () => {
    const sessionGUID = getSessionGUID()
    const res = await api.session.get(sessionGUID);
    // @ts-ignore
    setSessionToken(String(res?.data?.SessionGUID));
  }

  useMountEvents({
    onMounted: async () => {
      populateToken();
    }
  });

  const onReportTypeChange = async (type: ReportType, 
                                    extraOptions?: StringKeyedObject,
                                    year?: number,
                                    quarter?: number,
                                    startMonth?:number,
                                    endMonth?:number) => {
    const path = getReportRoutePath(type);
    const params = await getReportQueryParams(type,undefined, quarter, year, undefined, extraOptions, startMonth, endMonth);
    const props =  await getReportProps(type, extraOptions, quarter, year, startMonth, endMonth);
    setReportType(type);
    setReportDefinition(ReportTypes[type]);
    setReportPath(path);
    setReportParams(params);
    setReportProps(props);
  }

  const viewReport = async (type: ReportType,
                            extraOptions?: StringKeyedObject,
                            year?: number,
                            quarter?: number,
                            startMonth?:number,
                            endMonth?:number) => {
    notifications.toggleLoading(true);
    await onReportTypeChange(type, extraOptions, year, quarter, startMonth, endMonth);
    setShowReport(true);
    setShowReportList(false);
    notifications.toggleLoading(false);
  }

  const hideReport = () => {
    setShowReport(false);
    setShowReportList(true);
  }

  const hideReportList = () => {
    setShowReportList(false);
  }

  const downloadPdfReport = async (type: ReportType, evaluationId?: number, year?: number, quarter?: number, extraOptions?: StringKeyedObject, saveToAWS: boolean = false, householdID?: number, reportName?: string) => {
    notifications.toggleLoading(true);
    await onReportTypeChange(type, extraOptions);

    const params = await getReportQueryParams(type,evaluationId,year,quarter,undefined,extraOptions);
    const url = buildUrlWithParams(getReportRoutePath(type), { ...params, pdf: true });

    if(saveToAWS){
      const base64string = await getBase64FromUrl(url)
      if(base64string) {
        const pdfData: ReportPdf = {
          HouseholdID: householdID,
          ReportName: reportName ?? "Unnamed Report",
          Base64String: base64string as string
        }

        await api.reportpdf.create(householdID!, pdfData)
      }
    }
    notifications.toggleLoading(false);
    window.open(url);
  }

  const downloadPdfGuideBook = async (legacyOfFive: boolean, 
                                      person1: boolean, 
                                      person2: boolean, 
                                      storyOfUs: boolean, 
                                      familyStory: boolean, 
                                      enterprise: boolean, 
                                      timeline: boolean, 
                                      tree: boolean, 
                                      vmv: boolean, 
                                      priorityGrid: boolean, 
                                      why: boolean, 
                                      dimension: boolean, 
                                      metric: boolean, 
                                      priorityRanking: boolean, 
                                      curationSummary: boolean, 
                                      actionPlan: boolean,
                                      gantt: boolean,
                                      quarter?: number,
                                      year?: number,
                                      actionPlanStartDate?: string,
                                      actionPlanEndDate?: string) => {

    notifications.toggleLoading(true);
    // await onReportTypeChange(ReportType.GUIDEBOOK);
    
    const params = await getGuideBookQueryParams(legacyOfFive,person1,person2,storyOfUs,familyStory,enterprise,timeline,tree,vmv,priorityGrid,why,dimension,metric,priorityRanking,curationSummary,actionPlan,gantt,quarter,year,actionPlanStartDate,actionPlanEndDate);
    
    
    setReportParams(params);

    const url = buildUrlWithParams(getReportRoutePath(ReportType.GUIDEBOOK), { ...params, pdf: true });
    notifications.toggleLoading(false);
    // For when reports are called not from the reports manager screen
    // if(router.pathname != REPORTS){
    //   window.open(REPORTS_INTERVIEW + url);
    // }
    // else {
      window.open(url);
    // }
    
  }

  const downloadCustomInterviewReport = async (interviewId: number, showResponses: boolean, hideClarifying: boolean, excludedDimensions: number[], excludedMetrics: number[], excludedQuestions: number[], excludedResponses: number[], answeredOnly?: boolean, unansweredOnly?: boolean, starredOnly?: boolean, hiddenOnly?: boolean, selectedSections?: number[]) => {

    notifications.toggleLoading(true);
    // await onReportTypeChange(ReportType.ANCESTRAL_TIMELINE);

    const params = await getCustomInterviewReportParams(interviewId, showResponses, hideClarifying, excludedDimensions, excludedMetrics, excludedQuestions, excludedResponses);
    // const params = await getFilteredInterviewReportParams(interviewId, showResponses, hideClarifying, answeredOnly, unansweredOnly, starredOnly, hiddenOnly, selectedSections);
    const props = await getInterviewQuestionsReportData(Number(householdId),
                                              Number(params?.interviewId),
                                              Boolean(params?.showResponses), 
                                              Boolean(params?.hideClarifying),
                                              undefined,
                                              excludedDimensions,
                                              excludedMetrics,
                                              excludedQuestions,
                                              excludedMetrics
                                              );

    setReportParams(params);
    setReportProps(props);

    const url = buildUrlWithParams(getReportRoutePath(ReportType.DREAM_INTERVIEW), { ...params, pdf: true });
    notifications.toggleLoading(false);

    return {
      params,
      props,
      url
    }

  }

  const downloadFilteredInterviewReport = async (interviewId: number, showResponses: boolean, hideClarifying: boolean, answeredOnly?: boolean, unansweredOnly?: boolean, starredOnly?: boolean, hiddenOnly?: boolean, selectedSections?: number[], storyReportType?: ReportType) => {

    notifications.toggleLoading(true);
    // await onReportTypeChange(ReportType.ANCESTRAL_TIMELINE);

    const params = await getFilteredInterviewReportParams(interviewId, showResponses, hideClarifying, answeredOnly, unansweredOnly, starredOnly, hiddenOnly, selectedSections, storyReportType);
    // const params = await getFilteredInterviewReportParams(interviewId, showResponses, hideClarifying, answeredOnly, unansweredOnly, starredOnly, hiddenOnly, selectedSections);
    const props = await getFilteredInterviewQuestionsReportData(Number(householdId),
                                              Number(params?.interviewId),
                                              Boolean(params?.showResponses), 
                                              Boolean(params?.hideClarifying),
                                              undefined,
                                              answeredOnly,
                                              unansweredOnly,
                                              starredOnly,
                                              hiddenOnly,
                                              selectedSections,
                                              storyReportType
                                              );

    setReportParams(params);
    setReportProps(props);

    const url = buildUrlWithParams(getReportRoutePath(ReportType.DREAM_INTERVIEW), { ...params, pdf: true });
    notifications.toggleLoading(false);

    return {
      params,
      props,
      url
    }

  }

  const getFilteredInterviewReportParams = async ( interviewId: number,
                                              showResponses: boolean, 
                                              hideClarifying: boolean, 
                                              answeredOnly?: boolean,
                                              unansweredOnly?: boolean,
                                              starredOnly?: boolean,
                                              hiddenOnly?: boolean,
                                              selectedSections?: number[],
                                              storyReportType?: ReportType) => {
    const res = await api.user.getHouseholdUser(String(household?.household?.CreatedBy), householdId);
    const owner = res.data as User;
    // const sections = selectedSections ? new URLSearchParams(selectedSections.map(s=>['id',s?.toString()]))?.toString() : "";
    const sections = selectedSections ? JSON.stringify(selectedSections) : "";
    
    return {
      householdId: householdId,
      interviewId,
      showResponses,
      hideClarifying,
      selectedSections: sections,
      answeredOnly: answeredOnly ? answeredOnly : false,
      unansweredOnly: unansweredOnly ? unansweredOnly : false,
      starredOnly: starredOnly ? starredOnly : false,
      hiddenOnly: hiddenOnly ? hiddenOnly : false,
      storyReportType: storyReportType ? storyReportType : "",
      token: sessionToken,
      reportTitle: owner && owner.FirstName ? "Interview Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Interview Report",
      ownerId: owner.UserID,
    }
  }

  const getCustomInterviewReportParams = async ( interviewId: number,
                                                showResponses: boolean, 
                                                hideClarifying: boolean, 
                                                excludedDimensions: number[],
                                                excludedMetrics: number[],
                                                excludedQuestions: number[],
                                                excludedResponses: number[]) => {
    const res = await api.user.getHouseholdUser(String(household?.household?.CreatedBy), householdId);
    const owner = res.data as User;
    const dimensions = new URLSearchParams(excludedDimensions.map(s=>['id',s?.toString()]))?.toString();
    const metrics = new URLSearchParams(excludedMetrics.map(s=>['id',s?.toString()]))?.toString();
    const questions = new URLSearchParams(excludedQuestions.map(s=>['id',s?.toString()]))?.toString();
    const responses = new URLSearchParams(excludedResponses.map(s=>['id',s?.toString()]))?.toString();
    return {
      householdId: householdId,
      interviewId,
      showResponses,
      hideClarifying,
      excludedDimensions: dimensions,
      excludedMetrics: metrics,
      excludedQuestions: questions,
      excludedResponses: responses,
      token: sessionToken,
      reportTitle: owner && owner.FirstName ? "Interview Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Interview Report",
      ownerId: owner.UserID,
    }
  }

  const downloadCustomTimelineReport = async ( excludePrimary: boolean, 
                                      excludeGrandparents: boolean, 
                                      excludeParents: boolean, 
                                      excludeChildren: boolean, 
                                      excludeGrandchildren: boolean, 
                                      excludeBirth: boolean, 
                                      excludeDeath: boolean, 
                                      excludeMarriage: boolean, 
                                      excludeGraduation: boolean, 
                                      excludeCustom: boolean,
                                      startYear: Date,
                                      endYear: Date
                                      ) => {

    notifications.toggleLoading(true);
    // await onReportTypeChange(ReportType.ANCESTRAL_TIMELINE);

    const params = await getCustomTimelineQueryParams(excludePrimary,excludeGrandparents,excludeParents,excludeChildren,excludeGrandchildren,excludeBirth,excludeDeath,excludeMarriage,excludeGraduation,excludeCustom, startYear, endYear);
    const props = await getTimelineReportData(Number(params.householdId),
            (params?.excludePrimary ? Boolean(params?.excludePrimary) : false), 
            (params?.excludeGrandparents ? Boolean(params?.excludeGrandparents) : false), 
            (params?.excludeParents ? Boolean(params?.excludeParents) : false), 
            (params?.excludeChildren ? Boolean(params?.excludeChildren) : false), 
            (params?.excludeGrandchildren ? Boolean(params?.excludeGrandchildren) : false), 
            (params?.excludeBirth ? Boolean(params?.excludeBirth) : false), 
            (params?.excludeDeath ? Boolean(params?.excludeDeath) : false), 
            (params?.excludeMarriage ? Boolean(params?.excludeMarriage) : false), 
            (params?.excludeGraduation ? Boolean(params?.excludeGraduation) : false), 
            (params?.excludeCustom ? Boolean(params?.excludeCustom) : false),            
            (params.startYear as Date),
            (params.endYear)
    );

    console.log(startYear);
    console.log(endYear);
    setReportParams(params);
    setReportProps(props);

    const url = buildUrlWithParams(getReportRoutePath(ReportType.ANCESTRAL_TIMELINE), { ...params, pdf: true });
    notifications.toggleLoading(false);

    return {
      params,
      props,
      url
    }

  }

  const getCustomTimelineQueryParams = async (excludePrimary: boolean, 
                                              excludeGrandparents: boolean, 
                                              excludeParents: boolean, 
                                              excludeChildren: boolean, 
                                              excludeGrandchildren: boolean, 
                                              excludeBirth: boolean, 
                                              excludeDeath: boolean, 
                                              excludeMarriage: boolean, 
                                              excludeGraduation: boolean, 
                                              excludeCustom: boolean,
                                              startYear: Date,
                                              endYear: Date,) => {
    const res = await api.user.getHouseholdUser(String(household?.household?.CreatedBy), householdId);
    const owner = res.data as User;
    return {
      householdId: householdId,
      token: sessionToken,
      reportTitle: owner && owner.FirstName ? "Discover: Ancestral Timeline Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Ancestral Timeline Report",
      ownerId: owner.UserID,
      startYear: startYear ? startYear : undefined,
      endYear: endYear,
      excludePrimary: excludePrimary ? excludePrimary: false,
      excludeGrandparents: excludeGrandparents ? excludeGrandparents : false,
      excludeParents: excludeParents ? excludeParents : false,
      excludeChildren: excludeChildren ? excludeChildren : false,
      excludeGrandchildren: excludeGrandchildren ? excludeGrandchildren : false,
      excludeBirth: excludeBirth ? excludeBirth : false,
      excludeDeath: excludeDeath ? excludeDeath : false,
      excludeMarriage: excludeMarriage ? excludeMarriage : false,
      excludeGraduation: excludeGraduation ? excludeGraduation : false,
      excludeCustom: excludeCustom ? excludeCustom : false
    }
  }

  const downloadPdfReportWithSelection = async (type: ReportType) => {
    notifications.toggleLoading(true);
    await onReportTypeChange(type);
    notifications.toggleLoading(false);
    const params = await getReportQueryParams(type);
    const url = buildUrlWithParams(getReportRoutePath(type), { ...params, pdf: true });
    window.open(url);
  }

  const downloadExcelReport = async (type: ReportType) => {
    notifications.toggleLoading(true);
    await onReportTypeChange(type);
    notifications.toggleLoading(false);
    const params = await getReportQueryParams(type);
    const url = buildUrlWithParams(getReportRoutePath(type), { ...params, excel: true });
    // TODO - process
  }

  const getReportRoutePath = (type: ReportType) => {
    if (ReportType.DISCOVER_INTERVIEW === type) {
      return REPORTS_DISCOVER_INTERVIEW_QUESTIONS;
    }
    if (ReportType.DISCOVER_MAIN_QUESTIONS === type) {
      return REPORTS_DISCOVER_MAIN_QUESTIONS;
    }
    if (ReportType.DREAM_INTERVIEW === type) {
      return REPORTS_DREAM_INTERVIEW_QUESTIONS;
    }
    if (ReportType.PROFILE === type) {
      return REPORTS_PROFILE;
    }
    if (ReportType.DISCOVER_RESPONSES === type || ReportType.DISCOVER_VMV_QUESTIONS === type || ReportType.DISCOVER_VMV_QUESTIONS_DETAILS === type) {
      return REPORTS_INTERVIEW;
    }
    if (ReportType.EVALUATION === type) {
      return REPORTS_EVALUATION;
    }
    if (ReportType.STORY_OF_US === type) {
      return REPORTS_STORY_OF_US;
    }
    if (ReportType.LIFE_GRAPH === type || ReportType.LIFE_GRAPH_METRIC === type) {
      return REPORTS_LIFE_GRAPH;
    }
    if (ReportType.CURATION_WORKSHEET === type) {
      return REPORTS_CURATION_WORKSHEET;
    }
    if (ReportType.CURATION_SUMMARY === type) {
      return REPORTS_CURATION_SUMMARY;
    }
    if (ReportType.CURATION_INTERVIEW_WORKSHEET === type) {
      return REPORTS_CURATION_INTERVIEW_WORKSHEET;
    }
    if (ReportType.FAMILY_TREE === type) {
      return REPORTS_FAMILY_TREE;
    }
    if (ReportType.ACTION_PLAN_SUMMARY_QUARTER === type) {
      return REPORTS_ACTION_PLAN_SUMMARY_QUARTER;
    }
    if (ReportType.WHY === type) {
      return REPORTS_WHY;
    }
    if (ReportType.FAMILY_PROFILE_WORKSHEET === type) {
      return REPORTS_FAMILY_PROFILE_WORKSHEET;
    }
    if (ReportType.LEGACY_OF_FIVE === type) {
      return REPORTS_LEGACY_OF_FIVE;
    }
    if (ReportType.PRIORITY_GRID === type) {
      return REPORTS_PRIORITY_GRID;
    }
    if (ReportType.PRIORITY_RANKING === type) {
      return REPORTS_PRIORITY_RANKING;
    }
    if (ReportType.PRIORITY_RANKING_WORKSHEET === type) {
      return REPORTS_PRIORITY_RANKING_WORKSHEET;
    }
    if (ReportType.ANCESTRAL_TIMELINE === type) {
      return REPORTS_ANCESTRAL_TIMELINE;
    }
    if (ReportType.GANTT_CHART === type) {
      return REPORTS_GANTT_CHART;
    }
    if (ReportType.VMV === type) {
      return REPORTS_VMV;
    }
    if (ReportType.VMV_WORKSHEET === type) {
      return REPORTS_VMV_WORKSHEET;
    }
    if (ReportType.FAMILY_STORY === type) {
      return REPORTS_FAMILY_STORY;
    }
    if (ReportType.OUR_ENTERPRISE === type) {
      return REPORTS_OUR_ENTERPRISE;
    }
    if (ReportType.GUIDEBOOK === type) {
      return GUIDEBOOK;
    }
    if (ReportType.PERSONAL_STORY === type) {
      return REPORTS_PERSONAL_STORY;
    }
    if (ReportType.PERSONAL_STORY_2 === type) {
      return REPORTS_PERSONAL_STORY_2;
    }
    if (ReportType.DREAM_LIFEPRINT === type) {
      return REPORTS_DREAM_LIFEPRINT;
    }
    if (ReportType.DISCOVER_LIFEPRINT === type) {
      return REPORTS_DISCOVER_LIFEPRINT;
    }
    if (ReportType.DIRECTION_LIFEPRINT === type) {
      return REPORTS_DIRECTION_LIFEPRINT;
    }
    if(ReportType.ACTION_STEP_WORKSHEET === type){
      return REPORTS_ACTION_STEP_WORKSHEET
    }
    if(ReportType.ACTION_STEP_REPORT === type){
      return REPORTS_ACTION_STEP_REPORT
    }
    return '';
  }

  const getGuideBookQueryParams = async (legacyOfFive: boolean, 
                                          person1: boolean, 
                                          person2: boolean, 
                                          storyOfUs: boolean, 
                                          familyStory: boolean, 
                                          enterprise: boolean, 
                                          timeline: boolean, 
                                          tree: boolean, 
                                          vmv: boolean, 
                                          priorityGrid: boolean, 
                                          why: boolean, 
                                          dimension: boolean, 
                                          metric: boolean, 
                                          priorityRanking: boolean, 
                                          curationSummary: boolean, 
                                          actionPlan: boolean, 
                                          gantt: boolean,
                                          quarter?: number,
                                          year?: number,
                                          actionPlanStartDate?: string,
                                          actionPlanEndDate?: string) => {
    const res = await api.user.getHouseholdUser(String(household?.household?.CreatedBy), householdId);
    const owner = res.data as User;
      return {
        householdId: householdId,
        discoverInterviewId,
        dreamInterviewId,
        legacyOfFive: legacyOfFive ?? 0,
        person1: person1 ?? 0,
        person2: person2 ?? 0,
        storyOfUs: storyOfUs ?? 0,
        familyStory: familyStory ?? 0, 
        enterprise: enterprise ?? 0, 
        timeline: timeline ?? 0, 
        tree: tree ?? 0, 
        vmv: vmv ?? 0, 
        priorityGrid: priorityGrid ?? 0, 
        why: why ?? 0, 
        dimension: dimension ?? 0, 
        metric: metric ?? 0, 
        priorityRanking: priorityRanking ?? 0,  
        curationSummary: curationSummary ?? 0,
        actionPlan: actionPlan ?? 0,
        gantt: gantt ?? 0,
        quarter: quarter ? quarter : 1,
        year: year ? year : 2022,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Guidebook | Prepared by " + owner.FirstName + " " + owner.LastName : "Guidebook",
        guidebook: true,
        ownerId: owner.UserID,
        actionPlanStartDate,
        actionPlanEndDate
      }
  }

  const getReportQueryParams = async (type: ReportType, 
                                      evaluationId?: number,
                                      quarter?: number,
                                      year?: number,
                                      personID?: number,
                                      extraOptions?: StringKeyedObject,
                                      startMonth?:number,
                                      endMonth?:number
                                      ) => {
    const res = await api.user.getHouseholdUser(String(household?.household?.CreatedBy), householdId);
    const owner = res?.data as User;
    if (ReportType.PROFILE === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Client Profile Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Client Profile Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.EVALUATION === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        evaluationId: evaluationId ? evaluationId : selectedEvaluation?.ClientEvaluationID ? selectedEvaluation.ClientEvaluationID : undefined,
        token: sessionToken,
        reportTitle: "Client Evaulation Report"
      }
    }
    if (ReportType.DREAM_INTERVIEW === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        showResponses: true,
        token: sessionToken,
        reportTitle: "Dream Interview Report"
      }
    }
    if (ReportType.DISCOVER_INTERVIEW === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        showResponses: false,
        token: sessionToken,
        reportTitle: "Discover Interview Report"
      }
    }
    if (ReportType.DISCOVER_MAIN_QUESTIONS === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        hideClarifying: true,
        token: sessionToken,
        reportTitle: "Discover Interview Main Questions Worksheet"
      }
    }
    if (ReportType.DISCOVER_VMV_QUESTIONS === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        vmv: true,
        token: sessionToken,
        reportTitle: "Discover VMV Questions Worksheet"
      }
    }
    if (ReportType.DISCOVER_VMV_QUESTIONS_DETAILS === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        showResponses: true,
        vmv: true,
        token: sessionToken,
        reportTitle: "Discover VMV Questions With Details Worksheet"
      }
    }
    if (ReportType.DISCOVER_RESPONSES === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        showResponses: true,
        token: sessionToken,
        reportTitle: "Discover Interview Report"
      }
    }
    if (ReportType.STORY_OF_US === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: The Story of Us Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: The Story of Us Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.LIFE_GRAPH === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Dream: Dimensions of Life Lifegraphs | Prepared by " + owner.FirstName + " " + owner.LastName : "Dream: Dimensions of Life Lifegraphs",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.LIFE_GRAPH_METRIC === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Dream: Metrics of Success Lifegraphs | Prepared by " + owner.FirstName + " " + owner.LastName : "Dream: Metrics of Success Lifegraphs",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.CURATION_WORKSHEET === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Curation Overview Worksheet | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Curation Overview Worksheet",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.CURATION_SUMMARY === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Curation Summary Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Curation Summary Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.CURATION_INTERVIEW_WORKSHEET === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Curation Interview Worksheet | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Curation Interview Worksheet",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.FAMILY_TREE === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        token: sessionToken,
        scale: 0.7,
        reportTitle: owner && owner.FirstName ? "Discover: Legacy Of Five Family Tree Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Legacy Of Five Family Tree Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.ACTION_PLAN_SUMMARY_QUARTER === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        startMonth: startMonth,
        endMonth: endMonth,
        quarter: quarter ? quarter : 1,
        year: year ? year : 2022,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Action Plan Summary Report – Q" + quarter ? quarter : 1 + " | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Action Plan Summary Report – Q1",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.WHY === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Dream: The “Why” Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Dream: The “Why” Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.FAMILY_PROFILE_WORKSHEET === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        personID: personID ? personID : 0,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Profile: Family Profile Worksheet  | Prepared by " + owner.FirstName + " " + owner.LastName : "Profile: Family Profile Worksheet ",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.LEGACY_OF_FIVE === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Legacy of Five Family Profile Report  | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Legacy of Five Family Profile Report ",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.PRIORITY_GRID === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Dream: Priority Grid Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Dream: Priority Grid Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.PRIORITY_RANKING === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Priority Ranking Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Priority Ranking Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.PRIORITY_RANKING_WORKSHEET === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Priority Ranking Worksheet | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Priority Ranking Worksheet",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.ANCESTRAL_TIMELINE === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Ancestral Timeline Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Ancestral Timeline Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.GANTT_CHART === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        year: year ? year : 2022,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Direction: Gantt Chart Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Direction: Gantt Chart Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.VMV === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Vision, Mission, Core Values Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Vision, Mission, Core Values Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.VMV_WORKSHEET === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        reportTitle: owner && owner.FirstName ? "Discover: Vision, Mission, Core Values Worksheet | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Vision, Mission, Core Values Worksheet",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.FAMILY_STORY === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Family Story | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Family Story",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.OUR_ENTERPRISE === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Our Enterprise Report | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Our Enterprise Report",
        ownerId: owner?.UserID
      }
    }
    if (ReportType.GUIDEBOOK === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        discoverInterviewId,
        dreamInterviewId,
        quarter: quarter ? quarter : 1,
        year: year ? year : 2022,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Guidebook | Prepared by " + owner.FirstName + " " + owner.LastName : "Guidebook",
        guidebook: true,
        ownerId: owner?.UserID
      }
    }
    if (ReportType.PERSONAL_STORY === type) {
      const person = persons?.persons?.find(p => p?.PersonID === primary1Id);
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        personId: primary1Id,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Personal Story Report " + person?.FirstName + " | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Personal Story Report " + person?.FirstName,
        ownerId: owner?.UserID
      }
    }
    if (ReportType.PERSONAL_STORY_2 === type) {
      const person = persons?.persons?.find(p => p?.PersonID === primary2Id);
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        personId: primary2Id,
        token: sessionToken,
        reportTitle: owner && owner.FirstName ? "Discover: Personal Story Report " + person?.FirstName + " | Prepared by " + owner.FirstName + " " + owner.LastName : "Discover: Personal Story Report " + person?.FirstName,
        ownerId: owner?.UserID
      }
    }
    if (ReportType.DISCOVER_LIFEPRINT === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: discoverInterviewId,
        customFormat: 'a0',
        scale: 1,
        token: sessionToken,
        hideFooter: true,
        ownerId: owner?.UserID
      }
    }
    if (ReportType.DREAM_LIFEPRINT === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        hideFooter: true,
        ownerId: owner?.UserID
      }
    }
    if (ReportType.DIRECTION_LIFEPRINT === type) {
      return {
        ...extraOptions,
        householdId: householdId,
        interviewId: dreamInterviewId,
        token: sessionToken,
        year: year ? year : 2021,
        hideFooter: true,
        ownerId: owner?.UserID
      }
    }

    return undefined;
  }

  const getReportProps = async (type: ReportType,
                                extraOptions?: StringKeyedObject,
                                quarter?: number,
                                year?: number,
                                startMonth?:number,
                                endMonth?:number
                                ) => {
    const params: any = await getReportQueryParams(type, undefined, quarter, year, undefined, extraOptions, startMonth, endMonth);
    //const household = await api.household.getFull(Number(params.householdId));
    if (params) {
      params.isModal = false;
    }
    if (ReportType.PROFILE === type) {
      const profileProps = await getHouseholdFamily(householdId);
      const persons = await api.person.list(householdId);
      return {
        family: profileProps,
        household,
        persons: persons?.data
      }
    }
    if (ReportType.EVALUATION === type) {
      const evaluation = await api.evaluation.get(Number(params.evaluationId));
      return {
        household,
        evaluation: evaluation?.data,
        complexityOfNeeds,
        legacyInterest
      }
    }
    if (ReportType.DREAM_INTERVIEW === type || ReportType.DISCOVER_INTERVIEW === type) {
      const interviewProps = await getInterviewQuestionsReportData(
        Number(householdId),
        Number(params.interviewId),
        Boolean(params.showResponses),
        Boolean(params.hideClarifying),
        Boolean(params.vmv));
      return {
        ...interviewProps,
        household
      }
    }
    if (ReportType.DISCOVER_MAIN_QUESTIONS === type) {
      const interviewProps = await getInterviewQuestionsReportData(
        Number(householdId),
        Number(params.interviewId),
        Boolean(params.showResponses),
        Boolean(params.hideClarifying),
        Boolean(params.vmv));
      return {
        ...interviewProps,
        household
      }
    }
    if (ReportType.DISCOVER_VMV_QUESTIONS === type) {
      const interviewProps = await getInterviewQuestionsReportData(
        Number(householdId),
        Number(params.interviewId),
        Boolean(params.showResponses),
        Boolean(params.hideClarifying),
        Boolean(params.vmv));
      return {
        ...interviewProps,
        household
      }
    }
    if (ReportType.DISCOVER_VMV_QUESTIONS_DETAILS === type) {
      const interviewProps = await getInterviewQuestionsReportData(
        Number(householdId),
        Number(params.interviewId),
        Boolean(params.showResponses),
        Boolean(params.hideClarifying),
        Boolean(params.vmv));
      return {
        ...interviewProps,
        household
      }
    }
    if (ReportType.DISCOVER_RESPONSES === type) {
      const interviewProps = await getInterviewQuestionsReportData(
        Number(householdId),
        Number(params.interviewId),
        Boolean(params.showResponses),
        Boolean(params.hideClarifying),
        Boolean(params.vmv));
      return {
        ...interviewProps,
        household
      }
    }
    if (ReportType.STORY_OF_US === type) {
      const storyOfUsProps = await getStoryOfUsReportData(householdId, discoverInterviewId);
      return {
        ...storyOfUsProps
      }
    }
    if (ReportType.LIFE_GRAPH === type || ReportType.LIFE_GRAPH_METRIC === type) {
      const lifeGraphProps = await getLifeGraphData(householdId, dreamInterviewId, ReportType.LIFE_GRAPH_METRIC === type ? true : false);
      return {
        ...lifeGraphProps
      }
    }
    if (ReportType.CURATION_WORKSHEET === type) {
      const curationProps = await getCurationSummaryData(householdId, dreamInterviewId);
      return {
        ...curationProps
      }
    }
    if (ReportType.CURATION_SUMMARY === type) {
      const curationProps = await getCurationSummaryData(householdId, dreamInterviewId);
      return {
        ...curationProps
      }
    }
    if (ReportType.CURATION_INTERVIEW_WORKSHEET === type) {
      const curationProps = await getCurationInterviewData(householdId, dreamInterviewId);
      return {
        ...curationProps
      }
    }
    if (ReportType.FAMILY_TREE === type) {
      const familyTreeProps = await getFamilyTreeReportData(householdId);
      return {
        ...familyTreeProps
      }
    }
    if (ReportType.ACTION_PLAN_SUMMARY_QUARTER === type) {
      const actionPlanProps = await getActionPlanSummaryReportProps(householdId, dreamInterviewId, params?.quarter ? Number(params?.quarter) : 1, params?.year ? Number(params?.year) : 2022, params?.startMonth, params?.endMonth);
      return {
        ...actionPlanProps
      }
    }
    if (ReportType.WHY === type) {
      const whyProps = await getWhyReportData(householdId, dreamInterviewId);
      return {
        ...whyProps
      }
    }
    if (ReportType.FAMILY_PROFILE_WORKSHEET === type) {
      const person = await api.person.get(params?.personID ? Number(params.personID) : household?.household?.PrimaryPerson1ID ? Number(household.household.PrimaryPerson1ID) : Number(household?.household?.PrimaryPerson2ID), householdId);
      return {
        household,
        person: person?.data
      }
    }
    if (ReportType.LEGACY_OF_FIVE === type) {
      const profileProps = await getHouseholdFamily(householdId, true);
      const persons = await api.person.list(householdId);
      return {
        family: profileProps,
        household,
        persons: persons?.data
      }
    }
    if (ReportType.PRIORITY_GRID === type) {
      const priorityProps = await getPriorityGridReportProps(householdId, dreamInterviewId);
      return {
        ...priorityProps
      }
    }
    if (ReportType.PRIORITY_RANKING === type) {
      const priorityProps = await getPriorityRankingReportProps(householdId, dreamInterviewId);
      return {
        ...priorityProps
      }
    }
    if (ReportType.PRIORITY_RANKING_WORKSHEET === type) {
      const priorityProps = await getPriorityRankingWorksheetProps(householdId, dreamInterviewId);
      return {
        ...priorityProps
      }
    }
    // if (ReportType.ANCESTRAL_TIMELINE === type) {
    //   const timelineProps = await getTimelineReportData(Number(params.householdId),false,false,false,false,false,false,false,false,false,false);
    //   return {
    //     ...timelineProps
    //   }
    // }
    if (ReportType.GANTT_CHART === type) {
      const ganttProps = await getGanttChartReportProps(householdId, dreamInterviewId, params.year ? Number(params.year) : 2022);
      return {
        ...ganttProps
      }
    }
    if (ReportType.VMV === type) {
      const vmvProps = await getVMVReportData(householdId, discoverInterviewId);
       return {
         ...vmvProps
       }
    }
    if (ReportType.VMV_WORKSHEET === type) {
      console.log("GET PROPS");
      const vmvProps = await getVMVReportData(householdId, discoverInterviewId);
      return {
        ...vmvProps
      }
    }
    if (ReportType.FAMILY_STORY === type) {
      const famProps = await getFamilyStoryReportData(householdId, discoverInterviewId);
      return {
        ...famProps
      }
    }
    if (ReportType.OUR_ENTERPRISE === type) {
      const enterpriseProps = await getEnterpriseReportData(householdId, discoverInterviewId);
      return {
        ...enterpriseProps
      }
    }
    // if (ReportType.GUIDEBOOK === type) {
    //   const guidebookProps = await getGuidebookData(Number(params.householdId), discoverInterviewId, dreamInterviewId);
    //   return {
    //     ...guidebookProps
    //   }
    // }
    if (ReportType.PERSONAL_STORY === type) {
      const personalStoryProps = await getPersonalStoryReportData(householdId, discoverInterviewId, primary1Id);
      return {
        ...personalStoryProps
      }
    }
    if (ReportType.PERSONAL_STORY_2 === type) {
      const personalStoryProps = await getPersonalStoryReportData(householdId, discoverInterviewId, primary2Id);
      return {
        ...personalStoryProps
      }
    }
    if (ReportType.DREAM_LIFEPRINT === type) {
      const dreamLifeprintProps = await getDreamLifePrintData(householdId, dreamInterviewId, extraOptions as SelectedPriorities);
      return {
        ...dreamLifeprintProps
      }
    }
    if (ReportType.DISCOVER_LIFEPRINT === type) {
      const timelineFilters: TimelineFilters[] = []
      const customFilter: CustomFilter = {
        includeEmigration: true,
        includeHouse: true,
        includeVacation: true,
        includeHoliday: true,
        includePhilanthropy: true,
        includeAward: true,
        includeMilitary: true,
        includeBlackSwan: true,
        includeOther: true
      }
      const discoverLifePrintProps = await getDiscoverLifePrintData(householdId, dreamInterviewId, params.startYear, params.endYear, timelineFilters, customFilter);
      return {
        ...discoverLifePrintProps
      }
    }
    if (ReportType.DIRECTION_LIFEPRINT === type) {
      const directionLifeprintProps = await getDirectionLifePrintData(householdId, dreamInterviewId, params.year ? Number(params.year) : 2021, extraOptions as DirectionLifeprintData);
      return {
        ...directionLifeprintProps
      }
    }

    return undefined;
  }

  // const getGuidebookProps = async () => {
  //   const params: any = await getReportQueryParams(ReportType.GUIDEBOOK);
  //   const household = await api.household.getFull(Number(params.householdId));
  //   if (params) {
  //     params.isModal = false;
  //   }
  //   const guidebookProps = await getGuidebookData(Number(params.householdId), discoverInterviewId, dreamInterviewId);
  //   return {
  //     ...guidebookProps
  //   }
  // }

  return {
    selectedReport: reportDefinition,
    selectedReportProps: reportProps,
    selectedReportParams: reportParams,
    selectedReportPath: reportPath,
    showReport,
    viewReport,
    hideReport,
    showReportList,
    hideReportList,
    downloadPdfReport,
    downloadPdfGuideBook,
    downloadCustomInterviewReport,
    downloadFilteredInterviewReport,
    downloadCustomTimelineReport,
    downloadExcelReport,
    downloadPdfReportWithSelection,
    getGuidebookData,
    getReportProps,
    getReportRoutePath
  }
}

export default useReports;

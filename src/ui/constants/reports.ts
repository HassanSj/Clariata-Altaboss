import React from "react";
import ClientProfileReport from "~/ui/components/Reports/ClientProfileReport";
import InterviewQuestionsReport from "~/ui/components/Reports/InterviewQuestionsReport";
import paths from "~/ui/constants/paths";
import GuideBook from "../components/GuideBook";
import ActionPlanSummaryQuarterReport from "../components/Reports/ActionPlanSummaryQuarterReport";
import CurationOverviewWorksheet from "../components/Reports/CurationOverviewWorksheet";
import CurationSummaryReport from "../components/Reports/CurationSummaryReport";
import CurationInterviewWorksheet from "../components/Reports/CurationInterviewWorksheet";
import DirectionLifePrint from "../components/Reports/DirectionLifePrint";
import DiscoverLifePrint from "../components/Reports/DiscoverLifePrint";
import DreamLifePrint from "../components/Reports/DreamLifePrint";
import EnterpriseReport from "../components/Reports/EnterpriseReport";
import FamilyProfileWorksheet from "../components/Reports/FamilyProfileWorksheet";
import FamilyStoryReport from "../components/Reports/FamilyStoryReport";
import FamilyTreeReport from "../components/Reports/FamilyTreeReport";
import GanttChartReport from "../components/Reports/GanttChartReport";
import HouseholdEvaluationReport from "../components/Reports/HouseholdEvaluationReport";
import LegacyOfFiveFamilyProfile from "../components/Reports/LegacyOfFiveFamilyProfile";
import LifeGraphReport from "../components/Reports/LifeGraphReport";
import PersonalStoryReport from "../components/Reports/PersonalStoryReport";
import PriorityGridReport from "../components/Reports/PriorityGridReport";
import PriorityRankingReport from "../components/Reports/PriorityRankingReport";
import PriorityRankingWorksheet from "../components/Reports/PriorityRankingWorksheet";
import StoryOfUsReport from "../components/Reports/StoryOfUsReport";
import TimelineReport from "../components/Reports/TimelineReport";
import VMVReport from "../components/Reports/VMVReport";
import VMVWorksheet from "../components/Reports/VMVWorksheet";
import WhyReport from "../components/Reports/WhyReport/WhyReport";
import DestinyReport from "../components/Reports/DestinyReport/DestinyReport";
import ActionStepWorksheet from "../components/Reports/ActionStepWorksheet"
import ActionStepReport from "../components/Reports/ActionStepReport";

const { 
        REPORTS_DISCOVER_INTERVIEW_QUESTIONS, 
        REPORTS_DISCOVER_MAIN_QUESTIONS, 
        REPORTS_DREAM_INTERVIEW_QUESTIONS, 
        REPORTS_INTERVIEW,
        REPORTS_PROFILE, 
        REPORTS_EVALUATION, 
        REPORTS_STORY_OF_US, 
        REPORTS_LIFE_GRAPH,
        REPORTS_LIFE_GRAPH_METRIC,
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
        REPORTS_VMV_WORKSHEET,
        REPORTS_VMV,
        REPORTS_FAMILY_STORY,
        REPORTS_OUR_ENTERPRISE,
        REPORTS_PERSONAL_STORY,
        REPORTS_DREAM_LIFEPRINT,
        REPORTS_DISCOVER_LIFEPRINT,
        REPORTS_DIRECTION_LIFEPRINT,
        GUIDEBOOK,
        DESTINY,
        REPORTS_ACTION_STEP_WORKSHEET,
        REPORTS_ACTION_STEP_REPORT
      } = paths;

export enum ReportType {
  EVALUATION = 'EVALUATION',
  PROFILE = 'PROFILE',
  DREAM_INTERVIEW = 'DREAM_INTERVIEW',
  DISCOVER_INTERVIEW = 'DISCOVER_INTERVIEW',
  BLUEPRINT = 'BLUEPRINT',
  OUR_STORY = 'OUR_STORY',
  DISCOVER_MAIN_QUESTIONS = 'DISCOVER_MAIN_QUESTIONS',
  DISCOVER_VMV_QUESTIONS = 'DISCOVER_VMV_QUESTIONS',
  DISCOVER_MAIN_QUESTIONS_DETAILS = 'DISCOVER_MAIN_QUESTIONS_DETAILS',
  DISCOVER_VMV_QUESTIONS_DETAILS = 'DISCOVER_MAIN_QUESTIONS_DETAILS',
  DISCOVER_RESPONSES = 'DISCOVER RESPONSES',
  STORY_OF_US = 'STORY_OF_US',
  LIFE_GRAPH = 'LIFE_GRAPH',
  LIFE_GRAPH_METRIC = 'LIFE_GRAPH_METRIC',
  CURATION_WORKSHEET = 'CURATION_WORKSHEET',
  CURATION_SUMMARY = 'CURATION_SUMMARY',
  CURATION_INTERVIEW_WORKSHEET = 'CURATION_INTERVIEW_WORKSHEET',
  FAMILY_TREE = 'FAMILY_TREE',
  ACTION_PLAN_SUMMARY_QUARTER = 'ACTION_PLAN_SUMMARY_QUARTER',
  WHY = 'WHY',
  FAMILY_PROFILE_WORKSHEET = 'FAMILY_PROFILE_WORKSHEET',
  LEGACY_OF_FIVE = 'LEGACY_OF_FIVE',
  PRIORITY_GRID = 'PRIORITY_GRID',
  PRIORITY_RANKING = 'PRIORITY_RANKING',
  PRIORITY_RANKING_WORKSHEET = 'PRIORITY_RANKING_WORKSHEET',
  ANCESTRAL_TIMELINE = 'ANCESTRAL_TIMELINE',
  GANTT_CHART = 'GANTT_CHART',
  VMV_WORKSHEET = 'VMV_WORKSHEET',
  VMV = 'VMV',
  FAMILY_STORY = 'FAMILY_STORY',
  OUR_ENTERPRISE = 'OUR_ENTERPRISE',
  PERSONAL_STORY = 'PERSONAL_STORY',
  PERSONAL_STORY_2 = 'PERSONAL_STORY_2',
  DREAM_LIFEPRINT = 'DREAM_LIFEPRINT',
  DISCOVER_LIFEPRINT = 'DISCOVER LIFEPRINT',
  DIRECTION_LIFEPRINT = 'DIRECTION_LIFEPRINT',
  GUIDEBOOK = 'GUIDEBOOK',
  DESTINY = 'DESTINY',
  ACTION_STEP_WORKSHEET = "ACTION_STEP_WORKSHEET",
  ACTION_STEP_REPORT = "ACTION_STEP_REPORT"
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  BOTH = 'BOTH'
}

export enum PrimaryPersonType {
  Primary1 = 'Primary1',
  Primary2 = 'Primary2',
}

export interface ReportDefinition {
  name: string;
  icon: string;
  type: ReportType,
  path: string;
  format: ReportFormat;
  component: any;
  editable?: boolean;
  profile?:boolean;
  discover?: boolean;
  story?: boolean;
  questionIds?: number[];
  person?: PrimaryPersonType;
  dream?: boolean;
  direction?: boolean;
  destiny?:boolean;
  order?: number;  
}

export const ReportTypes: { [key: string]: ReportDefinition } = {
  [ReportType.EVALUATION]: {
    name: 'Household Evaluation',
    icon: 'house_icon',
    type: ReportType.EVALUATION,
    path: REPORTS_EVALUATION,
    format: ReportFormat.PDF,
    component: HouseholdEvaluationReport,
    editable: true,
    discover: true,
    order: 1,
  },
  [ReportType.PROFILE]: {
    name: 'Client Profile',
    icon: 'group',
    type: ReportType.PROFILE,
    path: REPORTS_PROFILE,
    format: ReportFormat.PDF,
    component: ClientProfileReport,
    editable: false,
    profile: true,
    order: 2,
  },
  [ReportType.DISCOVER_INTERVIEW]: {
    name: 'Discover Interview Questions',
    icon: 'list',
    type: ReportType.DISCOVER_INTERVIEW,
    path: REPORTS_DISCOVER_INTERVIEW_QUESTIONS, 
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    discover: true,
  },
  [ReportType.DISCOVER_MAIN_QUESTIONS]: {
    name: 'Discover Interview Main Questions - Client',
    icon: 'list',
    type: ReportType.DISCOVER_MAIN_QUESTIONS,
    path:  REPORTS_DISCOVER_MAIN_QUESTIONS, 
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    discover: true,
    order: 3,
  },
  [ReportType.DISCOVER_VMV_QUESTIONS]: {
    name: 'VMV Questions - Client',
    icon: 'list',
    type: ReportType.DISCOVER_VMV_QUESTIONS,
    path: REPORTS_INTERVIEW,
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    discover: true,
    order: 4,
  },
  [ReportType.DISCOVER_VMV_QUESTIONS_DETAILS]: {
    name: 'VMV Questions With Details - Advisor',
    icon: 'list',
    type: ReportType.DISCOVER_VMV_QUESTIONS_DETAILS,
    path: REPORTS_INTERVIEW,
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    discover: true,
    order: 5,
  },
  [ReportType.DISCOVER_RESPONSES]: {
    name: 'Discover Responses',
    icon: 'list',
    type: ReportType.DISCOVER_RESPONSES,
    path: REPORTS_INTERVIEW,
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    discover: true,
  },
  [ReportType.DREAM_INTERVIEW]: {
    name: 'Dream Interview Questions',
    icon: 'list',
    type: ReportType.DREAM_INTERVIEW,
    path:  REPORTS_DREAM_INTERVIEW_QUESTIONS,
    format: ReportFormat.PDF,
    component: InterviewQuestionsReport,
    editable: true,
    dream: true,
  },  
  [ReportType.STORY_OF_US]: {
    name: 'The Story Of Us',
    icon: 'history_icon',
    type: ReportType.STORY_OF_US,
    path: REPORTS_STORY_OF_US,
    format: ReportFormat.PDF,
    component: StoryOfUsReport,
    editable: false,
    story: true,
    questionIds: [435,436,342,437,438,441,221,215,301,302,303,304,427,206,282,394,284,285,397,398,399,400,401,402,205,278,386,387,388,280,385,279,389,390,391],
    discover: true,
    order: 7,
  },
  [ReportType.LIFE_GRAPH]: {
    name: 'Graph',
    icon: 'pie_chart',
    type: ReportType.LIFE_GRAPH,
    path: REPORTS_LIFE_GRAPH,
    format: ReportFormat.PDF,
    component: LifeGraphReport,
    editable: false,
    dream: true,
  },
  [ReportType.LIFE_GRAPH_METRIC]: {
    name: 'Graph',
    icon: 'pie_chart',
    type: ReportType.LIFE_GRAPH_METRIC,
    path: REPORTS_LIFE_GRAPH_METRIC,
    format: ReportFormat.PDF,
    component: LifeGraphReport,
    editable: false,
    dream: true,
  },
  [ReportType.CURATION_WORKSHEET]: {
    name: 'Curation Overview Worksheet',
    icon: 'insert_drive_file',
    type: ReportType.CURATION_WORKSHEET,
    path: REPORTS_CURATION_WORKSHEET,
    format: ReportFormat.PDF,
    component: CurationOverviewWorksheet,
    editable: false,
    direction: true,
  },
  [ReportType.CURATION_SUMMARY]: {
    name: 'Curation Summary Report',
    icon: 'insert_drive_file',
    type: ReportType.CURATION_SUMMARY,
    path: REPORTS_CURATION_SUMMARY,
    format: ReportFormat.PDF,
    component: CurationSummaryReport,
    editable: false,
    direction: true,
  },
  [ReportType.CURATION_INTERVIEW_WORKSHEET]: {
    name: 'Curation Interview Worksheet',
    icon: 'insert_drive_file',
    type: ReportType.CURATION_INTERVIEW_WORKSHEET,
    path: REPORTS_CURATION_INTERVIEW_WORKSHEET,
    format: ReportFormat.PDF,
    component: CurationInterviewWorksheet,
    editable: false,
    direction: true,
  },
  [ReportType.FAMILY_TREE]: {
    name: 'Legacy of Five Family Tree Report',
    icon: 'account_tree',
    type: ReportType.FAMILY_TREE,
    path: REPORTS_FAMILY_TREE,
    format: ReportFormat.PDF,
    component: FamilyTreeReport,
    editable: false,
    discover: true,
  },
  [ReportType.ACTION_PLAN_SUMMARY_QUARTER]: {
    name: 'Action Plan Summary Quarter Report – Date Range with Timeframe (all 4 quarters in the range)',
    icon: 'table_chart',
    type: ReportType.ACTION_PLAN_SUMMARY_QUARTER,
    path: REPORTS_ACTION_PLAN_SUMMARY_QUARTER,
    format: ReportFormat.PDF,
    component: ActionPlanSummaryQuarterReport,
    editable: false,
    direction: true,
  },
  [ReportType.WHY]: {
    name: 'The "Why" Report',
    icon: 'help_center',
    type: ReportType.WHY,
    path: REPORTS_WHY,
    format: ReportFormat.PDF,
    component: WhyReport,
    editable: false,
    dream: true,
  },
  [ReportType.FAMILY_PROFILE_WORKSHEET]: {
    name: 'Family Profile Worksheet',
    icon: 'people',
    type: ReportType.FAMILY_PROFILE_WORKSHEET,
    path: REPORTS_FAMILY_PROFILE_WORKSHEET,
    format: ReportFormat.PDF,
    component: FamilyProfileWorksheet,
    editable: true,
    direction: true,
  },
  [ReportType.LEGACY_OF_FIVE]: {
    name: 'Legacy of Five Family Profile',
    icon: 'group',
    type: ReportType.LEGACY_OF_FIVE,
    path: REPORTS_LEGACY_OF_FIVE,
    format: ReportFormat.PDF,
    component: LegacyOfFiveFamilyProfile,
    editable: false,
    profile: true,
  },
  [ReportType.PRIORITY_GRID]: {
    name: 'Priority Grid Report',
    icon: 'table_chart',
    type: ReportType.PRIORITY_GRID,
    path: REPORTS_PRIORITY_GRID,
    format: ReportFormat.PDF,
    component: PriorityGridReport,
    editable: false,
    dream: true,
  },
  [ReportType.PRIORITY_RANKING]: {
    name: 'Priority Ranking Report',
    icon: 'table_chart',
    type: ReportType.PRIORITY_RANKING,
    path: REPORTS_PRIORITY_RANKING,
    format: ReportFormat.PDF,
    component: PriorityRankingReport,
    editable: false,
    direction: true,
  },
  [ReportType.PRIORITY_RANKING_WORKSHEET]: {
    name: 'Priority Ranking Worksheet',
    icon: 'table_chart',
    type: ReportType.PRIORITY_RANKING_WORKSHEET,
    path: REPORTS_PRIORITY_RANKING_WORKSHEET,
    format: ReportFormat.PDF,
    component: PriorityRankingWorksheet,
    editable: false,
    direction: true,
  },
  [ReportType.ANCESTRAL_TIMELINE]: {
    name: 'Ancestral Timeline',
    icon: 'timeline',
    type: ReportType.ANCESTRAL_TIMELINE,
    path: REPORTS_ANCESTRAL_TIMELINE,
    format: ReportFormat.PDF,
    component: TimelineReport,
    editable: true,
    discover: true,
  },
  [ReportType.GANTT_CHART]: {
    name: 'Gantt Chart Report',
    icon: 'table_chart',
    type: ReportType.GANTT_CHART,
    path: REPORTS_GANTT_CHART,
    format: ReportFormat.PDF,
    component: GanttChartReport,
    editable: false,
    direction: true,
  },
  [ReportType.VMV]: {
    name: 'Vision, Mission, Core Values Report',
    icon: 'table_chart',
    type: ReportType.VMV,
    path: REPORTS_VMV,
    format: ReportFormat.PDF,
    component: VMVReport,
    editable: false,
    story: true,
    questionIds: [322,323,324,325,326,327,328,329,330,331,332,333,321],
    discover: true,
  },
  [ReportType.VMV_WORKSHEET]: {
    name: 'Vision, Mission, Core Values Worksheet',
    icon: 'table_chart',
    type: ReportType.VMV_WORKSHEET,
    path: REPORTS_VMV_WORKSHEET,
    format: ReportFormat.PDF,
    component: VMVWorksheet,
    editable: false,
    story: false,
    discover: true,
  },
  [ReportType.FAMILY_STORY]: {
    name: 'Family Story',
    icon: 'history_icon',
    type: ReportType.FAMILY_STORY,
    path: REPORTS_FAMILY_STORY,
    format: ReportFormat.PDF,
    component: FamilyStoryReport,
    editable: false,
    story: true,
    questionIds: [207,286,287,208,289,290,404,406,407,405,410,408,409,198,253,354,355,356,358,353,359,360,443,444,445,252,251,212,297,383,210,293,292,464,211,295,296],
    discover: true,
  },
  [ReportType.OUR_ENTERPRISE]: {
    name: 'Our Enterprise',
    icon: 'api_icon',
    type: ReportType.OUR_ENTERPRISE,
    path: REPORTS_OUR_ENTERPRISE,
    format: ReportFormat.PDF,
    component: EnterpriseReport,
    editable: false,
    story: true,
    questionIds: [305,306,308,419,418,420,421,415,309,311,312,315,313,318,319,317,307,316,320,413],
    discover: true
  },
  [ReportType.PERSONAL_STORY]: {
    name: 'Personal Story',
    icon: 'person',
    type: ReportType.PERSONAL_STORY,
    path: REPORTS_PERSONAL_STORY,
    format: ReportFormat.PDF,
    component: PersonalStoryReport,
    editable: false,
    story: true,
    questionIds: [434,428,429,430,432,433,350,351,233,195,231,442,238,235,196,240,242,411,241,243,416,417,201,265,266,267,268,269,270,203,272,273,200,259,260,262,263,197,455,456,457,458,459,460,462,452,463,337,338,341,381,382,204,275,264,371,372,373,277,213,298,214,299,300],
    person: PrimaryPersonType.Primary1,
    discover: true,
  },
  [ReportType.PERSONAL_STORY_2]: {
    name: 'Personal Story',
    icon: 'person',
    type: ReportType.PERSONAL_STORY_2,
    path: REPORTS_PERSONAL_STORY,
    format: ReportFormat.PDF,
    component: PersonalStoryReport,
    editable: false,
    story: true,
    questionIds: [434,428,429,430,432,433,350,351,233,195,231,442,238,235,196,240,242,411,241,243,416,417,201,265,266,267,268,269,270,203,272,273,200,259,260,262,263,197,455,456,457,458,459,460,462,452,463,337,338,341,381,382,204,275,264,371,372,373,277,213,298,214,299,300],
    person: PrimaryPersonType.Primary2,
    discover: true,
  },
  [ReportType.DISCOVER_LIFEPRINT]: {
    name: 'Discover Lifeprint',
    icon: 'table_chart',
    type: ReportType.DISCOVER_LIFEPRINT,
    path: REPORTS_DISCOVER_LIFEPRINT,
    format: ReportFormat.PDF,
    component: DiscoverLifePrint,
    editable: true,
    discover: true,
  },
  [ReportType.DREAM_LIFEPRINT]: {
    name: 'Dream Lifeprint',
    icon: 'table_chart',
    type: ReportType.DREAM_LIFEPRINT,
    path: REPORTS_DREAM_LIFEPRINT,
    format: ReportFormat.PDF,
    component: DreamLifePrint,
    editable: true,
    direction: true,
  },
  [ReportType.DIRECTION_LIFEPRINT]: {
    name: 'Direction Lifeprint',
    icon: 'table_chart',
    type: ReportType.DIRECTION_LIFEPRINT,
    path: REPORTS_DIRECTION_LIFEPRINT,
    format: ReportFormat.PDF,
    component: DirectionLifePrint,
    editable: true,
    direction: true,
  },
  [ReportType.GUIDEBOOK]: {
    name: 'Guidebook',
    icon: 'book',
    type: ReportType.GUIDEBOOK,
    path: GUIDEBOOK,
    format: ReportFormat.PDF,
    component: GuideBook,
    editable: true,
    direction: true,
  },
  [ReportType.DESTINY]: {
    name: 'Destiny',
    icon: 'book',
    type: ReportType.DESTINY,
    path: DESTINY,
    format: ReportFormat.PDF,
    component: DestinyReport,
    editable: true,
    destiny: true,
  },
  [ReportType.ACTION_STEP_WORKSHEET]: {
    name: 'Action Step Worksheet',
    icon: 'table_chart',
    type: ReportType.ACTION_STEP_WORKSHEET,
    path: REPORTS_ACTION_STEP_WORKSHEET,
    format: ReportFormat.PDF,
    component: ActionStepWorksheet,
    editable: false,
    direction: true,
  },
  [ReportType.ACTION_STEP_REPORT]: {
    name: 'Action Step Report',
    icon: 'table_chart',
    type: ReportType.ACTION_STEP_REPORT,
    path: REPORTS_ACTION_STEP_REPORT,
    format: ReportFormat.PDF,
    component: ActionStepReport,
    editable: false,
    direction: true,
  },
}

export const isPdfReport = (format: ReportFormat) => {
  return format === ReportFormat.PDF || format === ReportFormat.BOTH;
}

export const isExcelReport = (format: ReportFormat) => {
  return format === ReportFormat.EXCEL || format === ReportFormat.BOTH;
}
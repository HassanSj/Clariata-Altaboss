import {IDataTableView} from "~/types/data";
import DescriptionTemplate from "~/ui/components/Priorities/CellTemplates/DescriptionTemplate";
import MetricOfSuccessTemplate from "~/ui/components/Priorities/CellTemplates/MetricOfSuccessTemplate";
import DimensionOfLifeTemplate from "~/ui/components/Priorities/CellTemplates/DimensionOfLifeTemplate";
import ActionItemsTemplate from "~/ui/components/Priorities/CellTemplates/ActionItemsTemplate";
import ChampionTemplate from "~/ui/components/Priorities/CellTemplates/ChampionTemplate";
import PriorityTemplate from "~/ui/components/Priorities/CellTemplates/PriorityTemplate";
import ScheduleDetailsTemplate from "~/ui/components/Priorities/CellTemplates/ScheduleDetailsTemplate";
import AssistanceNeededTemplate from "~/ui/components/Priorities/CellTemplates/AssistanceNeededTemplate";
import StakeholdersTemplate from "~/ui/components/Priorities/CellTemplates/StakeholdersTemplate";
import ConnectionsTemplate from "~/ui/components/Priorities/CellTemplates/ConnectionsTemplate";
import FundingKnownTemplate from "~/ui/components/Priorities/CellTemplates/FundingKnownTemplate";
import FundingAmountsTemplate from "~/ui/components/Priorities/CellTemplates/FundingAmountsTemplate";
import FundingDetailTemplate from "~/ui/components/Priorities/CellTemplates/FundingDetailTemplate";
import SuccessImageTemplate from "~/ui/components/Priorities/CellTemplates/SuccessImageTemplate";
import ImportanceTemplate from "~/ui/components/Priorities/CellTemplates/ImportanceTemplate";
import KnowledgeNeededTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeNeededTemplate";
import KnowledgeAdvisorHelpTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeAdvisorHelpTemplate";
import KnowledgeYesNoTemplate from "~/ui/components/Priorities/CellTemplates/KnowledgeYesNoTemplate";
import PersonalImpactLevelTemplate from "~/ui/components/Priorities/CellTemplates/PersonalImpactLevelTemplate";
import PersonalExperienceTemplate from "~/ui/components/Priorities/CellTemplates/PersonalExperienceTemplate";
import AssistanceToggleTemplate from "~/ui/components/Priorities/CellTemplates/AssistanceToggleTemplate";
import ScheduleFrequencyTemplate from "~/ui/components/Priorities/CellTemplates/ScheduleFrequencyTemplate";
import PersonTemplate from "~/ui/components/Priorities/CellTemplates/PersonTemplate";
import PriorityTimeframeTemplate from "~/ui/components/Priorities/CellTemplates/PriorityTimeframeTemplate";
import DatesTemplate from "~/ui/components/Priorities/CellTemplates/DatesTemplate";
import PrioritySelectTemplate from "~/ui/components/Priorities/CellTemplates/PrioritySelectTemplate";
import {Objective} from "~/types/api/objective";
import {getFullName} from "~/ui/constants/user";
import {isValidDate} from "~/ui/constants/utils";
import {FormInputType} from "~/ui/constants/forms";
import RankTemplate from "~/ui/components/Priorities/CellTemplates/RankTemplate";
import { Checkbox } from "@material-ui/core";
import ClientTypeTemplate from "~/ui/components/Priorities/CellTemplates/ClientTypeTemplate";
import TaskTemplate from "../components/Priorities/CellTemplates/TaskTemplate";
import ReportTitleTemplate from "../components/Priorities/CellTemplates/ReportTitleTemplate";
import CompletedTaskTemplate from "../components/Priorities/CellTemplates/CompletedTaskTemplate";
import PersonTemplateWithoutImage from "../components/Priorities/CellTemplates/PersonTemplateWithoutImage";

export const getLabel = (options: any[], value: any) => {
    return options?.find((o) => o?.value === value);
}

export const MAX_OBJECTIVES = 10;

export enum ObjectiveTimeframeType {
    NOW = 1,
    LATER = 2,
    OTHER = 3
}

export const objectiveTimeframeTypes = [
    {
        label: 'Now',
        value: ObjectiveTimeframeType.NOW
    },
    {
        label: '3 yr',
        value: ObjectiveTimeframeType.LATER
    },
    {
        label: 'Long Term',
        value: ObjectiveTimeframeType.OTHER
    },
];

export const objectiveYesNoTypes = [
    {
        label: 'Yes',
        value: true
    },
    {
        label: 'No',
        value: false
    }
];

export const objectiveImportanceCategories = [
    {
        label: 'Essential Need',
        value: '1'
    },
    {
        label: 'Important Want',
        value: '2'
    },
    {
        label: 'Aspirational Desire',
        value: '3'
    },
];

export const objectiveTimingFrequency = [
    {
        label: 'Once',
        value: '1'
    },
    {
        label: 'Daily',
        value: '2'
    },
    {
        label: 'Weekly',
        value: '3'
    },
    {
        label: 'Bi-Weekly',
        value: '4'
    },
    {
        label: 'Monthly',
        value: '5'
    },
    {
        label: 'Quarterly',
        value: '6'
    },
    {
        label: 'Aspirational',
        value: '7'
    },
];

export const objectiveKnowledgeLevels = [
    {
        label: 'Sufficient Understanding',
        value: '1'
    },
    {
        label: 'Formal Training',
        value: '2'
    },
    {
        label: 'Formal Education',
        value: '3'
    },
    {
        label: 'Vocation',
        value: '4'
    },
];

export const objectiveKnowledgeTask = [
    {
        label: 'Speak with an expert',
        value: '1'
    },
    {
        label: 'Read material and information online',
        value: '2'
    },
    {
        label: 'Formal education and/or training',
        value: '3'
    },
    {
        label: 'Engage/hire a service provider',
        value: '4'
    },
];

export const objectivePersonalImpacts = [
    {
        label: 'High',
        value: '1'
    },
    {
        label: 'Low',
        value: '2'
    },
    {
        label: 'None',
        value: '3'
    },
];

export const objectiveFundingNeeds = [
    {
        label: 'Dont know',
        value: '1'
    },
    {
        label: 'Need help determining',
        value: '2'
    },
    {
        label: 'Has an amount',
        value: '3'
    },
];

export const objectiveFundingTypes = [
    {
        label: 'Single payment',
        value: '1'
    },
    {
        label: 'Installments',
        value: '2'
    }
];

export const objectiveStatuses = [
    {
        label: 'Not started',
        value: '1'
    },
    {
        label: 'In-progress',
        value: '2'
    },
    {
        label: 'On hold',
        value: '3'
    },
    {
        label: 'Under review',
        value: '4'
    },
    {
        label: 'Canceled',
        value: '5'
    },
    {
        label: 'Complete',
        value: '6'
    },
];

export const objectiveViews: IDataTableView[] = [

    // {
    //     id: 'checklist',
    //     name: 'Checklist',
    //     description: `
    //     The Direction phase of the process creates a roadmap for you and your client based on their vision for the future. Then they determine the timing for pursuing each metric of success. Finally, they ascertain what of their resources will be needed to achieve each of the prioritized metrics of success. In order to streamline the interviews, Clariata developed a checklist to step through the LifeMapping Process.
    //     `,
    //     headers: [
    //         {
    //             id: 'completed',
    //             title: "Completed",
    //             field: "Completed",
    //             sortable: false,
    //             width: 1,
    //             component: CompletedTaskTemplate,
    //             // onlyOnNoDrag:true
    //         },
    //         {
    //             id: 'who',
    //             title: 'Who',
    //             field: 'UserTypeID',
    //             sortable: false,
    //             width: 2,
    //             component: ClientTypeTemplate
    //         },
    //         {
    //             id: 'task',
    //             title: 'Task/Activity',
    //             field: 'TaskName',
    //             sortable: false,
    //             // onSort: (item: Objective | undefined) => item?.PersonID,
    //             width: 5,
    //             component: TaskTemplate
    //         },
    //         {
    //             id: 'report_title',
    //             title: 'Report Title',
    //             field: 'TaskTitle',
    //             sortable: false,
    //             width: 4,
    //             // collapsedWidth: 2,
    //             component: ReportTitleTemplate
    //         },
    //     ]
    // },
    {
        id: 'timing',
        name: 'Plan',
        description: `
        The RTA ranks, times, and signifies if you need assistance with each priority. Rank order your priorities based on their importance, urgency, or significance to you (R). Then decide when you want to pursue each priority, i.e., in the next twelve months, three years, or longer term (T). Finally, decide if you will want assistance in pursuing each priority (A). `,
        headers: [
            {
                id: 'rank',
                title: "Rank",
                field: "Rank",
                sortable: true,
                width: 1,
                component: RankTemplate,
                onlyOnNoDrag:false
            },
            {
                id: 'description',
                title: 'Priority',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'person',
                title: 'Family Member',
                field: 'PersonID',
                sortable: true,
                // onSort: (item: Objective | undefined) => item?.PersonID,
                width: 1,
                // collapsedWidth: 1,
                component: PersonTemplateWithoutImage
            },
            {
                id: 'timing_dates',
                title: 'Timing',
                field: 'TimeframeID',
                sortable: true,
                width: 3,
                component: PriorityTimeframeTemplate
            },
            {
                id: 'dates',
                title: 'Start Date',
                field: 'StartDate',
                fieldType: FormInputType.DATE,
                sortable: true,
                onSort: (item: Objective | undefined) => item?.StartDate && isValidDate(item?.StartDate) ? new Date(item?.StartDate) : undefined,
                width: 1,
                component: DatesTemplate
            },
            {
                id: 'assistance',
                title: 'Assistance',
                field: 'AssistanceNeeded',
                sortable: true,
                width: 2,
                component: AssistanceToggleTemplate
            }
        ]
    },
    {
        id: 'pre_curate',
        name: 'Pre-curation',
        description: `
        The curation model of Clariata helps to layout your prioritized objectives and goals based on the importance, what resources are needed to accomplish each, and the timing for their action. Use the checkboxes to select the priorities you'd like to curate. You can curate a maximum of 10 priorities at a time.
        `,
        headers: [
            {
                id: 'select',
                title: 'Select',
                field: 'Select',
                width: 1,
                component: PrioritySelectTemplate
            },
            {
                id: 'rank',
                title: "Rank",
                field: "Rank",
                sortable: true,
                width: 1,
                component: RankTemplate
            },
            {
                id: 'description',
                title: 'Priority',
                field: 'Description',
                sortable: true,
                width: 6,
                component: DescriptionTemplate
            },
            {
                id: 'dates',
                title: 'Start Date',
                field: 'StartDate',
                fieldType: FormInputType.DATE,
                sortable: true,
                onSort: (item: Objective | undefined) => [item?.StartDate && isValidDate(item?.StartDate) ? new Date(item?.StartDate) : undefined],
                width: 3,
                component: DatesTemplate
            },

        ]
    },
    {
        id: 'curate',
        name: 'Curation',
        description: "What resources (time, knowledge, experiences, connections, and economic resources) are needed to pursue each priority?",
        isAction: true
    },
    {
        id: 'strategy',
        name: 'Strategy',
        description: `
        What steps do we need to do to pursue this priority? List each action step, the months you want to work on it, and whether assistance will be needed to pursue it.
        `,
        headers: [
            {
                id: 'description',
                title: 'Priority',
                field: 'Description',
                sortable: true,
                width: 2,
                component: DescriptionTemplate
            },
            {
                id: 'dimension_of_life',
                title: 'Dimension',
                field: 'DimensionOfLifeID',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${item?.DimensionOfLife?.DimensionOfLife}`],
                width: 2,
                component: DimensionOfLifeTemplate
            },
            {
                id: 'metric_of_success',
                title: 'Metric',
                field: 'MetricOfSuccessID',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${item?.MetricOfSuccess?.MetricOfSuccess}`],
                width: 2,
                component: MetricOfSuccessTemplate
            },
            {
                id: 'person',
                title: 'Family Member',
                field: 'PersonID',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${getFullName(item?.Person)}`],
                width: 1,
                component: PersonTemplate
            },
            {
                id: 'timing_dates',
                title: 'Timing',
                field: 'Prioritize Now or Later?',
                width: 2,
                component: PriorityTimeframeTemplate
            },
            {
                id: 'dates',
                title: 'Start Date',
                field: 'StartDate',
                fieldType: FormInputType.DATE,
                sortable: true,
                onSort: (item: Objective | undefined) => [item?.StartDate && isValidDate(item?.StartDate) ? new Date(item?.StartDate) : undefined],
                width: 1,
                component: DatesTemplate
            },
            {
                id: 'assistance',
                title: 'Assistance',
                field: 'Assistance',
                width: 2,
                component: AssistanceToggleTemplate
            },
        ]
    },
];

export const objectiveViewsDeepen: IDataTableView[] = [
    {
        id: 'summary',
        name: 'Summary',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'dimension_of_life',
                title: 'Dimension',
                field: 'DimensionOfLife',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${item?.DimensionOfLife?.DimensionOfLife}`],
                width: 2,
                component: DimensionOfLifeTemplate
            },
            {
                id: 'metric_of_success',
                title: 'Metric',
                field: 'MetricOfSuccess',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${item?.MetricOfSuccess?.MetricOfSuccess}`],
                width: 2,
                component: MetricOfSuccessTemplate
            },
            {
                id: 'action_items',
                title: 'Action Steps',
                field: 'Description',
                width: 2,
                component: ActionItemsTemplate
            }
        ]
    },
    {
        id: 'timing',
        name: 'Timing',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'timing_dates',
                title: 'Timing w/ Dates',
                field: 'StartDate',
                width: 2,
                component: PriorityTemplate
            },
            {
                id: 'timing_required',
                title: 'Work Timing Required',
                field: 'ScheduleFrequencyID',
                width: 2,
                component: ScheduleFrequencyTemplate
            },
            {
                id: 'timing_required',
                title: 'Work Timing Details',
                field: 'ScheduleFrequencyID',
                width: 2,
                component: ScheduleDetailsTemplate
            }
        ]
    },
    {
        id: 'assistance',
        name: 'Assistance',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'assistance_needed',
                title: 'Assistance Needed?',
                field: 'AssistanceNeeded',
                width: 2,
                component: AssistanceNeededTemplate
            },
            {
                id: 'stakeholders',
                title: 'Stakeholders',
                field: 'Stakeholders',
                width: 2,
                component: StakeholdersTemplate
            },
            {
                id: 'connections',
                title: 'Connections',
                field: 'Connections',
                width: 2,
                component: ConnectionsTemplate
            }
        ]
    },
    {
        id: 'knowledge',
        name: 'Knowledge',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${getFullName(item?.ChampionPerson)}`],
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'maintains_knowledge',
                title: 'Do you have the knowledge?',
                description: 'Do you know what it will take to pursue this priority?',
                field: 'KnowledgeYesNo',
                width: 2,
                component: KnowledgeYesNoTemplate
            },
            {
                id: 'knowledge_needed',
                title: 'Knowledge Needed',
                field: 'KnowledgeNeeded',
                width: 2,
                component: KnowledgeNeededTemplate
            },
            {
                id: 'requires_advisor',
                title: 'Requires an advisor?',
                field: 'Champion',
                width: 2,
                component: KnowledgeAdvisorHelpTemplate
            }
        ]
    },
    {
        id: 'experience',
        name: 'Experience',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${getFullName(item?.ChampionPerson)}`],
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'personal_impact_level',
                title: 'Impact of Personal Experience',
                description: 'How will your personal experiences impact your pursuit of this priority?',
                field: 'PersonalImpactLevel',
                width: 2,
                component: PersonalImpactLevelTemplate
            },
            {
                id: 'person_experience',
                title: 'What can you draw from personal experiences?',
                description: 'What of your personal experiences can you draw on in pursuing this priority?',
                field: 'PersonalExperience',
                width: 4,
                component: PersonalExperienceTemplate
            }
        ]
    },
    {
        id: 'importance',
        name: 'Importance',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${getFullName(item?.ChampionPerson)}`],
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'importance_category',
                title: 'Importance Category',
                description: 'How would you categorize this priority? Is it an essential, important, or aspirational priority?',
                field: 'Importance',
                width: 2,
                component: ImportanceTemplate
            },
            {
                id: 'success_definition',
                title: 'Success Definition',
                description: 'How will you know you are successful? ',
                field: 'SuccessDescription',
                width: 2,
                component: SuccessImageTemplate
            },
            {
                id: 'success_image',
                title: 'Success Image',
                description: 'What does success look like to you? ',
                field: 'SuccessImage',
                width: 2,
                component: SuccessImageTemplate
            }
        ]
    },
    {
        id: 'funding',
        name: 'Funding',
        headers: [
            {
                id: 'description',
                title: 'Description',
                field: 'Description',
                sortable: true,
                width: 3,
                component: DescriptionTemplate
            },
            {
                id: 'champion',
                title: 'Champion',
                field: 'Champion',
                sortable: true,
                onSort: (item: Objective | undefined) => [`${getFullName(item?.ChampionPerson)}`],
                width: 2,
                component: ChampionTemplate
            },
            {
                id: 'funding_required',
                title: 'What funding is needed?',
                description: 'What do you think the funding needs will be to pursue this priority?',
                field: 'FundingKnown',
                width: 2,
                component: FundingKnownTemplate
            },
            {
                id: 'funding_requirements',
                title: 'Funding Requirements',
                description: 'Single payments or installments? If single payment, what is the total amount? If installments, in what frequency and what amount?',
                field: 'TotalFundingAmount',
                sortable: true,
                width: 2,
                component: FundingAmountsTemplate
            },
            {
                id: 'funding_details',
                title: 'Funding Details',
                description: 'Additional funding information',
                field: 'FundingDetail',
                width: 2,
                component: FundingDetailTemplate
            }
        ]
    }
];

export const objectiveCurationDays = [
    {
        label: '30 days',
        value: 30
    },
    {
        label: '60 days',
        value: 60
    },
    {
        label: '180 days',
        value: 180
    },
];

import {IDataTableView} from "~/types/data";
import DescriptionTemplate from "~/ui/components/Priorities/CellTemplates/DescriptionTemplate";
import AssistanceToggleTemplate from "~/ui/components/Priorities/CellTemplates/AssistanceToggleTemplate";
import DatesTemplate from "~/ui/components/Priorities/CellTemplates/DatesTemplate";
import {Objective} from "~/types/api/objective";
import {isValidDate} from "~/ui/constants/utils";
import {FormInputType} from "~/ui/constants/forms";
import RankTemplate from "~/ui/components/Priorities/CellTemplates/RankTemplate";
import PersonTemplateWithoutImage from "../components/Priorities/CellTemplates/PersonTemplateWithoutImage";
import PriorityTimeframeTemplate from "../components/Priorities/CellTemplates/PriorityTimeframeTemplate";
import TaskTemplate from "../components/Admin/Checklists/Shared/components/TaskTemplate";
import WhoTemplate from "../components/Admin/Checklists/Shared/components/WhoTemplate";
import ResourceTemplate from "../components/Admin/Checklists/Shared/components/ResourceTemplate";
import ReportTemplate from "../components/Admin/Checklists/Shared/components/ReportTemplate";
import OrderTemplate from "../components/Admin/Checklists/Shared/components/OrderTemplate";

export const checklistItemViews: IDataTableView[] = [
    {
        id: 'checklistItem',
        name: 'Checklist Items',
        headers: [
            {
                id: 'ChecklistItemTask',
                title: "Task",
                field: "ChecklistItemTask",
                sortable: true,
                width: 2,
                component: TaskTemplate,
                onlyOnNoDrag:false
            },
            {
                id: 'ChecklistItemWho',
                title: 'Who',
                field: 'ChecklistItemWho',
                sortable: true,
                width: 2,
                component: WhoTemplate
            },
            {
                id: 'ChecklistItemResource',
                title: 'Resource(s)',
                field: 'ChecklistItemResource',
                sortable: true,
                // onSort: (item: Objective | undefined) => item?.PersonID,
                width: 2,
                // collapsedWidth: 1,
                component: ResourceTemplate
            },
            {
                id: 'ChecklistItemReport',
                title: 'Report(s)',
                field: 'ChecklistItemReport',
                sortable: true,
                width: 3,
                component: ReportTemplate
            },
            {
                id: 'OrderNumber',
                title: 'Order',
                field: 'OrderNumber',
                fieldType: FormInputType.DATE,
                sortable: true,
                onSort: (item: Objective | undefined) => item?.StartDate && isValidDate(item?.StartDate) ? new Date(item?.StartDate) : undefined,
                width: 1,
                component: OrderTemplate
            },
        ]
    },
];

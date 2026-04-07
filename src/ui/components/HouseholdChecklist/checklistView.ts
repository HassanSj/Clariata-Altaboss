import {IDataTableView} from "~/types/data";
import CompletedItem from "./components/completedItem";
import resourceTemplate from "./components/resourceTemplate";
import TaskTemplate from "./components/taskTemplate";
import whoType from "./components/whoType";

export const checklistView: IDataTableView[] = [

    {
        id: 'checklist',
        name: 'Checklist',
        headers: [
            {
                id: 'completed',
                title: "Completed",
                field: "IsComplete",
                sortable: false,
                width: 1,
                component: CompletedItem,
            },
            {
                id: 'who',
                title: 'Who',
                field: 'ChecklistItemWho',
                sortable: false,
                width: 2,
                component: whoType
            },
            {
                id: 'task',
                title: 'Task',
                field: 'ChecklistItemTask',
                sortable: false,
                width: 5,
                component: TaskTemplate
            },
            {
                id: 'resource',
                title: 'Resource(s)',
                field: 'ChecklistItemResource',
                sortable: false,
                width: 4,
                component: resourceTemplate
            },
        ]
    }
]
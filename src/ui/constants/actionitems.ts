import {IDataTableView} from "~/types/data";
import {Objective} from "~/types/api/objective";
import {ActionItem} from "~/types/api/actionItem";
import {getFullName} from "~/ui/constants/user";

export const directionActionItemViews: IDataTableView[] = [
  {
    id: 'list',
    name: 'List',
    headers: [
      {
        id: 'description',
        title: 'Action Step',
        field: 'Description',
        width: 3
      },
      {
        id: 'diy',
        title: 'DIY',
        field: 'DIY',
        width: 3
      },
      {
        id: 'lead_person',
        title: 'Assigned To',
        field: 'LeadPerson',
        width: 3
      },
      {
        id: 'status',
        title: 'Status',
        field: 'Status',
        width: 2
      },
      {
        id: 'actions',
        title: 'Menu',
        width: 1
      },
    ]
  },
  {
    id: 'gantt',
    name: 'Gantt'
  },
  {
    id: 'scheduler',
    name: 'Scheduler'
  },
];

export const actionItemViews: IDataTableView[] = [
  {
    id: 'list',
    name: 'List',
    headers: [
      {
        id: 'description',
        title: 'Action Step',
        field: 'Description',
        sortable: true,
        width: 3
      },
      {
        id: 'lead_person',
        title: 'Assigned To',
        field: 'LeadPerson',
        sortable: true,
        onSort: (item: ActionItem | undefined) => [`${getFullName(item?.Person)}`],
        width: 2
      },
      {
        id: 'objective',
        title: 'Objective',
        field: 'Objective',
        onSort: (item: ActionItem | undefined) => [`${item?.Objective?.Description}`],
        sortable: true,
        width: 2
      },
      {
        id: 'status',
        title: 'Status',
        field: 'Status',
        sortable: true,
        width: 2
      },
      {
        id: 'sub_action_items',
        title: 'Sub Action Steps',
        field: 'ActionItemList',
        width: 2
      },
      {
        id: 'actions',
        title: 'Menu',
        width: 1
      },
    ]
  },
  {
    id: 'gantt',
    name: 'Gantt'
  },
  {
    id: 'scheduler',
    name: 'Scheduler'
  },
];

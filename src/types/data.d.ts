import {CrudActionType} from "~/ui/constants/data";
import {SortDirection} from "~/ui/constants/data";
import {FormInputType} from "~/ui/constants/forms";

declare interface IFilterOption {
  label: string;
  value: string;
}

declare interface DragAndDropItem {
  type: string
  id: string
  originalIndex: string
}

declare interface IDataTableView {
  id: string;
  name: string;
  description?: string;
  headers?: IDataTableHeader[];
  idField?: string;
  isAction?: boolean;
  onShow?: any;
  onHide?: any;
  disableFiltering?: boolean;
  disableSorting?: boolean;
}

declare interface IDataTableHeader {
  width: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  index?: number;
  hidden?: boolean;
  id: string;
  title: string;
  description?: string;
  field?: string;
  fieldType?: FormInputType;
  filterable?: boolean;
  isFiltered?: boolean;
  sortable?: boolean;
  isSorted?: boolean;
  sortDirection?: SortDirection;
  onSort?: (item: any) => any;
  onShow?: (header: IDataTableHeader) => any;
  onHide?: (header: IDataTableHeader) => any;
  onFilter?: (header: IDataTableHeader) => any;
  component?: any;
  onlyOnDrag?: boolean;
  onlyOnNoDrag?:boolean;
  collapsedWidth?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

declare interface IDataItemEvent {
  type: CrudActionType;
  fromIndex?: number;
  toIndex?: number;
  targetItemId?: string;
  itemId?: string;
  item?: any;
}

declare interface IDataItemEventConfig {
  onItemEvent?: (e: IDataItemEvent) => any;
  onItemDragEvent?: (e: IDataItemEvent) => any;
  onItemDragEndEvent?: (e?: IDataItemEvent) => any;
  onItemDropEvent?: (e: IDataItemEvent) => any;
  onDataChange?: <T>(data: T[]) => any;
  lastDragEvent?: IDataItemEvent;
  onChange?: any;
  onRemove?: any;
  onSelect?: any;
  onUpdate?: any;
}

declare interface IWidget {
  title: string;
  component: any;
}

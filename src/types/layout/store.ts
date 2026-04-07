import {Action, Thunk} from 'easy-peasy';
import {SortDirection} from "@material-ui/core";
import {IDataTableHeader, IDataTableView} from "~/types/data";

export interface ILayoutStoreModel {
  isLoading: boolean;
  loading: Action<ILayoutStoreModel, any>;
  onLoading: Thunk<ILayoutStoreModel, unknown>;
  currentRoute?: any;
  isSideBarOpen?: boolean;
  navigation?: { [key: string]: boolean };
  setCurrentRoute: Action<ILayoutStoreModel, any>;
  setNavigation: Action<ILayoutStoreModel, { [key: string]: boolean }>;
  toggleSideNavItem: Action<ILayoutStoreModel, any>;
  toggleSideNav: Action<ILayoutStoreModel, boolean>;
  lastDragEvent?: any;
  onDragEvent: Thunk<ILayoutStoreModel, unknown>;
  setLastDragEvent: Action<ILayoutStoreModel, unknown>;
  isDragging?: boolean;
  onDragging: Thunk<ILayoutStoreModel, unknown>;
  setDragging: Action<ILayoutStoreModel, unknown>;

  currentTableId?: string;
  onTableChange: Thunk<ILayoutStoreModel, unknown>;
  setCurrentTable: Action<ILayoutStoreModel, unknown>;
  sortByField?: string;
  sortDirection?: SortDirection;
  onSort: Thunk<ILayoutStoreModel, unknown>;
  setSorting: Action<ILayoutStoreModel, unknown>;
  selectedHeader?: IDataTableHeader;
  selectedView?: IDataTableView;
}

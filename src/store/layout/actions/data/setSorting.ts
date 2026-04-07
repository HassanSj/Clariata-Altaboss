import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setSorting: Action<ILayoutStoreModel, any> = action((state: any, payload: any) => {
  state.currentTableId = payload?.currentTableId;
  state.sortDirection = payload?.sortDirection;
  state.sortByField = payload?.sortByField;
  state.selectedHeader = payload?.selectedHeader;
  state.sortByFunction = payload?.sortByFunction
});

export default setSorting;

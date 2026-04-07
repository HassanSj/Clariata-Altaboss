import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setCurrentTable: Action<ILayoutStoreModel, any> = action((state: any, payload: any) => {
  state.currentTableId = payload?.currentTableId;
  state.sortDirection = payload?.sortDirection;
  state.sortByField = payload?.sortByField;
  state.selectedView = payload?.selectedView;
});

export default setCurrentTable;

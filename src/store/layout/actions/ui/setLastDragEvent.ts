import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setLastDragEvent: Action<ILayoutStoreModel, any> = action((state: any, payload: any) => {
  state.lastDragEvent = payload;
});

export default setLastDragEvent;

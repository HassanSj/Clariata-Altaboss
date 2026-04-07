import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setDragging: Action<ILayoutStoreModel, any> = action((state: any, payload: any) => {
  state.isDragging = payload;
});

export default setDragging;

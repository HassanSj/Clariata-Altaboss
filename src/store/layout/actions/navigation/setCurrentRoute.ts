import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setCurrentRoute: Action<ILayoutStoreModel, any> = action((state, payload) => {
  state.currentRoute = payload;
});

export default setCurrentRoute;

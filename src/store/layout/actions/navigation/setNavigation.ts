import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setNavigation: Action<ILayoutStoreModel, any> = action((state, payload) => {
  state.navigation = payload;
});

export default setNavigation;

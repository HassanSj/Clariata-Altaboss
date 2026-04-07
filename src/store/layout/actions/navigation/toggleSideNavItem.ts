import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const toggleSideNav: Action<ILayoutStoreModel, any> = action((state, payload) => {
  if (!state.navigation) {
    state.navigation = {};
  }
  state.navigation[payload.name] = !state.navigation[payload.name];
});

export default toggleSideNav;

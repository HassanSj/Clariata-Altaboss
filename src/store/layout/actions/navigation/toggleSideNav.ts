import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const toggleSideNav: Action<ILayoutStoreModel, undefined> = action((state, payload) => {
  state.isSideBarOpen = payload;
});

export default toggleSideNav;

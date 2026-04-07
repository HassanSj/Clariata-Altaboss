import initStore from './initStore';
import layoutActions from './actions';
import layoutThunks from './thunks';

const layout = {
  ...initStore,
  // actions
  ...layoutActions,
  // thunks
  ...layoutThunks
};

export default layout;

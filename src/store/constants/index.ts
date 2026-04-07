import initStore from './initStore';
import constantActions from './actions';
import constantThunks from './thunks';

const constants = {
  ...initStore,
  // actions
  ...constantActions,
  // thunks
  ...constantThunks,
};

export default constants;

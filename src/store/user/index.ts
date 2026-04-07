import initStore from './initStore';
import userActions from './actions';
import userThunks from './thunks';

const user = {
  ...initStore,
  // actions
  ...userActions,
  // thunks
  ...userThunks,
};

export default user;

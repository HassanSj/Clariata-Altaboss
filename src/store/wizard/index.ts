import initStore from './initStore';
import wizardActions from './actions';
import wizardThunks from './thunks';

const wizard = {
  ...initStore,
  // actions
  ...wizardActions,
  // thunks
  ...wizardThunks,
};

export default wizard;

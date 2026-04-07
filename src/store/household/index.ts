import initStore from './initStore';
import householdActions from './actions';
import householdThunks from './thunks';

const household = {
  ...initStore,
  // actions
  ...householdActions,
  // thunks
  ...householdThunks,
};

export default household;

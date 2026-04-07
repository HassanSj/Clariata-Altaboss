import initStore from './initStore';
import objectiveActions from './actions';
import objectiveThunks from './thunks';

const objective = {
  ...initStore,
  // actions
  ...objectiveActions,
  // thunks
  ...objectiveThunks,
};

export default objective;

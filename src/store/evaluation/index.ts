import initStore from './initStore';
import evaluationActions from './actions';
import evaluationThunks from './thunks';

const evaluation = {
  ...initStore,
  // actions
  ...evaluationActions,
  // thunks
  ...evaluationThunks,
};

export default evaluation;

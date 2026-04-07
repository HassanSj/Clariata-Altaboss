import initStore from './initStore';
import interviewActions from './actions';
import interviewThunks from './thunks';

const interview = {
  ...initStore,
  // actions
  ...interviewActions,
  // thunks
  ...interviewThunks,
};

export default interview;

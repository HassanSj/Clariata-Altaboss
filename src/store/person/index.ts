import initStore from './initStore';
import personActions from './actions';
import personThunks from './thunks';

const person = {
  ...initStore,
  // actions
  ...personActions,
  // thunks
  ...personThunks,
};

export default person;

import initStore from './initStore';
import contactActions from './actions';
import contactThunks from './thunks';

const contact = {
  ...initStore,
  // actions
  ...contactActions,
  // thunks
  ...contactThunks,
};

export default contact;
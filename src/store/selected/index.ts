import initStore from './initStore';
import selectedActions from './actions';
import selectedThunks from './thunks';

const selected = {
  ...initStore,
  // actions
  ...selectedActions,
  // thunks
  ...selectedThunks,
};

export default selected;

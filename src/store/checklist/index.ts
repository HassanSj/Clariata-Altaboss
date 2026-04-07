import initStore from './initStore';
import checklistActions from './actions';
import checklistThunks from './thunks';

const checklist = {
  ...initStore,
  // actions
  ...checklistActions,
  // thunks
  ...checklistThunks,
};

export default checklist;

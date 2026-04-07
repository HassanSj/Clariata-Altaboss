import initStore from './initStore';
import destinyActions from './actions';
import destinyThunks from './thunks';

const destiny = {
    ...initStore,
    // actions
    ...destinyActions,
    // thunks
    ...destinyThunks,
};

export default destiny;
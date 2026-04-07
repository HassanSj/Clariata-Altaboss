import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const login: Action<IUserStorageModel> = action(state => {
  state.authorized = true;
  state.authChecked = true;
});

export default login;

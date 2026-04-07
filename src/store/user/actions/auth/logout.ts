import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const logout: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.authorized = false;
});

export default logout;

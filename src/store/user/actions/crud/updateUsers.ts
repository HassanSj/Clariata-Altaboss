import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const updateUsers: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.users = payload;
});

export default updateUsers;
import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const populatePermissions: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.permissions = payload;
});

export default populatePermissions;

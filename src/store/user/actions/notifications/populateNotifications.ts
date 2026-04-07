import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const populateNotifications: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.notifications = payload;
});

export default populateNotifications;

import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const update: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.user = payload;
});

export default update;

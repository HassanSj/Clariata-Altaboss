import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const populate: Action<IUserStorageModel> = action((state: any, payload: any) => {
  console.log(payload);
  state.user = payload;
  state.UserTypeID = payload.UserTypeID
});

export default populate;
import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';

const populateSettings: Action<IUserStorageModel> = action((state: any, payload: any) => {
  state.settings = payload;
});

export default populateSettings;

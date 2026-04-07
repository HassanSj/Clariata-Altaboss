import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';
import {setAuthenticated} from "~/services/auth";

const changeAuth: Action<IUserStorageModel, boolean> = action((state, payload) => {
  setAuthenticated(payload);
  state.authorized = payload;
  state.authChecked = true;
});

export default changeAuth;

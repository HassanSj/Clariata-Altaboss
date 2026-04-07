import {thunk, Thunk} from 'easy-peasy';
import api from 'services/api';
import {IUserStorageModel} from 'types/user/store';
import {AxiosResponse} from "axios";
import {NextRouter} from "next/router";
import {getAccessToken, getSessionGUID, setAuthenticated} from "~/services/auth";
import store from "~/store";

interface IPayload {
  router: NextRouter;
}

const onCheckAuth: Thunk<IUserStorageModel, IPayload> = thunk(async ({ changeAuth }, payload, helpers) => {
  let authorized = false;
  try {
    const SessionGUID: string | null = getSessionGUID();
    const res: AxiosResponse = await api.session.get(SessionGUID);
    const token = Boolean(res?.data?.SessionGUID);
    const accessToken = getAccessToken();

    if (!accessToken) {
      // Delete session
      const sessionRes: AxiosResponse = await api.session.remove();
      // Change auth flags
      setAuthenticated(false);
      // Reset store
      // @ts-ignore
      store.dispatch.reset();
      // Set auth as false
      changeAuth(false);
      return;
    }

    authorized = true;
    changeAuth(true);
  } catch (err) {
    // Change auth flags
    setAuthenticated(false);
    // Reset store
    // @ts-ignore
    store.dispatch.reset();
    // Set auth as false
    changeAuth(false);
  }
  return authorized;
});

export default onCheckAuth;

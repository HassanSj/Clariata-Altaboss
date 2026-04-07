import {thunk, Thunk} from 'easy-peasy';
import {deleteAccessToken, setAuthenticated} from 'services/auth';
import {IUserStorageModel} from 'types/user/store';
import {AxiosResponse} from "axios";
import api from "~/services/api";
import paths from "~/ui/constants/paths";
import store from "~/store";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {IObjectiveDataType} from "~/types/objective/store";

const { LOGIN } = paths;

const onLogout: Thunk<IUserStorageModel> = thunk(async (actions: any, payload: any, helpers: any) => {
  try {
    // Delete session
    const res: AxiosResponse = await api.session.remove();
    // Change auth flags
    setAuthenticated(false);

    // @ts-ignore
    // const { selectedObjectiveIds } = store.getState().objective
    // const oldIds = JSON.parse(JSON.stringify(selectedObjectiveIds))

    // Clear
    // @ts-ignore
    //store.dispatch.reset();

    // const { onSelect } = store.getActions().objective;
    // onSelect({
    //   type: IObjectiveDataType.OBJECTIVE_IDS,
    //   objectiveIds: oldIds
    // });

    // Actions
    actions.logout(null);
    //store.dispatch.reset(null);
    // Forward to login
    payload.router.replace(LOGIN);
  } catch (err) {
    throw Error(err);
  }
});

export default onLogout;

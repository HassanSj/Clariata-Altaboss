import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';

interface IProps {
  householdId: number;
}

const onPopulateUsers: Thunk<IUserStorageModel, unknown> = thunk(async ({ updateUsers }, payload: IProps) => {
  try {
    const res: AxiosResponse = await api.user.list(payload.householdId);
    updateUsers(res.data);
  } catch (err) {
    processServerError(err, 'user.crud.onPopulate');
  }
});

export default onPopulateUsers;
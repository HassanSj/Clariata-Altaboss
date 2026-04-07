import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';
import { getAccessToken } from '~/services/auth';


const onPopulate: Thunk<IUserStorageModel, unknown> = thunk(async ({ populate }, payload) => {
  try {
    const res: AxiosResponse = await api.user.get();
    populate(res.data);
  } catch (err) {
    processServerError(err, 'user.crud.onPopulate');
  }
});

export default onPopulate;

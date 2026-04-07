import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';

const onPopulateSettings: Thunk<IUserStorageModel, unknown> = thunk(async ({ populateSettings }, payload) => {
  try {
    const res: AxiosResponse = await api.user.listSettings();
    populateSettings(res.data);
  } catch (err) {
    processServerError(err, 'user.settings.onPopulateSettings');
  }
});

export default onPopulateSettings;

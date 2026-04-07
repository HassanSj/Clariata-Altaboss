import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';

const onPopulateNotifications: Thunk<IUserStorageModel, unknown> = thunk(async ({ populateNotifications }, payload, helpers) => {
  try {
    const res: AxiosResponse = await api.notification.list();
    populateNotifications(res.data);
  } catch (err) {
    processServerError(err, 'user.settings.onPopulateNotifications');
  }
});

export default onPopulateNotifications;

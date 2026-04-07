import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';
import {Notification} from "~/types/api/notification";

interface IProps {
  notification: Notification;
}

const onUpdateNotification: Thunk<IUserStorageModel, IProps> = thunk(async ({ updateNotification }, payload: IProps, helpers) => {
  try {
    const res: AxiosResponse = await api.notification.update(payload.notification.NotificationID, payload.notification);
    updateNotification(res.data);
  } catch (err) {
    processServerError(err, 'user.settings.onPopulatePermissions');
  }
});

export default onUpdateNotification;

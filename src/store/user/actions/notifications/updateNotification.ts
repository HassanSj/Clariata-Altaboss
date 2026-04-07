import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';
import {Notification} from "~/types/api/notification";
import {hasItems} from "~/ui/constants/utils";

interface IProps {
  notification: Notification;
}

const updateNotification: Action<IUserStorageModel, IProps> = action((state: any, payload: IProps) => {
  const index = state?.notifications?.findIndex((n: Notification) => n.NotificationID === payload?.notification?.NotificationID);
  if (index > -1) {
    state.notifications[index] = payload.notification;
  } else {
    if (!hasItems(state.notifications)) state.notifications = [];
    state.notifications.push(payload.notification);
  }

});

export default updateNotification;

import {NotificationType} from "~/ui/constants/notifications";
import {Notification} from "~/types/api/notification";

declare interface NotificationContextType {
  isLoading: boolean,
  loadingMessage: string | undefined | null,
  toggleLoading: (show: boolean, message?: string) => void,
  notifications: UINotification[] | undefined | null,
  addNotification: (n: UINotification) => void,
  addInfoNotification: (message: string) => void,
  addSuccessNotification: (message: string) => void,
  addErrorNotification: (message: string) => void,
  addWarningNotification: (message: string) => void,
  removeNotification: (id: string) => void,
  clearNotifications: () => void,

  addServerNotification: (n: Notification) => void,
  removeServerNotification: (id: number) => void,
  clearServerNotifications: () => void,
}

declare interface UINotification {
  id?: string;
  type: NotificationType;
  header?: string;
  message: string;
}

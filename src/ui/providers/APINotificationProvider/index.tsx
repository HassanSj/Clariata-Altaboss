import React, {useCallback, useState} from 'react';
import {NotificationContextType, UINotification} from "~/types/notifications";
import Notification from "~/ui/components/Notification";
import {hasItems} from "~/ui/constants/utils";
import {uniqueId} from 'lodash';
import {NotificationType} from "~/ui/constants/notifications";
import Loader from "~/ui/components/Loader";
import {Notification as ServerNotification} from "~/types/api/notification";

export const APINotificationContext = React.createContext<NotificationContextType>({
  isLoading: false,
  loadingMessage: null,
  toggleLoading: () => undefined,
  notifications: null,
  addNotification: () => undefined,
  addInfoNotification: () => undefined,
  addSuccessNotification: () => undefined,
  addWarningNotification: () => undefined,
  addErrorNotification: () => undefined,
  removeNotification: () => undefined,
  clearNotifications: () => undefined,

  addServerNotification: () => undefined,
  removeServerNotification: () => undefined,
  clearServerNotifications: () => undefined,
});

interface IProps {
  children: React.ReactNode;
}

const APINotificationProvider = ({ children }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [notifications, setNotifications] = useState<UINotification[] | undefined>();
  const [serverNotifications, setServerNotifications] = useState<ServerNotification[] | undefined>();

  const toggleLoading = (show: boolean, message?: string) => {
    setLoading(show);
    setLoadingMessage(message);
  }
  const addNotification = (n: UINotification) => {
    if (n) {
      n.id = uniqueId();
    }

    const newNotifications: UINotification[] = [n];
    if (notifications) {
      newNotifications.push(...notifications);
    }

    setNotifications(newNotifications);
  };
  const addInfoNotification = (message: string) => {
    addNotification({
      type: NotificationType.INFO,
      message
    })
  }
  const addSuccessNotification = (message: string) => {
    addNotification({
      type: NotificationType.SUCCESS,
      message
    })
  }
  const addErrorNotification = (message: string) => {
    addNotification({
      type: NotificationType.ERROR,
      message
    })
  }
  const addWarningNotification = (message: string) => {
    addNotification({
      type: NotificationType.WARNING,
      message
    })
  }
  const removeNotification = (id: string) => {
    if (!notifications) {
      return;
    }
    setNotifications(notifications.filter((n: UINotification) => n.id !== id));
  };
  const clearNotifications = () => setNotifications(undefined);

  const addServerNotification = (n: ServerNotification) => {
    const newNotifications: ServerNotification[] = [n];
    if (serverNotifications) {
      newNotifications.push(...serverNotifications);
    }
    setServerNotifications(newNotifications);
  };
  const removeServerNotification = (id: number) => {
    if (!serverNotifications) {
      return;
    }
    setServerNotifications(serverNotifications.filter((n: ServerNotification) => n.NotificationID !== id));
  };
  const clearServerNotifications = () => setNotifications(undefined);

  const contextValue = {
    isLoading: loading,
    loadingMessage,
    toggleLoading: useCallback((show: boolean, message?: string) => toggleLoading(show, message), []),
    notifications,
    addNotification: useCallback((n: UINotification) => addNotification(n), []),
    addInfoNotification: useCallback((message: string) => addInfoNotification(message), []),
    addSuccessNotification: useCallback((message: string) => addSuccessNotification(message), []),
    addErrorNotification: useCallback((message: string) => addErrorNotification(message), []),
    addWarningNotification: useCallback((message: string) => addWarningNotification(message), []),
    removeNotification: useCallback((id: string) => removeNotification(id), []),
    clearNotifications: useCallback(() => clearNotifications(), []),

    addServerNotification: useCallback((n: ServerNotification) => addServerNotification(n), []),
    removeServerNotification: useCallback((id: number) => removeServerNotification(id), []),
    clearServerNotifications: useCallback(() => clearServerNotifications(), []),
  }

  return (
    <APINotificationContext.Provider value={contextValue}>
      {hasItems(notifications) ? notifications?.map((notification: any, index: number) => {
        return (
          <Notification key={notification.id} notification={notification} />
        )
      }) : null }
      {hasItems(serverNotifications) ? serverNotifications?.map((notification: any, index: number) => {
        return (
          <Notification key={notification.id} serverNotification={notification} />
        )
      }) : null }
      {loading ?
        <Loader message={loadingMessage} />
      : null }
      {children}
    </APINotificationContext.Provider>
  )
};

export default APINotificationProvider;

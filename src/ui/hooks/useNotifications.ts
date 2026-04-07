import {useContext} from 'react';
import {APINotificationContext} from "~/ui/providers/APINotificationProvider";

const useNotifications = () => {
  const {
    isLoading,
    toggleLoading,
    notifications,
    addNotification,
    addInfoNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    removeNotification,
    clearNotifications
  } = useContext(APINotificationContext);

  return {
    isLoading,
    toggleLoading,
    notifications,
    addNotification,
    addInfoNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    removeNotification,
    clearNotifications
  };
};

export default useNotifications;
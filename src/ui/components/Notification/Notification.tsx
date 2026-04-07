import React, {ReactElement, ReactNode, useEffect} from 'react';
import {UINotification} from "~/types/notifications";
import {Notification as ServerNotification} from "~/types/api/notification";
import {Icon, Snackbar} from "@material-ui/core";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import {NotificationType} from "~/ui/constants/notifications";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface IProps {
  notification?: UINotification;
  serverNotification?: ServerNotification;
}

interface NotificationProps {
  severity: "success" | "error" | "warning" | "info";
  icon: ReactNode;
  anchorOrigin: any;
}

const Notification = ({ notification, serverNotification }: IProps): ReactElement => {
  const [open, setOpen] = React.useState(true);
  const [notificationProps, setNotificationProps] = React.useState<NotificationProps | null | undefined>();
  const [standardizedNotification, setStandardizedNotification] = React.useState({
    message: notification ? notification.message : serverNotification?.Message
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const init = () => {
      if (notification && notification?.type) {
        const origin = {
          vertical: 'bottom',
          horizontal: 'center'
        };
        switch(+notification.type){
          case NotificationType.INFO:
            setNotificationProps({
              severity: "info",
              icon: <Icon>notifications</Icon>,
              anchorOrigin: origin
            });
            break;
          case NotificationType.SUCCESS:
            setNotificationProps({
              severity: "success",
              icon: <Icon>check_circle</Icon>,
              anchorOrigin: origin
            });
            break;
          case NotificationType.ERROR:
            setNotificationProps({
              severity: "error",
              icon: <Icon>error</Icon>,
              anchorOrigin: origin
            });
            break;
          case NotificationType.WARNING:
            setNotificationProps({
              severity: "warning",
              icon: <Icon>warning</Icon>,
              anchorOrigin: origin
            });
            break;
        }
      } else if (serverNotification) {
        setNotificationProps({
          severity: "info",
          icon: <Icon>notifications</Icon>,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      }
    };
    init();
  }, []);

  return (
    <>
      { notificationProps && notificationProps.severity && notificationProps.icon ?
        <Snackbar anchorOrigin={notificationProps.anchorOrigin}
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}>
          <Alert onClose={handleClose}
                 icon={notificationProps.icon}
                 severity={notificationProps.severity}>
            { standardizedNotification?.message }
          </Alert>
        </Snackbar>
      : null }
    </>
  )
}

export default Notification;

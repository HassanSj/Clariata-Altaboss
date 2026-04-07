import React, {ReactElement, useEffect} from "react";
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
  errors?: IErrorProps;
}

interface IErrorProps {
  infoMessage?: string;
  successMessage?: string;
  backError?: string;
}

const FormNotification = ({ errors } : IProps): ReactElement => {
  const notifications = useNotifications();

  useEffect(() => {
    const init = () => {
      if (errors?.infoMessage) {
        notifications.addInfoNotification(errors?.infoMessage);
      }
      if (errors?.successMessage) {
        notifications.addSuccessNotification(errors?.successMessage);
      }
      if (errors?.backError) {
        notifications.addErrorNotification(errors?.backError);
      }
    };
    init();
  }, []);

  return (
    <>
    </>
  )
}

export default FormNotification;
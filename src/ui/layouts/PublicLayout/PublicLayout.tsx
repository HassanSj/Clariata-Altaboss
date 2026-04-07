import React, {ReactElement} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import classnames from 'classnames';
import styles from './PublicLayout.module.scss';
import Loader from "~/ui/components/Loader";
import {delay} from 'lodash';
import {Router, useRouter} from "next/router";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import paths from "~/ui/constants/paths";
import {setupLogging} from "~/ui/constants/utils";

interface IProps {
  children: React.ReactNode;
}

const { DASHBOARD } = paths;

const PublicLayout = ({ children }: IProps): ReactElement => {
  const router = useRouter();
  const notifications = useNotifications();
  const { isLoading } = useStoreState(state => state.layout);
  const { authorized } = useStoreState(state => state.user);
  const onLoading = useStoreActions(actions => actions.layout.onLoading);

  useMountEvents({
    onMounted: async () => {
      // Loading events
      Router.events.on('routeChangeStart', () => notifications.toggleLoading(true));
      Router.events.on('routeChangeComplete', () => notifications.toggleLoading(false));
      Router.events.on('routeChangeError', () => notifications.toggleLoading(false));

      // Need to reset in case loading was persisted as true
      if (isLoading){
        delay( () => onLoading(false), 5000 );
        // TODO - need to test this
      }

      // Setup logging
      setupLogging();

      // Forward user to dashboard if already logged in
      if (authorized) {
        // router.push(DASHBOARD);
      }
    },
  });

  return (
    <div className={classnames(styles.root)}>
      <CssBaseline />
      <main className={classnames(styles.content)}>
        <div className={classnames(styles.content_container)}>
          <div>{children}</div>
        </div>
      </main>
      {isLoading ? <Loader /> : null}
    </div>
  );
};

export default PublicLayout;

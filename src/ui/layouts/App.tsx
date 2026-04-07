import React, {ReactElement, useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Container} from '@material-ui/core';
import classnames from 'classnames';

import Header from '../components/Header';
import Footer from '../components/Footer';

import styles from './App.module.scss';
import Loader from "~/ui/components/Loader";
import {delay} from 'lodash';
import {Router, useRouter} from "next/router";
import {useStoreActions, useStoreState} from "~/store/hooks";
import NavBreadcrumbs from "~/ui/components/NavBreadcrumbs";
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
  children: React.ReactNode;
}

// We call authentication check in this component
// because it will be done here only once time (on app load)
// Authentication is working on client side
const AppLayout = ({ children }: IProps): ReactElement => {
  const notifications = useNotifications();
  const router = useRouter();
  const { isLoading } = useStoreState(state => state.layout);
  const { authorized } = useStoreState(state => state.user);
  const onCheckAuth = useStoreActions(actions => actions.user.onCheckAuth);
  const onLoading = useStoreActions(actions => actions.layout.onLoading);
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {

    // Loading events
    Router.events.on('routeChangeStart', () => notifications.toggleLoading(true));
    Router.events.on('routeChangeComplete', () => notifications.toggleLoading(false));
    Router.events.on('routeChangeError', () => notifications.toggleLoading(false));

    // Need to reset in case loading was persisted as true
    if (isLoading){
      delay( () => onLoading(false), 5000 );
      // TODO - need to test this
    }
    // Run initial auth check on page load
    const checkAuth = async () => {
      await onCheckAuth({
        router
      });
    };
    checkAuth();

  }, []);

  return (
    <div className={classnames(styles.root)}>
      <CssBaseline />
      {authorized && <Header />}
      <main className={classnames(styles.content)}>
        <div className={classnames(styles.content_container)}>
          <Container maxWidth={false}>
            App test
            {/* {authorized && <NavBreadcrumbs />} */}
            {!isLoading ?
            <div>{children}</div>
            : null }
          </Container>
        </div>
      </main>
      {authorized && <Footer />}
      {isLoading ? <Loader /> : null}
    </div>
  );
};

export default AppLayout;

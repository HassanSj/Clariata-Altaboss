import React, { ElementType, ReactElement } from 'react';
import { useRouter } from 'next/router';
import paths from '~/ui/constants/paths';
import { useStoreState } from '~/store/hooks';
import { isAuthenticated } from '~/services/auth';

const { LOGIN } = paths;

// Using HOC component
const withPrivateRoute =
  (WrappedComponent: ElementType) =>
  (props: unknown): ReactElement | null => {
    const router = useRouter();
    //const authorized = useStoreState(state => state.user.authorized);
    const authorized = isAuthenticated();
    //const authChecked = useStoreState(state => state.user.authChecked);
    const authChecked = isAuthenticated();

    console.info(`authChecked => ${isAuthenticated()}`);
    console.info(`authorized => ${isAuthenticated()}`);

    if (!isAuthenticated()) {
      router.push(LOGIN);
      return null;
    }

    return <WrappedComponent {...props} />;
  };

export default withPrivateRoute;

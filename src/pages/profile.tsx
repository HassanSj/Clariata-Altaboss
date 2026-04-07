import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Profile from "~/ui/pages/Profile";

const Component = withPrivateRoute(Profile);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const ProfilePage = (): ReactElement => (
  <div>
    <Head>
      <title>Profile</title>
      <meta name="description" content="Profile"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default ProfilePage;

import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Loader from '~/ui/components/Loader';
import Settings from '~/ui/pages/Settings';
import withPrivateRoute from "~/ui/routes/withPrivateRoute";

const Component = withPrivateRoute(Settings);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const SettingsPage = (): ReactElement => (
  <>
    <Head>
      <title>Settings</title>
      <meta name="description" content="Settings" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

export default SettingsPage;

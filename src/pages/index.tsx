import React, {ReactElement} from 'react';
import dynamic from 'next/dynamic';
import Loader from '~/ui/components/Loader';
import withPrivateRoute from "~/ui/routes/withPrivateRoute";
import Dashboard from "~/ui/pages/Dashboard";
import Head from "next/head";

const Component = withPrivateRoute(Dashboard);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const HomePage = (): ReactElement => (
  <div>
    <Head>
      <title>Dashboard</title>
      <meta name="description" content="Dashboard"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default HomePage;
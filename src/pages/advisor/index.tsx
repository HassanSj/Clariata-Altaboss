import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Advisor from "~/ui/pages/Advisor";

const Component = withPrivateRoute(Advisor);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const AdvisorDashboardPage = (): ReactElement => (
  <div>
    <Head>
      <title>Dashboard</title>
      <meta name="description" content="Dashboard"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default AdvisorDashboardPage;
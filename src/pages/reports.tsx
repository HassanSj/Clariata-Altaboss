import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Reports from "~/ui/pages/Reports";

const Component = withPrivateRoute(Reports);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const ReportsPage = (): ReactElement => (
  <div>
    <Head>
      <title>Reports</title>
      <meta name="description" content="Reports"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default ReportsPage;

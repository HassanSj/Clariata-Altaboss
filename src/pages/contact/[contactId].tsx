import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Contact from "~/ui/pages/Contact";

const Component = withPrivateRoute(Contact);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const DashboardPage = (): ReactElement => (
  <div>
    <Head>
      <title>Contact</title>
      <meta name="description" content="Contact"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default DashboardPage;

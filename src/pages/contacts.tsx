import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Contacts from "~/ui/pages/Contacts";

const Component = withPrivateRoute(Contacts);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const DashboardPage = (): ReactElement => (
  <div>
    <Head>
      <title>Contacts</title>
      <meta name="description" content="Contacts"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default DashboardPage;

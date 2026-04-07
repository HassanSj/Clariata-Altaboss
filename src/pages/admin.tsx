import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Admin from "~/ui/pages/Admin";

const Component = withPrivateRoute(Admin);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const AdminPage = (): ReactElement => (
  <div>
    <Head>
      <title>Administration Area</title>
      <meta name="description" content="Admin"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default AdminPage;
import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import DestinyAdmin from '~/ui/components/Admin/DestinyAdmin';

const Component = withPrivateRoute(DestinyAdmin);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminDestiny = (): ReactElement => (
  <div>
    <Head>
      <title>Destiny Global Items</title>
      <meta name="description" content="Destiny Items" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminDestiny;
import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';

import Firms from '~/ui/components/Admin/Firms';

const Component = withPrivateRoute(Firms);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminFirms = (): ReactElement => (
  <div>
    <Head>
      <title>Firms</title>
      <meta name="description" content="FirmsList" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminFirms;
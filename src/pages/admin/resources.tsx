import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';

import RegistrationCodeList from '~/ui/components/Admin/Resources/ResourcesTable';

const Component = withPrivateRoute(RegistrationCodeList);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminResources = (): ReactElement => (
  <div>
    <Head>
      <title>Resources</title>
      <meta name="description" content="List of Resources" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminResources;
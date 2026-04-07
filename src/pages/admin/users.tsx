import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';

import UsersList from '~/ui/components/Admin/AdminUsers/UsersList';

const Component = withPrivateRoute(UsersList);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminUsers = (): ReactElement => (
  <div>
    <Head>
      <title>Users List</title>
      <meta name="description" content="UsersList" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminUsers;

import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';

import RegistrationCodeList from '~/ui/components/Admin/RegistrationCodes/RegistrationCodeList';

const Component = withPrivateRoute(RegistrationCodeList);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminRegistrationCodes = (): ReactElement => (
  <div>
    <Head>
      <title>Registration Codes</title>
      <meta name="description" content="UsersList" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminRegistrationCodes;
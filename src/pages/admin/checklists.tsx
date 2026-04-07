import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';

import Checklists from '~/ui/components/Admin/Checklists/Checklists';

const Component = withPrivateRoute(Checklists);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminChecklists = (): ReactElement => (
  <div>
    <Head>
      <title>Checklists</title>
      <meta name="description" content="Checklist panel" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminChecklists;
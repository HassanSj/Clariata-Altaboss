import React, { ReactElement } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import DestinySubcategory from '~/ui/components/Admin/DestinySubcategory';

const Component = withPrivateRoute(DestinySubcategory);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const AdminSubcategory = (): ReactElement => (
  <div>
    <Head>
      <title>Destiny Subcategories</title>
      <meta name="description" content="Destiny Subcategories" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default AdminSubcategory;
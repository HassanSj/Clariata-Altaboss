import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Loader from '~/ui/components/Loader';

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => import('~/ui/pages/PageNotFound'), {
  ssr: false,
  loading,
});

const Error404 = (): ReactElement => (
  <div>
    <Head>
      <title>Page Not Found</title>
      <meta name="description" content="Page Not Found" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default Error404;

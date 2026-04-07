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

const Error = (): ReactElement => (
  <div>
    <Head>
      <title>Error page</title>
      <meta name="description" content="Error page" />
    </Head>
    <DynamicComponentWithNoSSR />
  </div>
);

export default Error;

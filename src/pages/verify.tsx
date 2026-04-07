import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Verify from '~/ui/pages/Verify';

const Component = withPublicRoute(Verify);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const VerificationPage = (): ReactElement => (
  <>
    <Head>
      <title>Verify</title>
      <meta name="description" content="Verify" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

export default VerificationPage;

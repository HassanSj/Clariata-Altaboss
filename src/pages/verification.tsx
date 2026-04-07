import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Verification from '~/ui/pages/Verification';

const Component = withPublicRoute(Verification);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const VerificationPage = (): ReactElement => (
  <>
    <Head>
      <title>Resend Verification</title>
      <meta name="description" content="Resend verification" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

export default VerificationPage;

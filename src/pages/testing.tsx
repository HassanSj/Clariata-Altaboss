import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Loader from '~/ui/components/Loader';
import Testing from '~/ui/pages/Testing';
import withPrivateRoute from "~/ui/routes/withPrivateRoute";

const Component = withPrivateRoute(Testing);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const TestingPage = (): ReactElement => (
  <>
    <Head>
      <title>Testing</title>
      <meta name="description" content="Testing Clariata" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

export default TestingPage;

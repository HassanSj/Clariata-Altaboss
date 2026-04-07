import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Priorities from "~/ui/pages/Direction/Priorities";

const Component = withPrivateRoute(Priorities);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const PrioritiesPage = (): ReactElement => (
  <div>
    <Head>
      <title>Direction Priorities</title>
      <meta name="description" content="Direction Priorities"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default PrioritiesPage;

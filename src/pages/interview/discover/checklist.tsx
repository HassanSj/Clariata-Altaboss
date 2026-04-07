import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import DiscoverChecklist from "~/ui/pages/Interview/DiscoverChecklist";

const Component = withPrivateRoute(DiscoverChecklist);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const DiscoverChecklistPage = (): ReactElement => (
  <div>
    <Head>
      <title>Discover Checklist</title>
      <meta name="description" content="Discover Checklist"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default DiscoverChecklistPage;

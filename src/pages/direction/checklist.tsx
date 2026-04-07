import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import DirectionChecklist from "~/ui/pages/Direction/Checklist";

const Component = withPrivateRoute(DirectionChecklist);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const ChecklistPage = (): ReactElement => (
  <div>
    <Head>
      <title>Direction Checklist</title>
      <meta name="description" content="Direction Checklist"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default ChecklistPage;

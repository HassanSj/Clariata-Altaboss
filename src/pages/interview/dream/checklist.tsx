import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import DreamChecklist from '~/ui/pages/Interview/DreamChecklist';

const Component = withPrivateRoute(DreamChecklist);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const DreamChecklistPage = (): ReactElement => (
  <div>
    <Head>
      <title>Dream Checklist</title>
      <meta name="description" content="Dream Checklist"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default DreamChecklistPage;

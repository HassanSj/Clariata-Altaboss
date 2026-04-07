import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Evaluations from "~/ui/pages/Evaluations";

const Component = withPrivateRoute(Evaluations);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const EvaluationsPage = (): ReactElement => (
  <div>
    <Head>
      <title>Evaluations</title>
      <meta name="description" content="Evaluations"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default EvaluationsPage;

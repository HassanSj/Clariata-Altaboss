import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Evaluation from "~/ui/pages/Evaluation/Evaluation";

const Component = withPrivateRoute(Evaluation);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const EvaluationPage = (): ReactElement => (
  <div>
    <Head>
      <title>Evaluation</title>
      <meta name="description" content="Evaluation Wizard"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default EvaluationPage;

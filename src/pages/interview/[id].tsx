import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Interview from "~/ui/pages/Interview/Interview";

const Component = withPrivateRoute(Interview);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const InterviewPage = (): ReactElement => (
  <div>
    <Head>
      <title>Interview</title>
      <meta name="description" content="Interview Wizard"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default InterviewPage;

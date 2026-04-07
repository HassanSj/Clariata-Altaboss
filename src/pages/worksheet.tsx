import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import ProfileWorksheet from '~/ui/components/ProfileWorksheet';

const Component = withPrivateRoute(ProfileWorksheet);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading
});

const Worksheet = (): ReactElement => (
  <div>
    <Head>
      <title>Profile Worksheet</title>
      <meta name="description" content="Profile Worksheet"/>
    </Head>
    <DynamicComponentWithNoSSR/>
  </div>
);

export default Worksheet;

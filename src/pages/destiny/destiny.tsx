import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Destiny from '~/ui/pages/Destiny/Destiny';

const Component = withPublicRoute(Destiny);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const DestinyPage = (): ReactElement => (
  <>
    <Head>
      <title>Destiny</title>
      <meta name="description" content="Destiny" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

export default DestinyPage;

import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Deepen from '~/ui/pages/DeepenV2/Deepen';

const Component = withPrivateRoute(Deepen);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading
});

const DeepenPage = (): ReactElement => (
    <div>
        <Head>
            <title>Deepen</title>
            <meta name="description" content="Dashboard"/>
        </Head>
        <DynamicComponentWithNoSSR/>
    </div>
);

export default DeepenPage;
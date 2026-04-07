import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import { ResourcesList } from '~/ui/components/Resource/ResourcesList';

const Component = withPrivateRoute(ResourcesList);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading
});

const ResourcePage = (): ReactElement => (
    <div>
        <Head>
            <title>Resources</title>
            <meta name="description" content="Dashboard"/>
        </Head>
        <DynamicComponentWithNoSSR/>
    </div>
);

export default ResourcePage;
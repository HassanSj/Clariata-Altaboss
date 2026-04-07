
import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Dashboard from '~/ui/pages/Dashboard';
import Timeline from '~/ui/components/Timeline'

const Component = withPrivateRoute(Timeline);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading
});

const TimelinePage = (): ReactElement => (
    <div>
        <Head>
            <title>Timeline</title>
            <meta name="description" content="Timeline"/>
        </Head>
        <DynamicComponentWithNoSSR/>
    </div>
);

export default TimelinePage;

import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPrivateRoute from '~/ui/routes/withPrivateRoute';
import Loader from '~/ui/components/Loader';
import Dashboard from '~/ui/pages/Dashboard';
import Timeline from '~/ui/components/Timeline'
import CustomEvents from '~/ui/components/CustomEvents';

const Component = withPrivateRoute(CustomEvents);

const loading = () => <Loader/>;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading
});

const CustomTimelineEvents = (): ReactElement => (
    <div>
        <Head>
            <title>Custom Events</title>
            <meta name="description" content="Custom Events"/>
        </Head>
        <DynamicComponentWithNoSSR/>
    </div>
);

export default CustomTimelineEvents;
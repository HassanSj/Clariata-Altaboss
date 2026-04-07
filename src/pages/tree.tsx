import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Loader from '~/ui/components/Loader';
import withPrivateRoute from "~/ui/routes/withPrivateRoute";
import RelationshipTree from "~/ui/components/Contact/RelationshipTree";

const Component = withPrivateRoute(RelationshipTree);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading,
});

const TreePage = (): ReactElement => {
    return (

        <>
            <Head>
                <title>Family Tree</title>
                <meta name="description" content="Family Tree" />
            </Head>
            <DynamicComponentWithNoSSR />
        </>
    )
};

export default TreePage;

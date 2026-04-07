import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Login from '~/ui/pages/Login';
import PublicLayout from "~/ui/layouts/PublicLayout";

const Component = withPublicRoute(Login);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const LoginPage = (): ReactElement => (
  <>
    <Head>
      <title>Sign In</title>
      <meta name="description" content="Sign In to Clariata" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

LoginPage.Layout = PublicLayout;

export default LoginPage;

import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Register from '~/ui/pages/Register';
import PublicLayout from "~/ui/layouts/PublicLayout";

const Component = withPublicRoute(Register);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const RegisterPage = (): ReactElement => (
  <>
    <Head>
      <title>Register</title>
      <meta name="description" content="Register with Clariata" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

RegisterPage.Layout = PublicLayout;

export default RegisterPage;

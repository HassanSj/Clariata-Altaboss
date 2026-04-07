import React, {ReactElement} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import withPublicRoute from '~/ui/routes/withPublicRoute';
import Loader from '~/ui/components/Loader';
import Password from '~/ui/pages/Password';
import PublicLayout from "~/ui/layouts/PublicLayout";

const Component = withPublicRoute(Password);

const loading = () => <Loader />;
loading.displayName = 'Loader';

const DynamicComponentWithNoSSR = dynamic(() => Promise.resolve(Component), {
  ssr: false,
  loading,
});

const PasswordPage = (): ReactElement => (
  <>
    <Head>
      <title>Reset Password</title>
      <meta name="description" content="Reset Password" />
    </Head>
    <DynamicComponentWithNoSSR />
  </>
);

PasswordPage.Layout = PublicLayout;

export default PasswordPage;

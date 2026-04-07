import AdminWrapper from "~/ui/components/Admin/AdminWrapper";
import {AdminNavigationTab, AdminNavigationTabs} from "~/ui/constants/navigations";
import React from "react";
import {Grid,} from '@material-ui/core';
import { Router, useRouter } from "next/router";


const Admin = () => {

  const router = useRouter();

  

  return (
      <AdminWrapper tab={AdminNavigationTab.HOME}>
        Admin Area
      </AdminWrapper>
  )
}

export default Admin;
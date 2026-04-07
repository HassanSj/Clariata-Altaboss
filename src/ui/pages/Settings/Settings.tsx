import React from 'react';
import EditUser from "~/ui/components/User/EditUser";
import {Grid} from "@material-ui/core";
import SharingList from "~/ui/components/Sharing/SharingList";
import SignInHistory from "~/ui/components/User/SignInHistory";
import OrganizationList from "~/ui/components/Organization/OrganizationList";
import ChangeUserPassword from '~/ui/components/User/ChangeUserPassword';
import Team from '~/ui/components/Team/Team';
import { useStoreState } from '~/store/hooks';

const Settings = () => {
  const { UserTypeID } = useStoreState((state) => state.user);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <EditUser />
          
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid xs={12} item>
              <ChangeUserPassword />
            </Grid>
            {(UserTypeID == 1 || UserTypeID == 3) ?
              <Grid xs={12} item>
                <Team />
              </Grid>
            : null }
          </Grid>
          
          {/* <SharingList />
          <br /> */}
          {/* <OrganizationList />
          <br /> */}
          {/* <SignInHistory /> */}
        </Grid>     
      </Grid>
    </>
  );
};

export default Settings;

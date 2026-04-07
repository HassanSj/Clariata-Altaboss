import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import {NavigationTab} from "~/ui/constants/navigations";
import React from "react";
import { Grid} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import ProfileDetailsHeader from "~/ui/pages/Profile/components/ProfileDetailsHeader";
import {PersonType} from "~/ui/constants/api";
import ProfileFamilyMembers from "~/ui/pages/Profile/components/ProfileFamilyMembers";
import useHousehold from "~/ui/hooks/useHousehold";
import { Household } from "~/types/api/household";

const Profile = () => {
    //const { selectedHousehold } = useStoreState(state => state.household);
    const { persons } = useStoreState(state => state.person);
    const { household } = useHousehold();

    const primaryContacts = persons?.filter(person => person.PersonTypeID === PersonType.PRIMARY) ?? []

    return (
        <DashboardWrapper tab={NavigationTab.PROFILE}>
            <Grid container key={household?.HouseholdID}>
                <ProfileDetailsHeader
                    primaryContacts={primaryContacts}
                    household={household as Household}
                />
                <ProfileFamilyMembers
                    household={household as Household}
                    primaryContacts={primaryContacts}
                    contacts={persons}
                />
            </Grid>
        </DashboardWrapper>
    )
}



export default Profile;
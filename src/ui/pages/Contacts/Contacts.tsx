import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import {NavigationTab} from "~/ui/constants/navigations";
import React from "react";
import BrowseContacts from "~/ui/components/Contact/BrowseContacts";
import { Router, useRouter } from "next/router";
import { useStoreState } from "~/store/hooks";

const Contacts = () => {

  const router = useRouter();

  const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);

  return (
    <>
      <DashboardWrapper tab={NavigationTab.CONTACTS}>
          <BrowseContacts selectedHouseholdId={householdId} />
      </DashboardWrapper>

    </>
  )
}

export default Contacts;
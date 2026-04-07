import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import {NavigationTab} from "~/ui/constants/navigations";
import React, { useEffect, ReactElement } from "react";
import { useStoreActions, useStoreState } from "~/store/hooks";
import { OwnerType } from "~/ui/constants/api";
import ContactCard from "~/ui/components/Contact/ContactCard";
import { useRouter } from "next/router";
import useNotifications from "~/ui/hooks/useNotifications";
import {Person} from "~/types/api/person";

interface IProps {
  person: Person
}

const Contact =({ person }: IProps): ReactElement => {

  const router = useRouter();
  const notifications = useNotifications();
  const { onSelect } = useStoreActions(actions => actions.person);
  
  const { persons } = useStoreState((state) => state.person);
  let currentPersonID  = Number(router.query.contactId);
  person  = persons.filter((e) => e.PersonID === currentPersonID)[0];

  const closeEdit = () => {
    console.log('Close');
  }

  const showEdit = () => {
    console.log('Show');
  }

  useEffect(() => {
    const select = async () => {
      notifications.toggleLoading(true);
      await onSelect({
        person
      });
      notifications.toggleLoading(false);
    }

    select();
    
  }, []);

  return (
    <>
      <DashboardWrapper tab={NavigationTab.CONTACT}>
        <ContactCard person={person} ownerType={OwnerType.PERSON} closeEdit={closeEdit} showEdit={showEdit}/>
      </DashboardWrapper>

    </>
  )
}

export default Contact;
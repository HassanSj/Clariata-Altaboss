import React, { ReactElement } from 'react';
import styles from './BrowseContactsItem.module.scss';
import classnames from 'classnames';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { Person } from "~/types/api/person";
import { useStoreActions, useStoreState } from "~/store/hooks";
import { getFullName, getPersonTypeEnum, getPhotoSrc } from "~/ui/constants/user";
import useNotifications from "~/ui/hooks/useNotifications";
import persondefault from '../../../../../public/images/placeholders/person_default.png';
import { getPersonTitle } from "~/ui/constants/person";
import { getAccessToken } from '~/services/auth';
import useSWR, { mutate } from 'swr';
import { fetcher } from '~/types/api/fetcher';


interface IProps {
  person: Person,
  noSelection: boolean,
  personTypeID: any,
  onSelectPerson: (id: number) => void
}

const BrowseContactsItem = ({ person, noSelection, onSelectPerson, personTypeID }: IProps): ReactElement => {
  const notifications = useNotifications();
  //const { onSelect } = useStoreActions(actions => actions.person);
  //const { selectedPerson } = useStoreState(state => state.person);
  const { contactId, householdId } = useStoreState(state => state.selected);
  const { onSelectContact } = useStoreActions(actions => actions.selected);

  //const urlPerson = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${person.PersonID}`;
  //const { data: contact} = useSWR<Person>([urlPerson, getAccessToken()], fetcher);
  
  const select = async () => {
    notifications.toggleLoading(true);
    
    //onSelectContact(person.PersonID);
    onSelectPerson(person.PersonID);
    // await onSelect({
    //   person
    // });
    
    //mutate(`${process.env.PUBLIC_URL}/household/${householdId}/person/${contactId}`)
    notifications.toggleLoading(false);
  }

  return (
    <>
      {person?.PersonTypeID == personTypeID || personTypeID==-1   ?
        <ListItem onClick={() => select()} button selected={contactId === person?.PersonID && !noSelection}>
          <ListItemAvatar>
            <Avatar variant="square" className={classnames(styles.avatar)} src={person?.PhotoURL ? person?.PhotoURL : persondefault} />
          </ListItemAvatar>
          <ListItemText primary={getFullName(person)} secondary={getPersonTitle(person)} />
        </ListItem>
        : null
      }
    </>
  );
};

export default BrowseContactsItem;

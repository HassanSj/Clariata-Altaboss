import React, {ReactElement} from 'react';
import {Grid} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {Person} from "~/types/api/person";
import {OwnerType} from "~/ui/constants/api";
import useEditable from "~/ui/hooks/useEditable";
import {ContactDataType, ContactDataTypes} from "~/ui/constants/contact";
import CardHeader from "@material-ui/core/CardHeader";
import styles from "./PersonsGrid.module.scss";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import Avatar from "@material-ui/core/Avatar";
import {getFullName, getInitials, getPersonTypeEnum, getPhotoSrc} from "~/ui/constants/user";
import CardMedia from "@material-ui/core/CardMedia";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import {trimString} from "~/ui/constants/utils";
import useNotifications from "~/ui/hooks/useNotifications";
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';
import { PersonalRelationshipType } from '~/types/api/personalRelationshipType';

interface IProps {
  persons: Person[] | undefined,
  ownerType: OwnerType;
  size?: 'small' | 'medium';
  gridWidth?: number;
  justify?: 'flex-start' | 'flex-end';
};

const PersonsGrid = ({ persons, ownerType, size = 'medium', gridWidth = 4, justify = 'flex-start' }: IProps): ReactElement => {
  const notifications = useNotifications();
  const { onSelect } = useStoreActions(actions => actions.person);
  //const {personalRelationshipTypes} = useStoreState(state => state.constants);
  const { data: personalRelationshipTypes } = useSWR<PersonalRelationshipType[]>([`${process.env.NEXT_PUBLIC_API_URL}/personalrelationshiptype/list`, getAccessToken()], fetcher);

  // Use editable
  const editable = useEditable(ContactDataTypes);
  const toggleEditModal = async (type: ContactDataType, person: Person) => {
    notifications.toggleLoading(true);
    await onSelect({
      person
    });
    editable.setSelectedAndShow(type, person);
    notifications.toggleLoading(false);
  }
  const showEditModal = (person: Person) => {
    toggleEditModal(ContactDataType.PERSON, person);
  }

  return (
    <>
      <Grid className={styles.progress_header} container spacing={1} justifyContent={justify}>
        {persons ? persons?.map((person: any, index: number) => {
          return (
            <Grid item xs={6} key={index}>
              <Card className={classnames(styles.root)}>
                <CardHeader
                  className={classnames(styles.header)}
                  avatar={
                    <Avatar className={classnames(styles.avatar)}>
                      {getInitials(person)}
                    </Avatar>
                  }
                  title={trimString(getFullName(person), 20)}
                  subheader={getPersonTypeEnum(person?.PersonTypeID)}
                  onClick={() => toggleEditModal(ContactDataType.VIEW, person)}
                />
                <CardMedia
                  className={classnames(styles.media)}
                  image={getPhotoSrc(person?.Photo)}
                  title={getFullName(person)}
                  onClick={() => toggleEditModal(ContactDataType.VIEW, person)}
                />
              </Card>
            </Grid>
          )
        }) : null }
      </Grid>
      <EditContactModals editable={editable} ownerType={OwnerType.PERSON} />
    </>
  );
};

export default PersonsGrid;

import React, {ReactElement} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, List, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {ContactDataType} from "~/ui/constants/contact";
import CardContent from "@material-ui/core/CardContent";
import {hasItems} from "~/ui/constants/utils";
import classnames from "classnames";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import Avatar from "@material-ui/core/Avatar";
import {getFullName, getPersonType, getPhotoSrc, getPhotoSrcByUrl} from "~/ui/constants/user";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import Card from "@material-ui/core/Card";
import {useStoreState} from "~/store/hooks";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';
import { PersonalRelationship } from "~/types/api/personalRelationship";
import { Person } from "~/types/api/person";
import { getPersonTitle } from "~/ui/constants/person";

/**
 * Tab that shows personal relationships
 * @constructor
 */
const RelationshipsTab = ({toggleEditModal}:TabProps):ReactElement => {
    //const { selectedRelationships } = useStoreState(state => state.person);

    const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);

    const urlPersons = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;
    const { data: persons} = useSWR<Person[]>([urlPersons, getAccessToken()], fetcher, { refreshInterval: 1000 });

    const urlRelationships = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/personalrelationship/list`;
    const {data: selectedRelationships} = useSWR<PersonalRelationship[]>([urlRelationships, getAccessToken()], fetcher, { refreshInterval: 1000 });

    return (
        <Card>
            <CardHeader title="Relationships"
                        titleTypographyProps={{'variant': 'h6'}}
                        action={
                            <Button color="default" onClick={() => toggleEditModal(ContactDataType.RELATIONSHIP, null)}>
                                Add
                            </Button>
                        } />
            <CardContent>
                <List dense={true}>
                    {hasItems(selectedRelationships) ? selectedRelationships?.map((item: any, index: number) => {
                        let person = persons?.find(p => p.PersonID == item.AssociatePersonID)
                        return (
                            <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.RELATIONSHIP, item)}>
                                <ListItemAvatar className={classnames(styles.relationship_avatar)}>
                                    <Avatar variant="square" className={classnames(styles.avatar)} src={getPhotoSrcByUrl(person?.PhotoURL)} />
                                </ListItemAvatar>
                                <ListItemText>
                                    {getFullName(person)}<br />
                                    <span className={styles.address_label}>{getPersonTitle(person)}</span>
                                </ListItemText>
                            </ListItem>
                        )
                    }) : <EmptyContainer text="No relationships found" /> }
                </List>
            </CardContent>
        </Card>
    )
}

export default RelationshipsTab
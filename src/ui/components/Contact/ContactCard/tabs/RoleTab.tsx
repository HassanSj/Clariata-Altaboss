import React, {ReactElement, useEffect, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ContactDataType} from "~/ui/constants/contact";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import {Role} from "~/types/api/role";
import api from "~/services/api";
import {useStoreState} from "easy-peasy";
import {hasItems} from "~/ui/constants/utils";
import Icon from "@material-ui/core/Icon";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import {RoleTypeValues} from "~/ui/constants/person";
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';
import { Household } from "~/types/api/household";


const RoleTab = ({toggleEditModal, person}:TabProps): ReactElement => {
    //const { selectedHousehold } = useStoreState(state => state.household);

    const { householdId, contactId} = useStoreState((state) => state.selected);
    
    //const urlHousehold = `household/${selectedHouseholdId}`;
    //const {data: selectedHousehold} = useSWR<Household>(urlHousehold, fetcher, { refreshInterval: 1000 });

    const [roles, setRoles] = useState<Role[]>([])

    const downloadRoles = async () => {
        if(person.PersonID) {
            const rolesData = await api.role.list(householdId, person.PersonID)
            if(rolesData) {
                setRoles(rolesData.data)
            }
        }
    }

    useEffect(() => {
        downloadRoles().then()
    },[person.PersonID])

    return (
        <Card>
            <CardHeader title="Roles"
                        titleTypographyProps={{'variant': 'h6'}}
                        action={
                            <Button color="default" onClick={() => toggleEditModal(ContactDataType.ROLE, null)}>
                                Add
                            </Button>
                        } />
            <CardContent>
                <List dense={true}>
                    {hasItems(roles) ? roles?.map((item: Role, index: number) =>
                        <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.ROLE, item)}>
                            <ListItemIcon>
                                <Icon>content_copy</Icon>
                            </ListItemIcon>
                            <ListItemText>
                                {RoleTypeValues[item.Role]}<br />
                                <span className={styles.address_label}>{item.ForPerson}</span><br />
                                <span className={styles.address_label}>{item.AdditionalInformation}</span><br />
                            </ListItemText>
                        </ListItem>
                    ) : <EmptyContainer text="No roles found" /> }
                </List>
            </CardContent>
        </Card>
    )
}

export default RoleTab
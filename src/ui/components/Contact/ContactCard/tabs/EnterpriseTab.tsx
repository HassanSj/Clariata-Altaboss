import React, {ReactElement, useEffect, useState} from "react";
import {useStoreState} from "easy-peasy";
import api from "~/services/api";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import {Company} from "~/types/api/company";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ContactDataType} from "~/ui/constants/contact";
import {hasItems} from "~/ui/constants/utils";
import {Role} from "~/types/api/role";
import Icon from "@material-ui/core/Icon";
import {IndustryTypeLabels, RoleTypeValues} from "~/ui/constants/person";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";


const EnterpriseTab = ({toggleEditModal, person}:TabProps): ReactElement => {
    
    const { householdId, contactId} = useStoreState((state) => state.selected);
        
    const [companies, setCompanies] = useState<Company[]>([])

    const downloadCompanies = async () => {
        if(person.PersonID) {
            const companiesData = await api.company.list(householdId, person.PersonID)
            if(companiesData) {
                setCompanies(companiesData.data)
            }
        }
    }

    useEffect(() => {
        downloadCompanies().then()
    },[person.PersonID])

    return (
        <Card>
            <CardHeader title="Companies"
                        titleTypographyProps={{'variant': 'h6'}}
                        action={
                            <Button color="default" onClick={() => toggleEditModal(ContactDataType.COMPANY, null)}>
                                Add
                            </Button>
                        } />
            <CardContent>
                <List dense={true}>
                    {hasItems(companies) ? companies?.map((item: Company, index: number) =>
                        <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.COMPANY, item)}>
                            <ListItemIcon>
                                <Icon>business</Icon>
                            </ListItemIcon>
                            <ListItemText>
                                {item.Name}<br />
                                {item.IndustryType !== undefined &&
                                    <><span className={styles.address_label}>{IndustryTypeLabels[item.IndustryType]}</span><br /></>
                                }
                            </ListItemText>
                        </ListItem>
                    ) : <EmptyContainer text="No enterprise found" /> }
                </List>
            </CardContent>
        </Card>
    )
}

export default EnterpriseTab
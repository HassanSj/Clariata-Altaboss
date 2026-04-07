import React, {ReactElement} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ContactDataType} from "~/ui/constants/contact";
import CardContent from "@material-ui/core/CardContent";
import {convertStringToDateText, hasItems} from "~/ui/constants/utils";
import Icon from "@material-ui/core/Icon";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import Card from "@material-ui/core/Card";
import {useStoreState} from "~/store/hooks";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import {EducationItem} from "~/types/api/educationItem";
import {onlyNonUndefined} from "../../../../../../utils/filter";
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';


export function formatEducation(item: EducationItem, includeDate?:boolean) {
    return [
        item.InstitutionName,
        item.EducationDescription,
        includeDate && item.CompletionDate ? convertStringToDateText(item.CompletionDate, Number(item.CompletionDateString)) : undefined
    ].filter(onlyNonUndefined).join(", ")
}
/**
 * Tab of contact card that shows education information
 * @constructor
 */
const EducationTab = ({toggleEditModal}:TabProps):ReactElement => {
    //const { selectedEducation } = useStoreState(state => state.person)

    const { householdId, contactId} = useStoreState((state) => state.selected);

    const urlEducation = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/education/list`;
    const {data: selectedEducation} = useSWR<EducationItem[]>([urlEducation, getAccessToken()], fetcher, { refreshInterval: 1000 });

    return (
        <Card>
            <CardHeader title="Education History"
                        titleTypographyProps={{'variant': 'h6'}}
                        action={
                            <Button color="default" onClick={() => toggleEditModal(ContactDataType.EDUCATION, null)}>
                                Add
                            </Button>
                        } />
            <CardContent>
                <List dense={true}>
                    {hasItems(selectedEducation) ? selectedEducation?.sort((item1:any, item2:any) => {
                        const date1 = new Date(item1.CompletionDate)
                        const date2 = new Date(item2.CompletionDate)

                        return date1 < date2 ? -1 : 1
                    }).map((item: any, index: number) => {
                        return (
                            <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.EDUCATION, item)}>
                                <ListItemIcon>
                                    <Icon>school</Icon>
                                </ListItemIcon>
                                <ListItemText>
                                    {formatEducation(item)}<br />
                                    <span className={styles.address_label}>{convertStringToDateText(item?.CompletionDate,Number(item.CompletionDateString))}</span>
                                </ListItemText>
                            </ListItem>
                        )
                    }) : <EmptyContainer text="No education found" /> }
                </List>
            </CardContent>
        </Card>
    )
}

export default EducationTab
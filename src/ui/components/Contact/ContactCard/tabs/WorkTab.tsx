import React, {ReactElement} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Button, Grid, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ContactDataType} from "~/ui/constants/contact";
import CardContent from "@material-ui/core/CardContent";
import {convertStringToDateText, hasItems, toDate} from "~/ui/constants/utils";
import Icon from "@material-ui/core/Icon";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import Typography from "@material-ui/core/Typography";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import Card from "@material-ui/core/Card";
import {useStoreState} from "~/store/hooks";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import {WorkHistoryItem} from "~/types/api/workHistoryItem";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {onlyNonUndefined} from "../../../../../../utils/filter";
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';

export function formatWork(item: WorkHistoryItem){
    return [
        item.Company,
        item.Title
    ].filter(onlyNonUndefined).join(", ")
}

export function formatWorkDates(item: WorkHistoryItem){
    const startDate = convertStringToDateText(item!.StartDate!, Number(item.StartDateString))!
    const endDate   = convertStringToDateText(item!.EndDate!, Number(item.EndDateString))!

    return [
        startDate ?? "",
        endDate ?? ""
    ].join(" - ")
}

/**
 * Tab of contact card that shows work information
 * @constructor
 */
const WorkTab = ({toggleEditModal}:TabProps):ReactElement => {
    //const { selectedWorkHistory } = useStoreState(state => state.person);

    const { householdId, contactId} = useStoreState((state) => state.selected);

    const urlWork = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/workhistory/list`;
    const {data: selectedWorkHistory} = useSWR<WorkHistoryItem[]>([urlWork, getAccessToken()], fetcher, { refreshInterval: 1000 });

    return (
        <Card>
            <CardHeader title="Work History"
                        titleTypographyProps={{'variant': 'h6'}}
                        action={
                            <Button color="default" onClick={() => toggleEditModal(ContactDataType.WORK, null)}>
                                Add
                            </Button>
                        } />
            <CardContent>
                <List dense={true}>
                    {hasItems(selectedWorkHistory) ? selectedWorkHistory?.map((item: WorkHistoryItem, index: number) =>
                            <ListItem button key={index} onClick={() => toggleEditModal(ContactDataType.WORK, item)}>
                                <ListItemIcon>
                                    <Icon>work</Icon>
                                </ListItemIcon>
                                <ListItemText>
                                    {formatWork(item)}<br />
                                    <span className={styles.address_label}>{formatWorkDates(item)}</span><br />
                                    <Typography variant="caption" gutterBottom>
                                        {item?.Description}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                    ) : <EmptyContainer text="No work found" /> }
                </List>
            </CardContent>
        </Card>
    )
}

export default WorkTab
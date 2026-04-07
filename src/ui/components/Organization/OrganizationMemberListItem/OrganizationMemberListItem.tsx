import React from "react";
import {Grid, ListItem, ListItemText} from "@material-ui/core";

interface IProps {
    item: any;
}

const OrganizationMemberListItem = ({ item }: IProps) => {
    return (
        <>
            <ListItem>
                <ListItemText>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            {item?.OrganizationMemberID}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.EmailAddress}<br />
                            {item?.UserID}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.OrganizationID}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.OrganizationMemberStatusID}
                        </Grid>
                    </Grid>
                </ListItemText>
            </ListItem>
        </>
    )
}

export default OrganizationMemberListItem;

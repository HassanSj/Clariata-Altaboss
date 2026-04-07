import React from "react";
import {Grid, ListItem, ListItemText} from "@material-ui/core";

interface IProps {
    item: any;
}

const OrganizationListItem = ({ item }: IProps) => {
    return (
        <>
            <ListItem>
                <ListItemText>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            {item?.OrganizationID}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.OrganizationName}<br />
                            {item?.Description}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.OrganizationStatusID}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.DomainName}
                        </Grid>
                    </Grid>
                </ListItemText>
            </ListItem>
        </>
    )
}

export default OrganizationListItem;

import React from "react";
import {Grid, ListItem, ListItemText} from "@material-ui/core";

interface IProps {
    item: any;
}

const SignInHistoryItem = ({ item }: IProps) => {
    return (
        <>
            <ListItem>
                <ListItemText>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            {item?.UserID}<br />
                            {item?.Username}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.IPAddress}<br />
                            {item?.Location}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.DeviceDescription}<br />
                            {item?.UserAgent}
                        </Grid>
                        <Grid item xs={3}>
                            {item?.SuccessfulSignIn}
                        </Grid>
                    </Grid>
                </ListItemText>
            </ListItem>
        </>
    )
}

export default SignInHistoryItem;

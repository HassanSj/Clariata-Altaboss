import React, {ReactElement} from 'react';
import {Grid} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import Typography from "@material-ui/core/Typography";

const HouseholdProfile = (): ReactElement => {
    const { selectedHousehold } = useStoreState((state) => state.household);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    <Typography color="textSecondary" gutterBottom>
                        { selectedHousehold?.HouseholdName }
                    </Typography>
                    <div>
                        Image
                    </div>

                </Grid>
            </Grid>


        </>
    );
};

export default HouseholdProfile;

import { Box, Divider, Grid } from "@material-ui/core";
import Item from "@progress/kendo-react-charts/dist/npm/components/legend/Item";
import React, { ReactElement, ReactFragment, ReactNode } from "react";
import SideBar from './sideBar/SideBar'

const MainBody = (): ReactElement => {
    return (
        <>
            <div className="main_wrapper">
                <Box>
                    <Grid container  spacing={2}>
                        <Grid item md={3}>
                            <SideBar />
                        </Grid>
                        <Grid item md={9}>
                           No Plans Created    
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </>
    )
}
export default MainBody
import React, {ReactElement} from "react";
import {Button, Grid} from "@material-ui/core";

interface AccordionActionTitleProps{
    title: string,
    onClick: () => unknown,
    actionTitle: string
}

/**
 * Title with action for the custom accordion
 * @param title
 * @param onClick
 * @param actionTitle
 * @constructor
 */
const ActionAccordionTitle = ({title, onClick,actionTitle}:AccordionActionTitleProps):ReactElement => {
    return (
        <Grid container>
            <Grid item xs={2} className="flex-align-middle">
                <div className="flex-align-middle flex-container" style={{height:"100%"}}>{title}</div>
            </Grid>
            <Grid item xs={9}/>
            <Grid item xs={1}>
                <Button color="default" onClick={onClick}>
                    {actionTitle}
                </Button>
            </Grid>
        </Grid>
    )
}

export default ActionAccordionTitle
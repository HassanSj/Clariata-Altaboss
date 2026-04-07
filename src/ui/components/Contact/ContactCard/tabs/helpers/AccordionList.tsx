import React, {ReactElement} from "react";
import {Grid} from "@material-ui/core";

export interface AccordionListItem {
    key: string,
    component: any,
    props?: any
}

interface IProps{
    items: AccordionListItem[],
    defaultProps: any,
    defaultExpanded?:boolean
}

const AccordionList = ({items,defaultProps,defaultExpanded}:IProps):ReactElement => {
    return (
        <Grid container  spacing={2}>
            <Grid item xs={12}>
                {
                    items.map(acc => (
                        <div className="m-t-10" key={acc.key}>
                            {React.createElement(acc.component, {...defaultProps, ...acc.props, defaultExpanded})}
                        </div>
                    ))
                }
            </Grid>
        </Grid>
    )
}

export default AccordionList
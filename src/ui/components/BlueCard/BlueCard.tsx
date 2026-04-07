import React, {ReactElement, ReactNode} from "react";
import {Card} from "@material-ui/core";

interface IProps{
    children?:ReactNode
}
const BlueCard = ({children}:IProps):ReactElement => {
    return (
        <Card className="blue-card">
            {children}
        </Card>
    )
}

export default BlueCard
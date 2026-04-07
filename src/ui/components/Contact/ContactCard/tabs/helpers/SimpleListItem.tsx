import React, {ReactElement} from "react";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

interface IProps {
    showFullEditModal: () => unknown,
    primaryTitle?: string,
    secondaryTitle?:string,
    icon: string,
    children?:React.ReactNode
}
const SimpleListItem = ({showFullEditModal,icon,secondaryTitle,primaryTitle,children}:IProps):ReactElement => {
    return (
        <ListItem button onClick={showFullEditModal}>
            <ListItemIcon>
                <Icon>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={primaryTitle} secondary={secondaryTitle}>
                {children}
            </ListItemText>
        </ListItem>
    )
}

export default SimpleListItem
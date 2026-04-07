import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import classnames from "classnames";
import styles from "~/ui/components/ActionItems/ActionItemMilestoneItem/ActionItemMilestoneItem.module.scss";
import {getFullName, getPersonTypeEnum, getPhotoUrlOrDefault} from "~/ui/constants/user";
import React from "react";
import { getPersonTitle } from "~/ui/constants/person";

const SelectAvatarTemplate = (option: any) => {
  return (
    <React.Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar variant="square">
            <Avatar variant="square" className={classnames(styles.avatar)} src={getPhotoUrlOrDefault(option)} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={getFullName(option)}
                      secondary={getPersonTitle(option)} />
      </ListItem>
    </React.Fragment>
  )
}

export default SelectAvatarTemplate;

import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import styles from "~/ui/components/ActionItems/ActionItem/ActionItem.module.scss";
import classnames from "classnames";
import {getFullName, getPhotoUrlOrDefault} from "~/ui/constants/user";
import React from "react";

const LeadPersonTemplate = ({ props }: IActionItemCellTemplateConfig) => {
  return (
    <>
      { props?.person ?
        <DataTableCell isLoading={props?.person ? isNullOrUndefined(props?.person) : false}
                       inputProps={{
                         type: 'select',
                         labelField: 'FullName',
                         valueField: 'PersonID',
                         items: props?.household?.Persons,
                         label: 'Lead Person',
                         field: {
                           name:'LeadPerson',
                           value:props?.item?.LeadPerson
                         }
                       }}
                       onSave={(e) => props?.onUpdateFields(e)}>
          <ListItem onClick={() => props?.onSelect()}
                    selected={props?.selected?.ActionItemID === props?.item?.ActionItemID}
                    className={styles.item_background}>
            <ListItemAvatar>
              <Avatar>
                <Avatar className={classnames(styles.avatar)} src={getPhotoUrlOrDefault(props?.person)} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={getFullName(props?.person)}/>
          </ListItem>
        </DataTableCell>
        : null }
    </>
  )
}

export default LeadPersonTemplate;
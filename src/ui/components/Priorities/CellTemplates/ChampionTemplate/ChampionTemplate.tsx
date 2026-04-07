import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import styles from "~/ui/components/Priorities/PriorityItem/PriorityItem.module.scss";
import classnames from "classnames";
import {getFullName, getPhotoUrlOrDefault} from "~/ui/constants/user";
import React from "react";
import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";

const ChampionTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      {props?.objective?.Champion ?
        <DataTableCell isLoading={props?.objective?.Champion ? isNullOrUndefined(props?.objective?.ChampionPerson) : false}
                       inputProps={{
                         label: "Champion",
                         type: 'select',
                         labelField: 'FullName',
                         valueField: 'PersonID',
                         items: props?.household?.Persons ? props?.household?.Persons : [],
                         field: {
                           name:'Champion',
                           value:props?.objective?.Champion
                         }
                       }}
                       onSave={(e) => props?.onUpdateFields(e)}>
          <ListItem onClick={() => props?.onSelect()}
                    selected={props?.selected?.ObjectiveID === props?.objective?.ObjectiveID}
                    className={styles.item_background}>
            <ListItemAvatar>
              <Avatar>
                <Avatar className={classnames(styles.avatar)}
                        src={getPhotoUrlOrDefault(props?.objective?.ChampionPerson)}/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={getFullName(props?.objective?.ChampionPerson)}/>
          </ListItem>
        </DataTableCell>
        : null}
    </>
  )
}

export default ChampionTemplate;

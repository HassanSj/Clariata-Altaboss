import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React, {useState} from "react";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import styles from "~/ui/components/Priorities/PriorityItem/PriorityItem.module.scss";
import classnames from "classnames";
import {getBothPhotoSrc, getFirstName, getPhotoUrlOrDefault} from "~/ui/constants/user";
import {useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import { Person } from "~/types/api/person";


const PersonTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  const { persons } = useStoreState((state) => state.person);
  const [person, setPerson] = useState<any>();

  const populatePerson = () => {
    if (props?.objective?.PersonID && (Number(props?.objective?.PersonID) !== 0)) {
      setPerson(persons?.find(p => p.PersonID === props?.objective?.PersonID));
    } else if (Number(props?.objective?.PersonID) == 0) {
      setPerson(BOTH_PERSONS_OPTION);
    } else {
      setPerson(undefined);
    }

  }

  useMountEvents({
    onMounted: async () => {
      populatePerson();
    },
    onChange: async () => {
      populatePerson();
    },
    watchItems: [props?.objective]
  });

  return (
    <>
        <DataTableCell isLoading={props?.objective?.PersonID ? isNullOrUndefined(person) : false}
                       inputProps={{
                         label: "Family Member",
                         type: 'select',
                         labelField: 'FullName',
                         valueField: 'PersonID',
                         items: (props?.household?.Persons && props?.household?.Persons?.length > 1) ? [...props?.household?.Persons, BOTH_PERSONS_OPTION] : (props?.household?.Persons && props?.household?.Persons?.length == 1) ? [props?.household?.Persons[0]] : [BOTH_PERSONS_OPTION],
                         field: {
                           name:'PersonID',
                           value:props?.objective?.PersonID
                         }
                       }}
                       onSave={(e) => props?.onUpdateFields(e)}>
          {!isNullOrUndefined(props?.objective?.PersonID) ?
          <ListItem onClick={() => props?.onSelect()}
                    selected={props?.selected?.ObjectiveID === props?.objective?.ObjectiveID}
                    className={styles.item_background}>
              { !props?.locked &&
                <ListItemAvatar>
                  <Avatar variant="square">
                    <Avatar variant="square" className={classnames(styles.avatar)}
                            src={props?.objective?.PersonID === 0 ? getBothPhotoSrc() : getPhotoUrlOrDefault(person)}/>
                  </Avatar>
                </ListItemAvatar>
              }
            <ListItemText primary={props?.objective?.PersonID === 0 ? 'Both' : getFirstName(person)}/>
          </ListItem>
          : null}
        </DataTableCell>
    </>
  )
}

export default PersonTemplate;

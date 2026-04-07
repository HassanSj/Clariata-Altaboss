import {Objective} from "~/types/api/objective";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip
} from "@material-ui/core";
import {getFullName, getPersonTypeEnum, getPhotoUrlOrDefault} from "~/ui/constants/user";
import Icon from "@material-ui/core/Icon";
import React, {useState} from "react";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreActions, useStoreState} from "~/store/hooks";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {IObjectiveDataType} from "~/types/objective/store";
import {Person} from "~/types/api/person";
import useMountEvents from "~/ui/hooks/useMountEvents";


interface IProps {
  objective?: Objective
  stakeholder?: any;
}

const PriorityStakeholderItem = ({ objective, stakeholder }: IProps) => {
  const notifications = useNotifications();

  const { persons } = useStoreState(state => state.person);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { onPopulate, onReplace, onSelect, onRefresh } = useStoreActions(actions => actions.objective);

  const [person, setPerson] = useState<Person | undefined>();

  const remove = async (stakeholder: any) => {
    if (!stakeholder || !objective) return;
    notifications.toggleLoading(true);
    try {
      const { HouseholdID } = selectedHousehold;
      const res = await api.objectivestakeholder.remove(HouseholdID, objective?.ObjectiveID, stakeholder?.ObjectiveStakeholderID, stakeholder);
      refresh();
    } catch (err) {
      processServerError(err, 'EditPriorityStakeholder.remove');
    }
    notifications.toggleLoading(false);
  };

  const refresh = async () => {
    const payload = {
      type: IObjectiveDataType.OBJECTIVE,
      objective: objective,
      objectiveId: objective?.ObjectiveID
    };
    const refreshed = await onRefresh(payload);
  }

  const findAndSetPerson = async () => {
    if (!stakeholder?.PersonID) return;
    setPerson(persons?.find(p => p?.PersonID === stakeholder?.PersonID))
  }

  useMountEvents({
    onMounted: async () => {
      findAndSetPerson();
    },
    onChange: async () => {
      findAndSetPerson();
    },
    watchItems: [objective, stakeholder]
  });

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={getPhotoUrlOrDefault(person)} variant={"square"}/>
      </ListItemAvatar>
      <ListItemText primary={getFullName(person)}
                    secondary={person?.PersonTitleFree} />
      <ListItemSecondaryAction>
        <Tooltip title="Delete">
          <IconButton edge="end" aria-label="delete" onClick={() => remove(stakeholder)}>
            <Icon>delete</Icon>
          </IconButton>
        </Tooltip>

      </ListItemSecondaryAction>
    </ListItem>
  )
}
export default PriorityStakeholderItem;

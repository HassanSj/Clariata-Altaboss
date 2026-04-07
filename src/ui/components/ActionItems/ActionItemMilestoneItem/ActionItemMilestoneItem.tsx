import React, {ReactElement, useState} from 'react';
import styles from './ActionItemMilestoneItem.module.scss';
import classnames from 'classnames';
import {Avatar, Grid, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {getFullName, getPhotoSrc} from "~/ui/constants/user";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {Person} from "~/types/api/person";
import {ActionItem} from "~/types/api/actionItem";
import {toDate} from "~/ui/constants/utils";
import {ActionItemMilestone} from "~/types/api/actionItemMilestone";

interface IProps {
  item: ActionItemMilestone
}

const ActionItemMilestoneItem = ({ item }: IProps): ReactElement => {
  const notifications = useNotifications();
  const { onSelect } = useStoreActions(actions => actions.objective);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { selectedObjective, objectives, selectedActionItem, actionItems } = useStoreState(state => state.objective);

  const [person, setPerson] = useState<Person>();
  const [actionItem, setActionItem] = useState<ActionItem>();

  const select = async () => {
    // TODO
  }

  const findAndSetPerson = () => {
    if (!item?.PersonResponsible || !selectedHousehold?.Persons) return;
    const itemPerson = selectedHousehold?.Persons.find((p: Person) => p.PersonID === item.PersonResponsible);
    setPerson(itemPerson);
  }

  const findAndSetActionItem = () => {
    if (!item?.ActionItemID || !actionItems) return;
    const newActionItem = actionItems.find((d: ActionItem) => d.ActionItemID === item.ActionItemID);
    setActionItem(newActionItem);
  }

  useMountEvents({
    onMounted: async () => {
      findAndSetPerson();
      findAndSetActionItem();
    },
  });

  return (
    <>
      <div className={"item_card"}>
        <div className={"item_content"}>
          <ListItem onClick={() => select()} selected={selectedActionItem?.ActionItemID === item?.ActionItemID}>
            <ListItemAvatar>
              <Avatar>
                <Avatar className={classnames(styles.avatar)} src={getPhotoSrc(person?.Photo)} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  {item?.Description}<br />
                  <small>{getFullName(person)}</small>
                </Grid>
                <Grid item xs={2}>
                  {toDate(item?.StartDate)} <br />
                  {toDate(item?.DueDate)}
                </Grid>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={2}>

                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>
        </div>
      </div>
    </>
  );
};

export default ActionItemMilestoneItem;

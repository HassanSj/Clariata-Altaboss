import { Grid, ListItem, ListItemText } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { useStoreState } from "~/store/hooks";
import household from "~/store/household";
import { TeamMember } from "~/types/api/teamMember";
import { IDataItemEventConfig } from "~/types/data";
import DataWrapper from "../../Data/DataWrapper";
import Modal from "../../Dialogs/Modal";
import TeamMemberAccessItem from "../TeamMemberAccessItem/TeamMemberAccessItem";
import styles from "./TeamMemberAccess.module.css";

interface IProps {
  householdId: number;
  isOpen: boolean;
  onClose: () => unknown;
}

const TeamMemberAccess = ({ householdId, isOpen, onClose }: IProps): ReactElement => {

  const [data, setData] = useState<TeamMember[]>([]);
  const { user } = useStoreState(state => state.user);

  const loadData = async () => {
    try {
      const res = await api.teamMember.getTeamMembers(user.UserID as number);
      console.log(res.data as TeamMember[]);
      setData(res?.data as TeamMember[]);

      const res2 = await api.teamMemberHousehold.getTeamMemberHouseholds
    } catch (err) {
    processServerError(err, 'Firms.loadHistory');
  }
  };

  const handleRemove = async (comment: Comment, index: number) => {
    await loadData();
  }

  const eventConfig: IDataItemEventConfig = {
    onRemove: handleRemove,
  }

  useEffect(() => {
    loadData();
  }, [])

    return (
        <>
        <Modal title="Permissions" isOpen={isOpen} handleClose={onClose}>
        <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={3} className={styles.listAlignment}>
                    First Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Last Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Email Address
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
            <DataWrapper
              isGrouped={false}
              data={data}
              propLabel="item"
              keyLabel="TeamMemberAccess"
              component={TeamMemberAccessItem}
              eventConfig={eventConfig}
              componentProps={{householdId: householdId}}
            />
          </Modal>
        </>
    )
}

export default TeamMemberAccess;
import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../TeamMemberList/TeamMemberList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import { TeamMemberHousehold } from '~/types/api/teamMemberHousehold';

interface IProps {
  item: TeamMemberHousehold;
  eventConfig?: IDataItemEventConfig;
  selectTeamHousehold: any;
}

const TeamHouseholdListItem = ({ item, eventConfig, selectTeamHousehold }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMemberHousehold>();
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    const res = await api.teamMemberHousehold.removeTeamMemberHousehold(item?.TeamMemberHouseholdID)
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowDeleteDialog(false);
  };

  const handleSelect = (id: number) => {
    console.log(id);
    selectTeamHousehold(id);
  }

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.HouseholdName}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.PermissionID == 1 ? "Read-Only" : "Edit"}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
                  <Button
                    type="button"
                    text={`Remove`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                      setShowDeleteDialog(true)
                    }}
                  />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Remove Household"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to remove household from Team Member?
        </Modal>
    </>
  );
};

export default TeamHouseholdListItem;

import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../TeamMemberList/TeamMemberList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import { TeamMember } from '~/types/api/teamMember';
import TeamHouseholdList from '../TeamHouseholdList/TeamHouseholdList';

interface IProps {
  item: TeamMember;
  eventConfig?: IDataItemEventConfig;
  selectTeamMember: any;
  isOpen: boolean;
}

const TeamMemberListItem = ({ item, eventConfig, isOpen }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember>();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [showHouseholds, setShowHouseholds] = useState<boolean>(false);

  const onClose = () => {
    setShowDeleteDialog(false);
    isOpen = false;
  };

  const handleDelete = async () => {
    const res = await api.firm.deleteFirm(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowDeleteDialog(false);
  };

  const handleSelect = (id: number) => {
    console.log(id);
    isOpen = true;
  }

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.FirstName}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.LastName}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.EmailAddress}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
                  <Button
                    type="button"
                    text={showHouseholds ? `Hide Households` : `Show Households`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                      setShowHouseholds(!showHouseholds);
                    }}
                  />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            {showHouseholds ?
            <Grid xs={12}>              
              <TeamHouseholdList teamMemberId={item.TeamMemberID} isOpen={isOpen} onClose={onClose}  />
            </Grid>
            : null }
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Team Member"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete {selectedTeamMember?.FirstName} {selectedTeamMember?.LastName}?
        </Modal>
    </>
  );
};

export default TeamMemberListItem;

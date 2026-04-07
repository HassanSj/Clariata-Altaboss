import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../TeamInvitationList/TeamInvitationList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import { Invitation } from '~/types/api/invitation';

interface IProps {
  item: Invitation;
  eventConfig?: IDataItemEventConfig;
  selectFirm: any;
}

const TeamInvitationListItem = ({ item, eventConfig, selectFirm }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation>();
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    const res = await api.invitation.deleteInvitation(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    console.log(res);
    setShowDeleteDialog(false);
  };

  const handleSelect = (id: number) => {
    console.log(id);
    selectFirm(id);
  }

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.FirstName}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.LastName}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.EmailAddress}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {moment(item?.ExpirationDate.toString()).format("MM/DD/YYYY")}
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
              <div style={{display: "flex", flexDirection: "column"}}>
                  <div style={{padding: "10px 0px"}}>
                  <Button
                    type="button"
                    text={`Resend`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                    }}
                  />
                  </div>
                  <div style={{padding: "10px 0px"}}>
                  <Button
                    type="button"
                    text={`Delete`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                      setSelectedId(item?.InvitationID as number);
                      setShowDeleteDialog(true);
                      setSelectedInvitation(item);
                    }}
                  />
                  </div>
                  </div>
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Inivitation"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete {selectedInvitation?.FirstName + " " + selectedInvitation?.LastName}?
        </Modal>
    </>
  );
};

export default TeamInvitationListItem;

import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../RegistrationCodeList/RegistrationCodeList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';

interface IProps {
  item: any;
  eventConfig?: IDataItemEventConfig;
}

const RegistrationCodeItem = ({ item, eventConfig }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    const res = await api.registrationcode.deleteRegistrationCode(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.RegistrationCode}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.IssuedTo}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.EmailAddress}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {moment(item?.IssuedDate).format('MM/DD/YYYY')}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              <Button
                type="button"
                text={`Delete`}
                variant="contained"
                size="small"
                color="warning"
                onClick={() => {
                  setSelectedId(item?.RegistrationCodeID);
                  setShowDeleteDialog(true);
                  setSelectedCode(`${item.RegistrationCode}`);
                }}
              />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Registration Code"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete {selectedCode}?
        </Modal>
    </>
  );
};

export default RegistrationCodeItem;

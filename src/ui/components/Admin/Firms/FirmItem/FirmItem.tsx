import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../FirmList/FirmList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import { Firm } from '~/types/api/firm';

interface IProps {
  item: Firm;
  eventConfig?: IDataItemEventConfig;
  selectFirm: any;
  editFirm: any;
}

const FirmItem = ({ item, eventConfig, selectFirm, editFirm }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);
  //const [showEditForm, setShowEditFirm] = useState(false);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    const res = await api.firm.deleteFirm(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowDeleteDialog(false);
  };

  const handleEdit = async (firm: Firm) => {
    editFirm(firm);
  }

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
              {item?.FirmName}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.PrimaryContact}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.PrimaryEmail}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
                {item?.Domain}
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
                  <Button
                      type="button"
                      text={`View Users`}
                      variant="contained"
                      size="small"
                      color="warning"
                      onClick={() => {
                        handleSelect(item.FirmID);
                      }}
                    />
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
                  <Button
                    type="button"
                    text={`Edit`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  />
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
                  <Button
                    type="button"
                    text={`Delete`}
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => {
                      setSelectedId(item?.FirmID as number);
                      setShowDeleteDialog(true);
                      setSelectedFirm(`${item.FirmName}`);
                    }}
                  />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Firm"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete {selectedFirm}?
        </Modal>
    </>
  );
};

export default FirmItem;

import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../DestinyList/DestinyList.module.css'
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';

interface IProps {
    item: any;
    eventConfig?: IDataItemEventConfig;
    editItem: (itemId: number) => unknown;
  }

const DestinyItem = ({ item, eventConfig, editItem }: IProps) => {

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const onEdit = (id: number) => {  
      console.log("ID:" + id);
      editItem(id);
  }

  const handleDelete = async () => {
    const res = await api.destiny.deleteGlobalItem(selectedId);
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
              {item?.Category}
            </Grid>
            <Grid item xs={5} className={styles.listAlignment}>
              {item?.Title}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.ItemType}
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
              <Button
                type="button"
                text={`Edit`}
                variant="contained"
                size="small"
                color="warning"
                onClick={() => {
                  onEdit(item?.ItemId)
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
                  setSelectedItem(item?.Title)
                  setSelectedId(item?.ItemId)
                  setShowDeleteDialog(true);
                }}
              />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Item"
        isOpen={showDeleteDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete {selectedItem}?
        </Modal>
    </>
    )
}

export default DestinyItem;
import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import moment from 'moment';
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import styles from '../ChecklistPanel/ChecklistPanel.module.css'
import { Checklist } from '~/types/api/checklist';

interface IProps {
    item: Checklist;
    eventConfig?: IDataItemEventConfig;
    editItem: (itemId: number) => unknown;
    displayEdit: any;
}

const ChecklistItem = ({ item, eventConfig, displayEdit }: IProps) => {

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowDeleteDialog(false);
  };

  const onEdit = (id: number) => {  
    console.log("ID:" + id);
    displayEdit(id);
}

  const handleDelete = async () => {
    const res = await api.checklists.deleteChecklist(selectedId);
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
            <Grid item xs={5} className={styles.listAlignment}>
              {item?.ChecklistName}
            </Grid>
            <Grid item xs={5} className={styles.listAlignment}>
              {item?.ChecklistType}
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
              <Button
                type="button"
                text={`Edit`}
                variant="contained"
                size="small"
                color="warning"
                onClick={() => {
                  onEdit(item.ChecklistID!)
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
                  setSelectedItem(item?.ChecklistName)
                  setSelectedId(item.ChecklistID!)
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

export default ChecklistItem;
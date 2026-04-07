import React, { useEffect, useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../ResourcesTable/ResourcesTable.module.css'
import api from '~/services/api';
import { IDataItemEventConfig } from '~/types/data';
import EditResourceForm from '../EditResourceForm/EditResourceForm';
import { Resource } from '~/types/api/resource';

interface IProps {
  item: Resource;
  eventConfig?: IDataItemEventConfig;
  loading?: boolean;
}
type ResourceType = "0"|"1"|"2"

const ResourceItem = ({ item, eventConfig, loading }: IProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [value, setValue] = useState<ResourceType>();

  const onDeleteClose = () => {
    setShowDeleteDialog(false);
  };

  const onEditClose = () => {
    setShowEditDialog(false);
  }

  const handleDelete = async () => {
    if(item.ResourceType === "Document"){
      const delRes = await api.document.deleteResourceFile(item.ResourceUrl);
    }
    const res = await api.resource.deleteResource(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    console.log(loading);
    
  }, [loading, value])

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.ResourceTitle}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.Description}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {loading ? 'loading...' : item?.ResourceUrl}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {item?.ResourceModule}
            </Grid>
            <Grid item xs={1} className={styles.listAlignment}>
              <Button
                type="button"
                text={`Edit`}
                variant="contained"
                size="small"
                color="warning"
                onClick={() => {
                  setShowEditDialog(true);
                  setValue(item?.ResourceType == "URL" ? "0" :
                  (item?.ResourceType == "Checklist" ? "1" : "2"))
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
                  setSelectedId(item?.ResourceId);
                  setShowDeleteDialog(true);
                }}
              />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Delete Resource"
        isOpen={showDeleteDialog}
        handleClose={onDeleteClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleDelete}
        submitText="Yes"
      >
        Are you sure you want to delete : {item?.ResourceTitle} ?
      </Modal>
      <EditResourceForm item={item} onClose={onEditClose} isOpen={showEditDialog} eventConfig={eventConfig} value={value!} setValue={setValue} />
    </>
  );
};

export default ResourceItem;

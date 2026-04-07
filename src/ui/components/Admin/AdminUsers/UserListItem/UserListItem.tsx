import React, { useState } from 'react';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import styles from '../UsersList/UsersList.module.css';
import api from '~/services/api';
import { User } from '~/types/api/user';
import { IDataItemEventConfig } from '~/types/data';
import useMountEvents from '~/ui/hooks/useMountEvents';

interface IProps {
  item: any;
  eventConfig?: IDataItemEventConfig;
}

const getUserType = (userTypeID: number) => {
  switch(userTypeID) {
    case 1:
      return "Admin"
      break;
    case 3:
      return "Advisor";
      break;
    case 5:
      return "Team Member";
      break;
    case 6:
      return 'Trial User';
      break;
    default:
      return "";
  }
}

const UsersListItem = ({ item, eventConfig }: IProps) => {
  const [userType, setUserType] = useState<string>("");  
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const onClose = () => {
    setShowInactiveDialog(false);
  };

  const onLicenseClose = () => {
    setShowLicenseDialog(false);
  };

  const handleInactivation = async () => {
    const res = await api.user.inactiavteUser(selectedId);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowInactiveDialog(false);
  };

  const handleLicensing = async () => {
    const data = {userId: selectedId, userTypeId: 3}
    const res = await api.user.changeUserType(data);
    if (eventConfig?.onRemove) {
      eventConfig?.onRemove();
    }
    setShowLicenseDialog(false);
  };

  const setUser = () => {
    const userType = getUserType(item?.UserTypeID);
    setUserType(userType)
  }

  useMountEvents({
    onMounted: async () => {
      setUser();
    },
  });

  return (
    <>
      <ListItem>
        <ListItemText>
          <Grid container spacing={1}>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.FirstName} {item?.LastName}
            </Grid>
            <Grid item xs={3} className={styles.listAlignment}>
              {item?.EmailAddress}
            </Grid>
            <Grid item xs={2} className={styles.listAlignment}>
              {userType}
            </Grid>
            <Grid item xs={4} className={styles.listAlignment}>
            <Button
                type="button"
                text={`Inactivate`}
                variant="contained"
                size="small"
                color="warning"
                onClick={() => {
                  setSelectedId(item?.UserID);
                  setShowInactiveDialog(true);
                  setSelectedUser(`${item.FirstName} ${item.LastName}`);
                }}
              />
              <span style={{marginLeft: '16px'}}>
              {userType === 'Trial User' || userType === 'Team Member' ? (
                <Button
                  type="button"
                  text={`License User`}
                  variant="contained"
                  size="small"
                  color="warning"
                  onClick={() => {
                    setSelectedId(item?.UserID);
                    setShowLicenseDialog(true);
                    setSelectedUser(`${item.FirstName} ${item.LastName}`);
                  }}
                />
                
              ) : null}
              </span>
             
            </Grid>
            
          </Grid>
        </ListItemText>
      </ListItem>
      <Modal
        title="Inactivate User"
        isOpen={showInactiveDialog}
        handleClose={onClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleInactivation}
        submitText="Yes"
      >
        Are you sure you want to inactivate {selectedUser}?
      </Modal>
      <Modal
        title="License User"
        isOpen={showLicenseDialog}
        handleClose={onLicenseClose}
        closeText="Cancel"
        width="sm"
        handleSubmit={handleLicensing}
        submitText="Yes"
      >
        Are you sure you want to license {selectedUser}?
      </Modal>
    </>
  );
};

export default UsersListItem;

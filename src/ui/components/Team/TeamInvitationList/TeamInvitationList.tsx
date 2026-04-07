import React, { ReactElement } from 'react';
import { Grid, ListItem, ListItemText, TextField, Button, Modal, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import useDataPagination from '~/ui/hooks/useDataPagination';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { SortDirection } from '~/ui/constants/data';
import Icon from '@material-ui/core/Icon';
import CardContent from '@material-ui/core/CardContent';
import DataWrapper from '~/ui/components/Data/DataWrapper';
import useMountEvents from '~/ui/hooks/useMountEvents';
import api from '~/services/api';
import { processServerError } from '~/services/api/errors';
import { useStoreState } from '~/store/hooks';
import styles from './TeamInvitationList.module.css';
import { IDataItemEventConfig } from '~/types/data';
import { Invitation } from '~/types/api/invitation';
import TeamInvitationListItem from '../TeamInvitationListItem/TeamInvitationListItem';


interface IProps {
  onSelect: any;
}

const TeamInvitationList = (): ReactElement => {
    const [data, setData] = React.useState<Invitation[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const { user } = useStoreState(state => state.user);
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'FirstName');
  
    const loadData = async () => {
      try {
        const res = await api.invitation.getInvitationsByTeam(user.UserID);
        console.log(res.data as Invitation[]);
        setData(res?.data as Invitation[]);
      } catch (err) {
        processServerError(err, 'Team.loadHistory');
      }
    };

    const handleRemove = async (comment: Comment, index: number) => {
      await loadData();
    }

    const handleSelect = async (id: number) => {
      // onSelect(id);
    }

    const eventConfig: IDataItemEventConfig = {
      onRemove: handleRemove,
    }

    const close = async ()=> {
      setShowModal(false);
      loadData();
    }
  
    useMountEvents({
      onMounted: async () => {
        loadData();
      },
    });
  
    return (
      <>
        <Card>
          <CardHeader
            title="Invitations"
          />
          <CardContent>                
            <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={2} className={styles.listAlignment}>
                    First Name
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Last Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Email Address
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Expiration Date
                  </Grid>
                  <Grid item xs={1} className={styles.listAlignment}>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
            <DataWrapper
              isGrouped={false}
              paginator={paginator}
              propLabel="item"
              keyLabel="Team"
              component={TeamInvitationListItem}
              eventConfig={eventConfig}
              componentProps={{selectInvitation : handleSelect}}
            />
            
          </CardContent>
        </Card>
      </>
    );
  };
  
  export default TeamInvitationList;
  
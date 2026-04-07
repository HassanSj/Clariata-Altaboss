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
import styles from './TeamMemberList.module.css';
import { processServerError } from '~/services/api/errors';
import { useStoreState } from '~/store/hooks';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {DialogActions} from "@material-ui/core";
import { IDataItemEventConfig } from '~/types/data';
import { TeamMember } from '~/types/api/teamMember';
import TeamForm from '../TeamForm/TeamForm';
import TeamMemberListItem from '../TeamMemberListItem/TeamMemberListItem';
import TeamInviteForm from '../TeamInviteForm/TeamInviteForm';
import { Firm } from '~/types/api/firm';

interface IProps {
  onSelect: any;
}

const TeamMemberList = (): ReactElement => {
    const [data, setData] = React.useState<TeamMember[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [showInviteModal, setShowInviteModal] = React.useState<boolean>(false);
    const [teamMember, setTeamMember] = React.useState();
    const [firm, setFirm] = React.useState<Firm>();
    const { user } = useStoreState(state => state.user);
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'FirstName');
  
    const loadData = async () => {
      try {
        const res = await api.teamMember.getTeamMembers(user.UserID as number);
        console.log(res.data as TeamMember[]);
        setData(res?.data as TeamMember[]);

        const resFirm = await api.firm.getFirm(user.FirmID as number);
        setFirm(resFirm?.data as Firm);
      } catch (err) {
        processServerError(err, 'Firms.loadHistory');
      }
    };

    const handleRemove = async (comment: Comment, index: number) => {
      await loadData();
    }

    const handleSelect = async (id: number) => {
      //Show Modal of Households Assigned to Team Member
    }

    const eventConfig: IDataItemEventConfig = {
      onRemove: handleRemove,
    }

    const close = async ()=> {
      setShowModal(false);
      loadData();
    }

    const closeInviteForm = async ()=> {
        setShowInviteModal(false);
        loadData();
      }
  
    useMountEvents({
      onMounted: async () => {
        loadData();
      },
    });
  
    return (
      <>
        <TeamForm isOpen={showModal} onClose={close} />
        <TeamInviteForm firm={firm} isOpen={showInviteModal} onClose={closeInviteForm} />
        <Card>
          <CardHeader
            title="My Team Members"
            action={
              <>
              <div>
                {/* <Grid container spacing={1}>
                  <Grid item xs={1}>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField id="standard-basic" label="Search" placeholder="Search" fullWidth={true} {...searchText} />
                  </Grid>
                  <Grid item xs={6}>
                    <IconButton
                      color={sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                      onClick={() => setSortDirection(SortDirection.ASC)}
                    >
                      <Icon>arrow_downward</Icon>
                    </IconButton>
                    <IconButton
                      color={sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                      onClick={() => setSortDirection(SortDirection.DESC)}
                    >
                      <Icon>arrow_upward</Icon>
                    </IconButton>
                  </Grid>
                </Grid> */}
              </div>
              </>
            }
          />
          <CardContent>
          <div style={{marginBottom: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={7} style={{textAlign: "right" }}></Grid>
                  <Grid item xs={2} style={{textAlign: "left" }}>
                  <Button type="button"
                            variant="contained"
                            size="medium"
                            color="primary" onClick={() => setShowModal(true)}>ADD ADVISOR</Button>
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "left" }}>
                  <Button type="button"
                            variant="contained"
                            size="medium"
                            color="primary" onClick={() => setShowInviteModal(true)}>INVITE TEAM Member</Button>
                  </Grid>
                </Grid>
              </div>
                
            <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={3} className={styles.listAlignment}>
                    First Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Last Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Email Address
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
            <DataWrapper
              isGrouped={false}
              paginator={paginator}
              propLabel="item"
              keyLabel="Firm"
              component={TeamMemberListItem}
              eventConfig={eventConfig}
              componentProps={{selectTeamMember : handleSelect}}
            />
            
          </CardContent>
        </Card>
        
      </>
    );
  };
  
  export default TeamMemberList;
  
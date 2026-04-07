import React, { ReactElement, useEffect } from 'react';
import { Grid, ListItem, ListItemText, TextField, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
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
import styles from './TeamHouseholdList.module.css';
import { processServerError } from '~/services/api/errors';
import { useStoreState } from '~/store/hooks';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {DialogActions} from "@material-ui/core";
import { IDataItemEventConfig } from '~/types/data';
import { TeamMemberHousehold } from '~/types/api/teamMemberHousehold';
import TeamHouseholdListItem from '../TeamHouseholdListItem/TeamHouseholdListItem';
import Modal from "~/ui/components/Dialogs/Modal";
import TeamHouseholdForm from '../TeamHouseholdForm/TeamHouseholdForm';

interface IProps {
    teamMemberId: number;
    isOpen: boolean;
    onClose: any;
}

const TeamHouseholdList = ({teamMemberId, isOpen, onClose}: IProps): ReactElement => {
    const [data, setData] = React.useState<TeamMemberHousehold[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [teamHouseholds, setTeamHouseholds] = React.useState();
    const { user } = useStoreState(state => state.user);
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'FirstName');
  
    const loadData = async () => {
      try {
        const res = await api.teamMemberHousehold.getTeamMemberHouseholds(teamMemberId);
        console.log(res.data as TeamMemberHousehold[]);
        setData(res?.data as TeamMemberHousehold[]);
        
      } catch (err) {
        processServerError(err, 'TeamHouseholds.loadHistory');
      }
    };

    const handleRemove = async (comment: Comment, index: number) => {
      await loadData();
    }

    const handleSelect = async (id: number) => {
      
    }

    const eventConfig: IDataItemEventConfig = {
      onRemove: handleRemove,
    }

    const close = async ()=> {
      setShowModal(false);
      loadData();
    }

    const closeInviteForm = async ()=> {
        loadData();
      }
  
    useEffect(() => {
        loadData();
      },[]);
  
    return (
      <>
        <TeamHouseholdForm teamMemberId={teamMemberId} isOpen={showModal} onClose={close} />
        <Card>
          <CardContent>
          <div style={{marginBottom: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={7} style={{textAlign: "right" }}></Grid>
                  <Grid item xs={2} style={{textAlign: "left" }}>
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "right" }}>
                  <Button type="button"
                            variant="contained"
                            size="small"
                            color="primary" onClick={() => setShowModal(true)}>Add Household</Button>
                  </Grid>
                </Grid>
              </div>
                
            <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Household Name
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Permission
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
              keyLabel="TeamHousehold"
              component={TeamHouseholdListItem}
              eventConfig={eventConfig}
              componentProps={{selectTeamMember : handleSelect}}
            />
            
          </CardContent>
        </Card>
      </>
    );
  };
  
  export default TeamHouseholdList;
  
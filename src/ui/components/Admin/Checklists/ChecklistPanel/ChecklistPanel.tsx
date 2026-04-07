import React, { ReactElement } from 'react';
import { Grid, ListItem, ListItemText, TextField, Button, InputLabel } from '@material-ui/core';
import useDataPagination from '~/ui/hooks/useDataPagination';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { SortDirection } from '~/ui/constants/data';
import CardContent from '@material-ui/core/CardContent';
import DataWrapper from '~/ui/components/Data/DataWrapper';
import useMountEvents from '~/ui/hooks/useMountEvents';
import api from '~/services/api';
import { Checklist } from '~/types/api/checklist';
import { processServerError } from '~/services/api/errors';
import ResourceItem from "~/ui/components/Admin/Resources/ResourceItem";
import styles from './ChecklistPanel.module.css';
import AdminWrapper from '../../AdminWrapper';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import { IDataItemEventConfig } from '~/types/data';
import ChecklistItem from '../ChecklistItem/ChecklistItem';

interface IProps {
  data:any[];
  showAddForm: any;
  showEditForm: any;
  showDelete: any; 
  closeAddForm: any;
  closeEditForm: any;
  closeDelete: any;
  eventConfig:any;
}

const ChecklistPanel = ( {data, showAddForm, showEditForm, showDelete, closeAddForm, closeEditForm, closeDelete, eventConfig} : IProps): ReactElement => {
    const [resData, setData] = React.useState<Checklist[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [order, setOrder] = React.useState<boolean>(false);
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'ChecklistName');

    const loadData = async () => {
      try {
        const res = await api.checklists.getAllChecklists();
        setData(res.data as Checklist[]);
      } catch (err) {
        processServerError(err, 'Checklists.loadHistory');
      }
    };

    const handleRemove = async () => {
      await loadData();
    }

    const handleEdit = async () => {
      await loadData();
    }

    const close = async ()=> {
      setShowModal(false);
      loadData();
    }

    const showAdd = () => {
      showAddForm();
    }

    // const showDestinyAdd = () => {
    //   showAddForm();
    // }

    const showEdit = (id:number) => {
      showEditForm(id);
    }  
  
    useMountEvents({
      onMounted: async () => {
        loadData();
      },
    });

    return (
      <>
      <AdminWrapper tab={AdminNavigationTab.CHECKLISTS}>
        <Card>
          <CardHeader
            title="Checklists"
            action={
              <>
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={3} style={{fontWeight: "700" }} >
                  <InputLabel  className="m-t-10 p-l-10" >Search</InputLabel>
                  </Grid>
                  <Grid item xs={6} className="m-r-10">
                    <TextField id="standard-basic"   placeholder="Search" fullWidth={true} {...searchText} />
                  </Grid>
                </Grid>
              </div>
              </>
            }
          />
          <CardContent>
          <div style={{marginBottom: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}  style={{ textAlign: "right", marginRight: "63px"  }}>
                  <Button type="button"
                  id="standard-basic" 
                            variant="contained"
                            size="medium"
                            color="primary" onClick={() => showAdd()}>ADD</Button>
                  </Grid>
                </Grid>
              </div>
                
            <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={5} className={styles.listAlignment}>
                    <Button 
                    variant='text'
                    onClick={
                      () => {
                        setOrder(!order)
                        order ? setSortDirection(SortDirection.ASC) : setSortDirection(SortDirection.DESC)
                      }
                    }
                    size="large"
                    >
                    NAME
                    </Button>
                  </Grid>
                  <Grid item xs={5} className={styles.listAlignment}>
                    TYPE
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
            <DataWrapper
              isGrouped={false}
              paginator={paginator}
              propLabel="item"
              keyLabel="Checklist"
              component={ChecklistItem}
              eventConfig={eventConfig}
              componentProps={{displayEdit : showEdit}}
            />
          </CardContent>
        </Card>
        </AdminWrapper>
      </>
    );
  };
  
  export default ChecklistPanel;
  
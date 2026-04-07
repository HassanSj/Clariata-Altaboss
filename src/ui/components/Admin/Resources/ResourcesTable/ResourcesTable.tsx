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
import { Resource } from '~/types/api/resource';
import { processServerError } from '~/services/api/errors';
import ResourceItem from "~/ui/components/Admin/Resources/ResourceItem";
import styles from './ResourcesTable.module.css';
import AdminWrapper from '../../AdminWrapper';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import AddResourceForm from '../AddResourceForm/AddResourceForm';
import { IDataItemEventConfig } from '~/types/data';

interface IProps {
  item?: Resource;
  isOpen: boolean;
  onClose: () => unknown;
}

const ResourcesTable = (): ReactElement => {
    const [data, setData] = React.useState<Resource[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [order, setOrder] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'ResourceTitle');

    const mapResourceUrl = async (res: any) => { 
      const data = res.data.map(async (item:any) => {
        if(item?.ResourceUrl.includes("Checklist=")){
          const resp = await api.checklists.getOneChecklists(Number(item!.ResourceUrl!.substring(item!.ResourceUrl!.indexOf('=') + 1)));
          item.ResourceUrl = resp.data.ChecklistName;
        }
        return item
      })
      return Promise.all(data)
    }
  
    const loadData = async () => {
      try {
        setLoading(true);
        let res = await api.resource.getAllResources();
        let data = await mapResourceUrl(res)
        setData(data as Resource[]);
      } catch (err) {
        processServerError(err, 'Resources.loadHistory');
      } finally {
        setLoading(false)
      }
    };

    const handleRemove = async () => {
      await loadData();
    }

    const handleEdit = async () => {
      await loadData();
    }

    const eventConfig: IDataItemEventConfig = {
      onRemove: handleRemove,
      onDataChange: handleEdit
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
      <AdminWrapper tab={AdminNavigationTab.RESOURCES}>
        <AddResourceForm isOpen={showModal} onClose={close} />
        <Card>
          <CardHeader
            title="Resources"
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
                            color="primary" onClick={() => setShowModal(true)}>ADD</Button>
                  </Grid>
                </Grid>
              </div>
                
            <ListItem className={styles.listHeader}>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={2} className={styles.listAlignment}>
                    <Button 
                    variant='text'
                    onClick={
                      () => {
                        setOrder(!order)
                        order ? setSortDirection(SortDirection.ASC) : setSortDirection(SortDirection.DESC)
                      }
                    }
                    >
                    Name
                    </Button>
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Description
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    URL | Checklist | Document
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Module
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
            <DataWrapper
              isGrouped={false}
              paginator={paginator}
              componentProps={{loading: loading}}
              propLabel="item"
              keyLabel="Resource"
              component={ResourceItem}
              eventConfig={eventConfig}
            />
          </CardContent>
        </Card>
        </AdminWrapper>
      </>
    );
  };
  
  export default ResourcesTable;
  
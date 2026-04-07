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
import styles from './FirmList.module.css';
import AdminWrapper from '../../AdminWrapper';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {DialogActions} from "@material-ui/core";
import { IDataItemEventConfig } from '~/types/data';
import { Firm } from '~/types/api/firm';
import FirmForm from '../FirmForm/FirmForm';
import FirmItem from '../FirmItem/FirmItem';

interface IProps {
  onSelect: any;
}

const FirmList = ({ onSelect }: IProps): ReactElement => {
    const [data, setData] = React.useState<Firm[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [firm, setFirm] = React.useState<Firm>();
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'FirmName');
  
    const loadData = async () => {
      try {
        const res = await api.firm.getFirms();
        console.log(res.data as Firm[]);
        setData(res?.data as Firm[]);
      } catch (err) {
        processServerError(err, 'Firms.loadHistory');
      }
    };

    const handleRemove = async (comment: Comment, index: number) => {
      await loadData();
    }

    const handleSelect = async (id: number) => {
      console.log("FirmID: ");
      console.log(id);
      onSelect(id);
    }

    const handleEdit = async (item: Firm) => {
      setFirm(item);
      setShowModal(true);
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
      <AdminWrapper tab={AdminNavigationTab.FIRMS}>
        <FirmForm item={firm} isOpen={showModal} onClose={close} />
        <Card>
          <CardHeader
            title="Firms"
            action={
              <>
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                  </Grid>
                  <Grid item xs={4}>
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
                </Grid>
              </div>
              </>
            }
          />
          <CardContent>
          <div style={{marginBottom: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={10} style={{textAlign: "right" }}></Grid>
                  <Grid item xs={2} style={{textAlign: "left" }}>
                  <Button type="button"
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
                    Firm Name
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Primary Contact
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Primary Email Address
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Domain
                  </Grid>
                  <Grid item xs={1} className={styles.listAlignment}>
                  </Grid>
                  <Grid item xs={1} className={styles.listAlignment}>
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
              keyLabel="Firm"
              component={FirmItem}
              eventConfig={eventConfig}
              componentProps={{selectFirm : handleSelect, editFirm: handleEdit}}
            />
            
          </CardContent>
        </Card>
        </AdminWrapper>
        
      </>
    );
  };
  
  export default FirmList;
  
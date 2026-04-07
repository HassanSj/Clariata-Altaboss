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
import { RegistrationCode } from '~/types/api/registrationcode';
import { processServerError } from '~/services/api/errors';
import { useStoreState } from '~/store/hooks';
import RegistrationCodeItem from "~/ui/components/Admin/RegistrationCodes/RegistrationCodeItem"
import styles from './RegistrationCodeList.module.css';
import AdminWrapper from '../../AdminWrapper';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {DialogActions} from "@material-ui/core";
import RegistrationCodeForm from '../RegistrationCodeForm/RegistrationCodeForm';
import { IDataItemEventConfig } from '~/types/data';

interface IProps {
  item?: RegistrationCode;
  isOpen: boolean;
  onClose: () => unknown;
}

const RegistrationCodeList = (): ReactElement => {
    const [data, setData] = React.useState<RegistrationCode[]>([]);
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [registrationCode, setRegistrationCode] = React.useState('')
    const [emailAddress, setEmailAddress] = React.useState('')
    const [issuedTo, setIssuedTo] = React.useState('')
  
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'RegistrationCode');
  
    const loadData = async () => {
      try {
        const res = await api.registrationcode.getRegistrationCodes();
        console.log(res.data as RegistrationCode[]);
        setData(res?.data as RegistrationCode[]);
      } catch (err) {
        processServerError(err, 'RegistrationCodes.loadHistory');
      }
    };

    const handleRemove = async (comment: Comment, index: number) => {
      await loadData();
    }

    const eventConfig: IDataItemEventConfig = {
      onRemove: handleRemove
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
        <RegistrationCodeForm isOpen={showModal} onClose={close} />
        <Card>
          <CardHeader
            title="Registration Codes"
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
                    Registration Code
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Issued To
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    Email Address
                  </Grid>
                  <Grid item xs={2} className={styles.listAlignment}>
                    Issued Date
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
              keyLabel="RegistrationCode"
              component={RegistrationCodeItem}
              eventConfig={eventConfig}
            />
            
          </CardContent>
        </Card>
        </AdminWrapper>
        
      </>
    );
  };
  
  export default RegistrationCodeList;
  
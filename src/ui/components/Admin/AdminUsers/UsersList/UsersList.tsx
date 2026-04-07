import React, { ReactElement, useEffect } from 'react';
import { Grid, ListItem, ListItemText, TextField } from '@material-ui/core';
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
import { User } from '~/types/api/user';
import { processServerError } from '~/services/api/errors';
import UsersListItem from '~/ui/components/Admin/AdminUsers/UserListItem';
import { useStoreState } from '~/store/hooks';
import styles from './UsersList.module.css';
import AdminWrapper from '../../AdminWrapper';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import { IDataItemEventConfig } from '~/types/data';
import Button from '~/ui/components/Button';

interface IUserListProps {
  firmId: number;
  onReturn: any
}

const UsersList = ({firmId, onReturn} : IUserListProps): ReactElement => {
  const [data, setData] = React.useState<User[]>([]);

  const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'FirstName');

  const loadData = async () => {
    try {
      console.log("Load Firm Users:" + firmId);
      const res = await api.user.getUsersByFirm(firmId);
      console.log(res);
      setData(res?.data as User[]);
    } catch (err) {
      processServerError(err, 'UsersList.loadHistory');
    }
  };

  const handleRemove = async (comment: Comment, index: number) => {
    await loadData();
  }

  useEffect(() => {
      loadData();
    }, []);

  // Data event config
  const eventConfig: IDataItemEventConfig = {
    onRemove: handleRemove
  }

  return (
    <>
    <AdminWrapper tab={AdminNavigationTab.FIRMS}>
    <Button type="button"
                  text={`Return to Firms`}
                  variant="text"
                  size="small"
                  color="default"
                  onClick={() => {
                    onReturn()
                  }} />
            
      <Card>
        <CardHeader
          title="Users List"
          action={
            <>
              <Grid container spacing={1}>
                <Grid item xs={6}>
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
            </>
          }
        />
        <CardContent>
          <ListItem className={styles.listHeader}>
            <ListItemText>
              <Grid container spacing={1}>
                <Grid item xs={3} className={styles.listAlignment}>
                  Name
                </Grid>
                <Grid item xs={3} className={styles.listAlignment}>
                  Email Address
                </Grid>
                <Grid item xs={2} className={styles.listAlignment}>
                  User Type
                </Grid>
                <Grid item xs={4} className={styles.listAlignment}>
                  Action
                </Grid>
                
              </Grid>
            </ListItemText>
          </ListItem>
          <DataWrapper
            isGrouped={false}
            paginator={paginator}
            propLabel="item"
            keyLabel="EmailAddress"
            component={UsersListItem}
            eventConfig={eventConfig}
          />
        </CardContent>
      </Card>
      </AdminWrapper>
    </>
  );
};

export default UsersList;

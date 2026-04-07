import React, {ReactElement} from 'react';
import {Button, CardActions, Grid, TextField} from "@material-ui/core";
import useDataPagination from "~/ui/hooks/useDataPagination";
import {useStoreState} from "~/store/hooks";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import {SortDirection} from "~/ui/constants/data";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import SharingItem from '../SharingItem';
import EditSharing from "~/ui/components/Sharing/EditSharing";

const SharingList = (): ReactElement => {
  const { permissions } = useStoreState(state => state.user);

  const {
    searchText,
    sortDirection,
    setSortDirection,
    paginator
  } = useDataPagination(permissions, 8, 'SharedWith');
  const [showEdit, setShowEdit] = React.useState(false);

    return (
      <>
        <Card>
          <CardHeader title="Permissions"
                      action={
                        <>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <TextField id="standard-basic"
                                         label="Search"
                                         placeholder="Search"
                                         fullWidth={true}
                                         {...searchText} />
                            </Grid>
                            <Grid item xs={6}>
                              <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                          onClick={() => setSortDirection(SortDirection.ASC)}>
                                <Icon>arrow_downward</Icon>
                              </IconButton>
                              <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                          onClick={() => setSortDirection(SortDirection.DESC)}>
                                <Icon>arrow_upward</Icon>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </>
                      } />
          <CardContent>
            <DataWrapper isGrouped={false}
                         paginator={paginator}
                         propLabel="item"
                         keyLabel="SharingItemID"
                         component={SharingItem} />
          </CardContent>
          <CardActions>
            <Button onClick={() => setShowEdit(true)}
                    size="large"
                    color='primary'>
              Add Permission
            </Button>
          </CardActions>
        </Card>
        <EditSharing isOpen={showEdit}
                     onClose={() => setShowEdit(false)}></EditSharing>
      </>
    )
}

export default SharingList;

import React, {ReactElement} from 'react';
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import useDataPagination from "~/ui/hooks/useDataPagination";
import {useStoreActions, useStoreState} from "~/store/hooks";
import IconButton from "@material-ui/core/IconButton";
import {SortDirection} from "~/ui/constants/data";
import Icon from "@material-ui/core/Icon";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import SharingItem from '../SharingItem';
import EditSharing from "~/ui/components/Sharing/EditSharing";
import Modal from '../../Dialogs/Modal';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import validate from './form/validate';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import api from '~/services/api';
import useMountEvents from '~/ui/hooks/useMountEvents';
import initialValues from './form/initialValues';
import { IFormActionProps } from '~/types/forms';
import { SharedItem } from '~/types/api/sharedItem';
import { ApiRequestType, OwnerModelType, OwnerType } from '~/ui/constants/api';
import { OwnerParams } from '~/types/relations';
import { AxiosResponse } from 'axios';
import { extractServerError, processServerError } from '~/services/api/errors';
import useNotifications from '~/ui/hooks/useNotifications';

interface IProps {
  isOpen: boolean;
  onClose: () => unknown;
}

const SharingModal = ({ isOpen, onClose }: IProps): ReactElement => {

  const notifications = useNotifications();
  const { permissions } = useStoreState(state => state.user);
  const {selectedHousehold} = useStoreState(state => state.household);
  const { user } = useStoreState(state => state.user);
  const { shareType } = useStoreState(state => state.constants);
  const { onPopulatePermissions } = useStoreActions(actions => actions.user);

  const {
    searchText,
    sortDirection,
    setSortDirection,
    paginator
  } = useDataPagination(permissions, 8, 'EmailAddress');

  const [showEdit, setShowEdit] = React.useState(false);
  const [permission, setPermission] = React.useState('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPermission(event.target.value as string);
  };

  const shareItem = async (values: any, { setErrors }: IFormActionProps) => {
    let sharedItem: SharedItem = { 
      ItemTypeID: 1, 
      ShareTypeID: values.Permission, 
      SharedItemObjectID: selectedHousehold?.HouseholdID,
      SharedBy: user?.UserID,
      EmailAddress: values.Email,
    };

    const params: OwnerParams = {
      ownerType: OwnerType.HOUSEHOLD,
      requestType: ApiRequestType.CREATE_UPDATE,
      modelName: OwnerModelType.SHAREDITEM,
      userId: user?.UserID,
      householdId: selectedHousehold?.HouseholdID,
    };

    try {
      notifications.toggleLoading(true);
      try {
          const res = await api.shareditem.createOrUpdate(params, sharedItem);
          onPopulatePermissions(null);
          onClose();
      } catch (err) {
          setErrors({ backError: extractServerError(err) });
      }
      notifications.toggleLoading(false);
    } catch (err) {
      processServerError(err, 'SharedItem.createOrUpdate');
    }
  
  }  

  return (
    <>
      <Modal title="Permissions" isOpen={isOpen} handleClose={onClose}>
        <div>
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
        </div>
        <DataWrapper isGrouped={false}
                     paginator={paginator}
                     propLabel="item"
                     keyLabel="SharingItemID"
                     component={SharingItem} />
        <FormWrapper  initialValues={initialValues}
                      validationSchema={validate}
                      onSubmit={shareItem}
                      successMessage="Shared Household!">
        <Grid container spacing={1}>
          <Grid item xs={6}>
          <InputField type="text"
                                name="Email"
                                component={Input}
                                label="Email"
                                placeholder="Enter an Email address to share this household with"/>
          </Grid>
          <Grid item xs={4}>
              <InputField type="select"
                            name="Permission"
                            component={Input}
                            isMultiselect={false}
                            placeholder="Permission"
                            label="Permission"
                            items={shareType}
                            labelField="ShareType"
                            valueField="ShareTypeID"/>
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={2} justifyContent="center">
            <Button size='large' type="submit" variant="outlined" fullWidth={true} disableElevation>Share</Button>
          </Grid>
        </Grid>
        </FormWrapper>
      </Modal>
      <EditSharing isOpen={showEdit}
                   onClose={() => setShowEdit(false)}></EditSharing>
    </>
  )
}

export default SharingModal;

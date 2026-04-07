import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";

const onPopulatePermissions: Thunk<IUserStorageModel, unknown> = thunk(async ({ populatePermissions }, payload, helpers) => {
  const store: any = helpers.getStoreState();
  try {
    const params: OwnerParams = {
      ownerType: OwnerType.HOUSEHOLD,
      requestType: ApiRequestType.LIST,
      modelName: OwnerModelType.SHAREDITEM,
      userId: store?.user?.UserID,
      householdId: store?.household?.selectedHousehold?.HouseholdID,
    };
    const res: AxiosResponse = await api.shareditem.list(params);
    populatePermissions(res?.data);
  } catch (err) {
    processServerError(err, 'user.settings.onPopulatePermissions');
  }
});

export default onPopulatePermissions;

import { thunk, Thunk, useStoreActions } from 'easy-peasy';
import { AxiosResponse } from 'axios';
import api from 'services/api';
import { OwnerParams } from "~/types/relations";
import { ApiRequestType, OwnerModelType, OwnerType } from "~/ui/constants/api";
import { processServerError } from 'services/api/errors';
import { IHouseholdStoreModel } from "~/types/household/store";
import { Household } from "~/types/api/household";

interface IPayload {
  householdID: number;
  household: Household
}

const onRemove: Thunk<IHouseholdStoreModel, IPayload> = thunk(async ({ populate, select, onPopulate }, { householdID, household }: IPayload, helpers) => {
  const store: any = helpers.getStoreState();

  const selectedHouseholdID = store?.household?.selectedHousehold?.HouseholdID;
  try {

    //just for testing purpose 
    const getSelectedList = await api.objective.getSelectedList(selectedHouseholdID);
    console.log('getSelectedList:', getSelectedList)

    // Delete the household
    const removeResponse: AxiosResponse = await api.household.remove(householdID, household);
    // Repopulate list of households
    const listResponse: AxiosResponse = await api.household.list();

    // working on shared household not deleteing on deleting the household from owner side 
    try {
      const listParams: OwnerParams = {
        ownerType: OwnerType.HOUSEHOLD,
        requestType: ApiRequestType.LIST,
        modelName: OwnerModelType.SHAREDITEM,
        userId: store?.user?.user?.UserID,
        householdId: householdID
      };
      const sharedItemList: AxiosResponse = await api.shareditem.list(listParams);
      if (sharedItemList.data) {
        sharedItemList.data.map(async (value: any, key: any) => {
          const removeParams: OwnerParams = {
            ownerType: OwnerType.HOUSEHOLD,
            requestType: ApiRequestType.REMOVE,
            modelName: OwnerModelType.SHAREDITEM,
            userId: store?.user?.user?.UserID,
            modelId: value.SharedItemID,
            householdId: householdID
          };
          const response: AxiosResponse = await api.shareditem.remove(removeParams, value.SharedItemID);
        })
      }
    } catch (error) {
      console.log(error)
      processServerError(error, 'household.onRemove');
    }

    // console.log(listResponse.data);
    populate(listResponse.data);
    onPopulate(listResponse.data)

    // Reset selected if the household is the currently selected household
    if (householdID === selectedHouseholdID) {
      select(null);
    }
  } catch (err) {
    processServerError(err, 'household.onRemove');
  }
});

export default onRemove;

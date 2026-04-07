import {thunk, Thunk} from 'easy-peasy';
import api from 'services/api';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import {processServerError} from 'services/api/errors';
import {Objective} from "~/types/api/objective";
import {ActionItem} from "~/types/api/actionItem";
import {hasItems} from "~/ui/constants/utils";

const onPopulate: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ populate }, payload: IObjectiveStorePayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();

  if (!store?.household?.selectedHousehold?.HouseholdID || !store?.interview?.dreamInterviewId){
    return;
  }
  const isAll = (IObjectiveDataType.ALL === payload?.type);

  // Objectives
  if ((IObjectiveDataType.OBJECTIVE === payload?.type || isAll) && !payload.force) {
    try {

      // Fetch
      const res: Objective[] = await api.objective.listFull(
        store?.household?.selectedHousehold?.HouseholdID,
        store?.interview?.dreamInterviewId,
        store?.constants?.dimensionsOfLife,
        store?.constants?.metricsOfSuccess);

      const selected = await api.objective.getSelectedList(store?.household?.selectedHousehold?.HouseholdID);
      let objectiveIds: { [key: string]: boolean }[] = [];
      selected?.data?.SelectedObjectiveList?.forEach((o: any) => objectiveIds = { ...objectiveIds, [String(o.ObjectiveID)]: true });

      if(actions.objective) {
        const selectedID = store?.objective?.selectedObjective?.ObjectiveID
        const objective = res.find(o => o.ObjectiveID === selectedID)

        if(objective) {
          actions.objective.onSelect({
            type: IObjectiveDataType.OBJECTIVE,
            objective,
            objectiveId: objective?.ObjectiveID
          })
        }
      }

      // Populate store
      await populate({
        type: IObjectiveDataType.OBJECTIVE,
        objectives: res,
        objectiveIds
      });

      // Action items
      if (isAll && res) {
        const actionItems: ActionItem[] = [];
        const promises: any = [];
        res.forEach((o: Objective) => {
          promises.push(api.actionitem.listFull(
            store?.household?.selectedHousehold?.HouseholdID,
            o?.ObjectiveID,
            store?.interview?.dreamInterviewId)
            .then((objectiveItemsResp: ActionItem[]) => {
              if (objectiveItemsResp && hasItems(objectiveItemsResp)) {
                actionItems.push(...objectiveItemsResp);
              }
          }));
        });
        await Promise.all(promises);
        populate({
          type: IObjectiveDataType.ACTION_ITEM,
          actionItems
        });
      }

    } catch (err) {
      processServerError(err, 'objective.onPopulate');
    }
  }

  // Action items
  if ((IObjectiveDataType.ACTION_ITEM === payload?.type) && !payload.force) {
    // Fetch
    const res = await api.actionitem.listFull(
      store?.household?.selectedHousehold?.HouseholdID,
      store?.objective?.selectedObjective?.ObjectiveID,
      store?.interview?.dreamInterviewId);
    // Populate store
    populate({
      type: IObjectiveDataType.ACTION_ITEM,
      actionItems: res
    });
  }

  // Force update (i.e. don't fetch; use items in payload to re-populate)
  if (payload.force) {
    if (IObjectiveDataType.OBJECTIVE === payload?.type || isAll) {
      populate({
        type: IObjectiveDataType.OBJECTIVE,
        objectives: payload.objectives
      });
    }
    if (IObjectiveDataType.ACTION_ITEM === payload?.type || isAll) {
      populate({
        type: IObjectiveDataType.ACTION_ITEM,
        actionItems: payload.actionItems
      });
    }
  }

});

export default onPopulate;

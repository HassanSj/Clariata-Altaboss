import {thunk, Thunk} from 'easy-peasy';
import api from '~/services/api';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const onSelect: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ select, populate }, payload: IObjectiveStorePayload, helpers) => {

  if (IObjectiveDataType.OBJECTIVE === payload?.type) {
    const store: any = helpers.getStoreState();
    const res = await api.objective.getCompletedList(store?.household?.selectedHousehold?.HouseholdID, Number(payload?.objectiveId));
    const completedPrioritySections = JSON.parse(JSON.stringify((payload?.completedPrioritySections ?? {})[Number(payload?.objectiveId)] ?? {}));
    res?.data?.CompletedTabList?.forEach((d: any) => completedPrioritySections[Number(d?.PriorityTabID) - 1] = true);
    payload.completedPrioritySections = completedPrioritySections;
  }

  if(IObjectiveDataType.OBJECTIVE_IDS === payload?.type) {
    const store: any = helpers.getStoreState();
    const res = payload.selected ?  await api.objective.select(store?.household?.selectedHousehold?.HouseholdID, Number(payload?.objectiveId)) : await api.objective.unSelect(store?.household?.selectedHousehold?.HouseholdID, Number(payload?.objectiveId));
  }

  select(payload);
});

export default onSelect;

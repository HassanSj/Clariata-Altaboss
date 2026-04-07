import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel} from "~/types/objective/store";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {Objective} from "~/types/api/objective";
import {hasItems} from "~/ui/constants/utils";

const onRankUpdate: Thunk<IObjectiveStoreModel, Objective[]> = thunk(async ({ populate }, payload: Objective[], helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();
  if (hasItems(payload) && payload) {
    try {

      // Re-assign ranking
      payload.forEach((o: Objective, index: number) => {
        o.Rank = (index + 1);
      });

      // Save updated ranking
      await api.objective.updateList(
        store.household.selectedHousehold?.HouseholdID,
        store.interview.dreamInterviewId,
        payload);

      // // Update store
      // populate({
      //   type: IObjectiveDataType.OBJECTIVE,
      //   objectives: payload
      // });
      await actions.objective.onPopulate({type:IObjectiveDataType.OBJECTIVE})
    } catch (err) {

      processServerError(err, 'objective.onRankUpdate');
    }
  }

});

export default onRankUpdate;

import {action, Action} from 'easy-peasy';
import {Household} from 'types/api/household';
import {IHouseholdStoreModel} from "~/types/household/store";

const updateSelectedHousehold: Action<IHouseholdStoreModel> = action((state: any) => {
  if (state.households) {
    console.log(state.households)
    // Update selected household
    if (state.selectedHousehold) {
      const index = state.households.findIndex((h: Household) => state.selectedHousehold.HouseholdID === h?.HouseholdID);
      if (index >= 0) {
        state.selectedHousehold = state.households[index];
      }
    }
  }
});

export default updateSelectedHousehold;

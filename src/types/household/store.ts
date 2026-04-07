import {Action, Thunk} from 'easy-peasy';
import {Household} from "~/types/api/household";

export interface IHouseholdStoreModel {
  selectedHousehold: Household;
  households: Household[];
  select: Action<IHouseholdStoreModel, unknown>;
  onSelect: Thunk<IHouseholdStoreModel, unknown>;
  populate: Action<IHouseholdStoreModel, unknown>;
  onPopulate: Thunk<IHouseholdStoreModel, unknown>;
  onRemove: Thunk<IHouseholdStoreModel, unknown>;
  clear: Action<IHouseholdStoreModel, unknown>;
  updatePerson: Action<IHouseholdStoreModel, unknown>;
  updateSelectedHousehold: Action<IHouseholdStoreModel>;
}

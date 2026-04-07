import {action, Action} from 'easy-peasy';
import {Household} from 'types/api/household';
import {IHouseholdStoreModel} from "~/types/household/store";
import {Person} from "~/types/api/person";

interface IPayload {
  person: Person
}

const updatePerson: Action<IHouseholdStoreModel, IPayload> = action((state: any, payload: IPayload) => {
  if (state.households) {
    // Update person in households
    state.households.forEach((h: Household) => {
      if (h.Persons) {
        const index = h.Persons.findIndex((p: Person) => p.PersonID === payload.person?.PersonID);
        if (index >= 0) {
          h.Persons[index] = payload.person;
        }
      }
    });
    // Update selected household
    if (state.selectedHousehold) {
      const index = state.households.findIndex((h: Household) => state.selectedHousehold.HouseholdID === h?.HouseholdID);
      if (index >= 0) {
        state.selectedHousehold = state.households[index];
      }
    }
  }
});

export default updatePerson;

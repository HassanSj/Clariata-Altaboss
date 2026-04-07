import {action, Action} from 'easy-peasy';
import {Person} from "~/types/api/person";
import {IPersonStoreModel} from "~/types/person/store";

interface  IPayload {
  person: Person
}

const update: Action<IPersonStoreModel, IPayload> = action((state: any, payload: IPayload) => {
  // Update user in list of persons
  if (!state.persons) {
    state.persons = [];
  }
  const index = state.persons.findIndex((p: Person) => p.PersonID === payload.person.PersonID);
  if (index >= 0){
    state.persons[index] = payload.person;
  }
  // Update selected persons
  if (state.selectedPerson?.PersonID === payload.person?.PersonID) {
    state.selectedPerson = payload.person;
  }
});

export default update;

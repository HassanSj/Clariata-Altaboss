import {thunk, Thunk} from 'easy-peasy';
import {IPersonStoreModel} from "~/types/person/store";
import {Person} from "~/types/api/person";
import {populatePhotos} from "~/ui/constants/person";

interface  IPayload {
  person: Person
}

const onUpdate: Thunk<IPersonStoreModel, IPayload> = thunk(async ({ update }, payload: IPayload, helpers) => {
  const actions: any = helpers.getStoreActions();
  if (!payload?.person) return;
  payload.person = await populatePhotos(payload.person);
  // Update person in persons store
  update(payload);
  // Update person in household store
  actions.household.updatePerson(payload);
});

export default onUpdate;

import {action, Action} from 'easy-peasy';
import {Person} from 'types/api/person';
import {IPersonStoreModel} from "~/types/person/store";

const populate: Action<IPersonStoreModel, Person[]> = action((state: any, payload: any) => {
  state.persons = payload;
});

export default populate;

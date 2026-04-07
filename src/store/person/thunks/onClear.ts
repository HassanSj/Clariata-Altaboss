import {thunk, Thunk} from 'easy-peasy';
import {IPersonStoreModel} from "~/types/person/store";

const onClear: Thunk<IPersonStoreModel> = thunk(async ({ clear }) => {
  clear(null);
});

export default onClear;

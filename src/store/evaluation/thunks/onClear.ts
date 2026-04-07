import {thunk, Thunk} from 'easy-peasy';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";

const onClear: Thunk<IClientEvaluationStoreModel> = thunk(async ({ clear }) => {
  clear(null);
});

export default onClear;

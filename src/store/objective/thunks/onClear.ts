import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const onClear: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ clear }, payload: IObjectiveStorePayload) => {
  clear(payload);
});

export default onClear;

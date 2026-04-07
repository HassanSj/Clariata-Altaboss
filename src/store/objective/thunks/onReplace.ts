import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const onReplace: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ update }, payload: IObjectiveStorePayload, helpers) => {
  update(payload);
});

export default onReplace;

import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from "~/services/api/errors";
import {ILayoutStoreModel} from "~/types/layout/store";

const onDragging: Thunk<ILayoutStoreModel, null> = thunk(async ({ setDragging }: any, payload: any) => {
  try {
    setDragging(payload);
  } catch (err) {
    processServerError(err, 'onDragging');
  }
});

export default onDragging;

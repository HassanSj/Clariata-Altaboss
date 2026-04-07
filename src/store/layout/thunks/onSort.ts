import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from "~/services/api/errors";
import {ILayoutStoreModel} from "~/types/layout/store";

const onSort: Thunk<ILayoutStoreModel, null> = thunk(async ({ setSorting }: any, payload: any) => {
  try {
    setSorting(payload);
  } catch (err) {
    processServerError(err, 'layout.onSort');
  }
});

export default onSort;

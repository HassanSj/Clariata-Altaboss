import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from "~/services/api/errors";
import {ILayoutStoreModel} from "~/types/layout/store";

const onTableChange: Thunk<ILayoutStoreModel, null> = thunk(async ({ setCurrentTable }: any, payload: any) => {
  try {
    setCurrentTable(payload);
  } catch (err) {
    processServerError(err, 'layout.setCurrentTable');
  }
});

export default onTableChange;

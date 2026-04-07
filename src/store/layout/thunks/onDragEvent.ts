import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from "~/services/api/errors";
import {ILayoutStoreModel} from "~/types/layout/store";

const onDragEvent: Thunk<ILayoutStoreModel, null> = thunk(async ({ setLastDragEvent, setDragging }: any, payload: any) => {
  try {
    // TODO - don't need this or it's related action anymore
    // setLastDragEvent(payload);
    // setDragging(!isNullOrUndefined(payload));
  } catch (err) {
    processServerError(err, 'onDragEvent');
  }
});

export default onDragEvent;

import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from "~/services/api/errors";
import {ILayoutStoreModel} from "~/types/layout/store";

const onLoading: Thunk<ILayoutStoreModel, null> = thunk(async ({ setLoading }: any, payload: any) => {
    try {
        setLoading(payload);
    } catch (err) {
        processServerError(err, 'household.onPopulate');
    }
});

export default onLoading;

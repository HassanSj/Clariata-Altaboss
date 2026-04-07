import { Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";

const onSelectDiscoverInterview: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectDiscoverInterview }, payload: any) => {
    if (payload != null) {
        selectDiscoverInterview(payload)
    }
})

export default onSelectDiscoverInterview;
import { Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";

const onSelectDreamInterview: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectDreamInterview }, payload: any) => {
    if (payload != null) {
        selectDreamInterview(payload)
    }
})

export default onSelectDreamInterview;
import { Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";

const onSelectPrimary: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectPrimary }, payload: any) => {
    if (payload != null) {
        selectPrimary(payload)
    }
})

export default onSelectPrimary;
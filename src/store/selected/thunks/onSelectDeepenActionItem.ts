import { action, Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";


const onSelectDeepenActionItem: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectDeepenActionItem }, payload, helpers) => {
    if (payload != null) {
        selectDeepenActionItem(payload)
    }
})

export default onSelectDeepenActionItem;
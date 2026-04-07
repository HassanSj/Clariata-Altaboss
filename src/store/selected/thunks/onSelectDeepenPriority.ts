import { action, Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";


const onSelectDeepenPriority: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectDeepenPriority }, payload, helpers) => {
    if (payload != null) {
        selectDeepenPriority(payload)
    }
})

export default onSelectDeepenPriority;
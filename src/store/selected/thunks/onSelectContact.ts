import { Thunk, thunk } from "easy-peasy";
import { ISelectedStoreModel } from "~/types/selected/store";

const onSelectContact: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectContact }, payload: any) => {
    if (payload != null) {
        selectContact(payload)
    }
})

export default onSelectContact;
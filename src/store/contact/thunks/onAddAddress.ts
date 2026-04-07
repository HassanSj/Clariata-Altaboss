import { Thunk, thunk } from "easy-peasy";
import { IContactStoreModel } from "~/types/contact/store";

const onAddAddress: Thunk<IContactStoreModel, any> = thunk(async ({ setAddresses }, payload: any) => {
    if (payload != null) {
        setAddresses(payload)
    }
})

export default onAddAddress;
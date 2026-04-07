import { Thunk, thunk } from "easy-peasy";
import { IContactStoreModel } from "~/types/contact/store";

const onClearAddresses: Thunk<IContactStoreModel, any> = thunk(async ({ clearAddresses }, payload: any) => {
    clearAddresses(payload)
})

export default onClearAddresses;
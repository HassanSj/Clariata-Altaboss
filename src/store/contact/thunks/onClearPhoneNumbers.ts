import { Thunk, thunk } from "easy-peasy";
import { IContactStoreModel } from "~/types/contact/store";

const onClearPhoneNumbers: Thunk<IContactStoreModel, any> = thunk(async ({ clearPhoneNumbers }, payload: any) => {
    clearPhoneNumbers(payload)
})

export default onClearPhoneNumbers;
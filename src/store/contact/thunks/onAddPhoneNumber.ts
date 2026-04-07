import { Thunk, thunk } from "easy-peasy";
import { IContactStoreModel } from "~/types/contact/store";

const onAddPhoneNumber: Thunk<IContactStoreModel, any> = thunk(async ({ setPhoneNumbers }, payload: any) => {
    if (payload != null) {
        setPhoneNumbers(payload)
    }
})

export default onAddPhoneNumber;
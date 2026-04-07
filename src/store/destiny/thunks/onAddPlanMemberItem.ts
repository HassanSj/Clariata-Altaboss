import { AxiosResponse } from "axios";
import { Thunk, thunk } from "easy-peasy";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { IDestinyStoreModel } from "~/types/destiny/store";

const onAddPlanMemberItem: Thunk<IDestinyStoreModel, any> = thunk(async ({ addPlanMemberItem }, payload: any) => {

    if (payload != null) {
        addPlanMemberItem(payload.data)
    }
})

export default onAddPlanMemberItem;
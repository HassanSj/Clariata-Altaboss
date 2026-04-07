import { AxiosResponse } from "axios";
import { Thunk, thunk } from "easy-peasy";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { IDestinyStoreModel } from "~/types/destiny/store";

const onSetAddedItems: Thunk<IDestinyStoreModel, number> = thunk(async ({ setAddedItems }, payload: any) => {
    try {
        if (payload != null) {
            console.log("started")
            const List: AxiosResponse = await api.planmember.itemsList(payload.developmentPlanId, payload.selectedHouseholdID, payload.selectedFamilyPerson as number)
            console.log('ended', List);
            if (List.data) {
                setAddedItems(List?.data)
            }
        }
        else {
            setAddedItems(null)
        }
    } catch (err) {
        processServerError(err, 'destiny.onSetAddedItems');
    }


})

export default onSetAddedItems;
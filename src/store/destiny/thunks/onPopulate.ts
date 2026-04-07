import { AxiosResponse } from "axios";
import { Thunk, thunk } from "easy-peasy";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { IDestinyStoreModel } from "~/types/destiny/store";

const onPopulate: Thunk<IDestinyStoreModel, number> = thunk(async ({ populate }, payload: number) => {

    try {

        const globalItems: AxiosResponse = await api.destiny.getGlobalItems();
        const developmentPlans: AxiosResponse = await api.developmentPlan.getDevelopmentPlans(payload);

        populate({ destinyGlobalItems: globalItems.data, DevelopmentPlans: developmentPlans.data })

    } catch (err) {
        processServerError(err, 'household.onPopulate');
    }

})

export default onPopulate;
import { AxiosResponse } from "axios";
import { Thunk, thunk } from "easy-peasy";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { IDestinyStoreModel } from "~/types/destiny/store";

const onSelectPerson: Thunk<IDestinyStoreModel, number> = thunk(async ({ selectPerson }, payload: number) => {
    selectPerson(payload)
})

export default onSelectPerson;
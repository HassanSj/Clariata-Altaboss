import { Thunk, thunk } from "easy-peasy";
import { IChecklistStoreModel } from "~/types/checklist/store";

const onSelectChecklist: Thunk<IChecklistStoreModel, any> = thunk(async ({ selectChecklist }, payload: any) => {
    if (payload != null) {
        selectChecklist(payload)
    }
})

export default onSelectChecklist;
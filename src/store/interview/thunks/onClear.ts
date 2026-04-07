import {thunk, Thunk} from 'easy-peasy';
import {IInterviewStoreModel} from "~/types/interview/store";
import {IInterviewPayload} from "~/ui/constants/interview";

const onClear: Thunk<IInterviewStoreModel, IInterviewPayload> = thunk(async ({ clear }, payload: IInterviewPayload) => {
  clear(payload);
});

export default onClear;

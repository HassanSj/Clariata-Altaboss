import {thunk, Thunk} from 'easy-peasy';
import {IInterviewStoreModel} from "~/types/interview/store";
import {IInterviewPayload, InterviewDataType} from "~/ui/constants/interview";

const onSetIsSaved: Thunk<IInterviewStoreModel, IInterviewPayload> = thunk(async ({ setIsSaved }, payload: IInterviewPayload, helpers) => {

    // Populate interview details
    if (payload.type === InterviewDataType.FORM) {

        // Dispatch action
        setIsSaved({
            type: payload.type,
            saved: payload.saved
        });
    }

});

export default onSetIsSaved;

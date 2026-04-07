import {action, Action} from 'easy-peasy';

const selectDreamInterview: Action<any> = action((state: any, payload: any) => {
    state.dreamInterviewId = payload;
});

export default selectDreamInterview;

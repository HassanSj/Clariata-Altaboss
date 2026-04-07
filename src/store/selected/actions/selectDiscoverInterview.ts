import {action, Action} from 'easy-peasy';

const selectDiscoverInterview: Action<any> = action((state: any, payload: any) => {
    state.discoverInterviewId = payload;
});

export default selectDiscoverInterview;

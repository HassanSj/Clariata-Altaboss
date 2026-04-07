import { action, Thunk, thunk } from "easy-peasy";
import api from "~/services/api";
import { Interview } from "~/types/api/interview";
import { IObjectiveDataType } from "~/types/objective/store";
import { ISelectedStoreModel } from "~/types/selected/store";
import { InterviewDataType, InterviewType } from "~/ui/constants/interview";


const onSelectHousehold: Thunk<ISelectedStoreModel, any> = thunk(async ({ selectHousehold }, payload, helpers) => {
    const actions: any = helpers.getStoreActions();
    if (payload != null) {
        actions.layout.setLoading(true);
        selectHousehold(payload);

        //call api to get Primary1 and Primary2
        const householdResponse = await api.household.get(payload);
        const household = householdResponse.data;
        actions.selected.selectPrimary(household);

        const response = await api.interview.list(payload);
        const interviews = response?.data as Interview[]
        console.log(interviews);
        const discoverInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DISCOVER);
        console.log(discoverInterview);
        if(discoverInterview) {
            console.log("Discover:")
            await actions.selected.selectDiscoverInterview(discoverInterview[0].InterviewID);
        }

        const dreamInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DREAM);
        if(dreamInterview){
            await actions.selected.selectDreamInterview(dreamInterview[0].InterviewID);        
        }

        // Populate interview
        await actions.interview.onPopulate({ type: InterviewDataType.ALL, payload });

        // Populate objectives
        await actions.objective.onPopulate({ type: IObjectiveDataType.ALL });

        // Load other users
        //await actions.user.onPopulateUsers({ payload });

        await actions.person.onPopulate();
        actions.layout.setLoading(false);
    }
})

export default onSelectHousehold;
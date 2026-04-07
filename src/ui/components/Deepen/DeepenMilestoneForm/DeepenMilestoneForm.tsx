import { Box } from "@material-ui/core";
import { useState } from "react";
import api from "~/services/api";
import { Milestone } from "~/types/api/milestone";
import Button from "../../Button";
import FormWrapper from "../../Forms/FormWrapper";
import Input from "../../Forms/Input";
import InputField from "../../Forms/InputField";
import { initialValues } from './form/initialvalue';
import validateMilestone from './form/validate';

interface IProps {
    actionItemId?: number;
    onCreate: any;
}

const DeepenMilestoneForm = ({actionItemId, onCreate}: IProps) => {

    const [showForm, setShowForm] = useState<Boolean>(false);

    const CreateMilestone = async (milestone: Milestone) => {
        milestone.ActionItemID = actionItemId;
        console.log(milestone);
        const res = await api.milestone.createMilestone(milestone);
        console.log(res);
        onCreate();
        setShowForm(false);
    } 

return (
    <>
    <Box display={showForm ? "none" : "block"}>
        <Button text={"Add Milestone"} size="small" variant="contained" color="secondary" type="button" onClick={() => setShowForm(true)}  />
    </Box>
    <Box border={1} borderColor="#FFFFFF" borderRadius="5px" width="300px" padding="10px" marginRight="10px" display={showForm ? "block" : "none"} style={{backgroundColor: "#FFFFFF"}}>
        <FormWrapper onSubmit={CreateMilestone} initialValues={initialValues} validationSchema={validateMilestone}> 
            <Box>Add Milestone</Box>
            <hr/>
            <Box>
            <InputField type="text"
                    label="Milestone Name"
                    name="MilestoneName"
                    component={Input}
                    required={true}
                    placeholder="Milestone Name"
                    />
                <InputField type="textarea"
                    label="Description"
                    name="Description"
                    component={Input}
                    placeholder="Description"
                    />
                <InputField type="date"
                    label="Start Date"
                    name="StartDate"
                    component={Input}
                    required={true}
                    />
                <InputField type="date"
                    label="End Date"
                    name="EndDate"
                    component={Input}
                    />
            </Box>
            <Box>
                <Button text={"Add"} size="small" variant="contained" color="secondary" type="submit" />
                <Button text={"Cancel"} size="small" variant="contained" color="default" type="button" onClick={() => setShowForm(false)} />
            </Box>
        </FormWrapper>
    </Box>
    </>
)
}

export default DeepenMilestoneForm;
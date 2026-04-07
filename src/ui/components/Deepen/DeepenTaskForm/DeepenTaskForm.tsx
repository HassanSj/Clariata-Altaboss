import { Box } from "@material-ui/core";
import { AnyAaaaRecord } from "dns";
import { useEffect, useState } from "react";
import api from "~/services/api";
import { useStoreState } from "~/store/hooks";
import { Task } from "~/types/api/task";
import { TeamMember } from "~/types/api/teamMember";
import useNotifications from "~/ui/hooks/useNotifications";
import Button from "../../Button";
import FormWrapper from "../../Forms/FormWrapper";
import Input from "../../Forms/Input";
import InputField from "../../Forms/InputField";
import { initialValues } from './form/initialvalue'
import validateTask from "./form/validate";

interface IProps {
    milestoneId: number;
    onCreate: any;
}

const DeepenTaskForm = ({milestoneId, onCreate}: IProps) => {

    const notifications = useNotifications();
    const { user } = useStoreState(state => state.user);
    const [showForm, setShowForm] = useState<Boolean>(false);
    const [teamMembers, setTeamMembers] = useState<any>([]);
    
    const CreateTask = async (task: Task) => {
        notifications.toggleLoading(true);
        task.MilestoneID = milestoneId;
        const taskResponse = await api.task.createTask(task);
        notifications.addSuccessNotification("Task Added!");
        setShowForm(false);
        onCreate();
        setShowForm(false)
        notifications.toggleLoading(false);
    }

    const loadTeamMembers = async () => {

        const res = await api.teamMember.getTeamMembers(user.UserID as number);
        console.log(res.data as TeamMember[]);
        const teamMemberData = res.data as TeamMember[];
        let selectItems = [];
        const selectItem = {
            label: "Unassigned",
            value: "0"
        };
        selectItems.push(selectItem);
        const myselfItem = {
            label: "Myself",
            value: user.UserID
        };
        selectItems.push(myselfItem);
        const teamMemberItems = teamMemberData.map(teamMember => { 
            const item = {
                label: teamMember.FirstName + " " + teamMember.LastName, 
                value: teamMember.TeamMemberID 
            };
            selectItems.push(item);
        });
        
        console.log(selectItems);
        setTeamMembers(selectItems);
    }

    useEffect(() => {
        loadTeamMembers();
    }, []);

    return (
        <>
        <Box display={showForm ? "none" : "block"} marginBottom="10px">
            <Button text={"Add Task"} size="small" variant="contained" color="secondary" type="button" onClick={() => setShowForm(true)}  />
        </Box>
        <Box border={1} borderColor="#FFFFFF" borderRadius="5px" width="300px" padding="10px" marginRight="10px" marginBottom="10px" display={showForm ? "block" : "none"} style={{backgroundColor: "#FFFFFF"}}>
        <FormWrapper onSubmit={CreateTask} initialValues={initialValues} validationSchema={validateTask}>    
                        <div>
                            <InputField type="text"
                                label="Task Name"
                                name="TaskName"
                                component={Input}
                                required={true}
                                />
                            <InputField type="textarea"
                                label="Description"
                                name="Description"
                                component={Input}
                                rows={10}
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
                                required={true}
                                />
                            <InputField type="select"
                                label="Assigned To"
                                name="AssignedTo"
                                component={Input}
                                items={teamMembers}
                                required={true}
                                />
                        </div>
                            <Button
                                type="submit"
                                text="Add"
                                variant="contained"
                                size="small"
                                color="secondary"
                            />
                            <Button text={"Cancel"} size="small" variant="contained" color="default" type="button" onClick={() => setShowForm(false)} />
                    </FormWrapper>  
                </Box>  
        </>
    )
}

export default DeepenTaskForm;
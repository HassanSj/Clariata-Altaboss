import { Box, Menu, MenuItem } from "@material-ui/core";
import moment from "moment";
import api from "~/services/api";
import { useStoreState } from "~/store/hooks";
import onUpdate from "~/store/user/thunks/crud/onUpdate";
import { Task } from "~/types/api/task";
import FormWrapper from "../../Forms/FormWrapper";
import InputField from "../../Forms/InputField";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import { useEffect, useState } from "react";
import ConfirmationModal from "../../Dialogs/ConfirmationModal";
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
    task: Task;
    onUpdate: any;
}

const DeepenTask = ({task, onUpdate}: IProps) => {

    const notifications = useNotifications();
    const { householdId } = useStoreState(state => state.selected);
    const { user } = useStoreState(state => state.user);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const openMenu = Boolean(anchorEl);
    const [userInitials, setUserInitials] = useState<string>();
    const [userName, setUserName] = useState<string>();

    const handleChange = async (e: any) => {
        notifications.toggleLoading(true);
        notifications.addSuccessNotification('Task updated!');
        console.log(e ? false : true);
        task.Status = "Completed";
        task.Completed = e == "false" ? false : true;
        await api.task.updateTask(task, householdId);
        onUpdate();
        notifications.toggleLoading(false);
    }

    const getAssignedName = async () => {

        if(user?.UserID == task.AssignedTo)
        {
            const firstNameInitial = user ? user?.FirstName ? user?.FirstName?.substring(0,1) : "" : "";
            const lastNameInitial = user ? user?.LastName ? user?.LastName?.substring(0,1) : "" : "";
            const firstName = user ? user?.FirstName: "";
            const lastName = user ? user?.LastName : "";
            setUserInitials(firstNameInitial + lastNameInitial);
            setUserName(firstName + " " + lastName);
            console.log(firstName + " " + lastName);
        }
        else {
            console.log(task.AssignedTo);
            let res = await api.teamMember.getTeamMember(Number(task.AssignedTo));
            if(res) {
                const teamMember = res.data;

                const firstNameInitial = teamMember ? teamMember?.FirstName ? teamMember?.FirstName?.substring(0,1) : "" : "";
                const lastNameInitial = teamMember ? teamMember?.LastName ? teamMember?.LastName?.substring(0,1) : "" : "";
                const firstName = teamMember ? teamMember?.FirstName: "";
                const lastName = teamMember ? teamMember?.LastName : "";
                setUserInitials(firstNameInitial + lastNameInitial);
                setUserName(firstName + " " + lastName);
                console.log(firstName + " " + lastName);
            }
        }
        
        
    }

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };

    const handleCloseMenu = () => {
        setAnchorEl(null);
      };

    const deleteTask = async () => {
        notifications.toggleLoading(true);
        notifications.addSuccessNotification('Task Deleted!');
        api.task.deleteTask(Number(task.TaskID));
        setAnchorEl(null);
        notifications.toggleLoading(false);
    };

    useEffect(() => {
        getAssignedName();
    })

    return (
        <>
            <Box border={1} borderColor="#FFFFFF" borderRadius="5px" width="300px" padding="10px" marginRight="10px" marginBottom="10px" style={{backgroundColor: "#FFFFFF"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                        {task.Completed ? 
                        <input 
                            value="false"                           
                            type="checkbox"
                            name="Completed"
                            checked={true}
                            id={String(task.TaskID)}
                            onChange={(e) => {
                                console.log(e.target);
                                handleChange(e.target.value);
                            }}/>
                            : 
                            <input 
                            value="true"                           
                            type="checkbox"
                            name="Completed"
                            id={String(task.TaskID)}
                            onChange={(e) => {
                                console.log(e.target);
                                handleChange(e.target.value);
                            }}/>
                        }
                        </div>
                        <div style={{flex: "8", verticalAlign: "middle"}}>
                            {task.TaskName}
                        </div>
                        <div style={{flex: "1", verticalAlign: "middle"}}>
                            <div onClick={handleClickMenu}>
                                <MoreHorizOutlinedIcon fontSize="small" />
                            </div>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={openMenu}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '20ch',
                                },
                                }}>
                                <MenuItem key={'edit'} onClick={() => setShowEditModal(true)}>
                                    Edit
                                </MenuItem>
                                { !task.Completed ?
                                <MenuItem key={'complete'} onClick={() => handleChange(true)}>
                                    Complete Task
                                </MenuItem>
                                : null }
                                <MenuItem key={'delete'} onClick={() => setShowDeleteConfirmation(true)}>
                                    Delete
                                </MenuItem>
                            </Menu>
                            <ConfirmationModal isOpen={showDeleteConfirmation}
                                onConfirm={deleteTask} onCancel={() => setShowDeleteConfirmation(false)} />
                    </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            
                        </div>
                        <div style={{flex: "8"}}>
                            Start Date: {moment(task.StartDate).format("MM/DD/YYYY")}
                        </div>
                        <div style={{flex: "1", textAlign: "left"}}>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            
                        </div>
                        <div style={{flex: "8"}}>
                            Due Date: {moment(task.EndDate).format("MM/DD/YYYY")}
                        </div>
                        <div style={{flex: "1", textAlign: "left"}}>
                            <div title={userName} style={{borderRadius: "25px", width: "25px", height: "25px", fontSize: "12px", color: "#FFFFFF", backgroundColor: "#F05A28", textAlign: "center", verticalAlign: "middle", paddingTop: "5px"}}>{userInitials}</div>
                        </div>
                    </div>
            </Box>
        </>
    )
}

export default DeepenTask;
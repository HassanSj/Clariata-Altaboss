import { Box, Menu, MenuItem } from "@material-ui/core";
import CalendarTodayRoundedIcon from '@material-ui/icons/CalendarTodayRounded';
import moment from "moment";
import { useEffect, useState } from "react";
import api from "~/services/api";
import { Milestone } from "~/types/api/milestone";
import { Task } from "~/types/api/task";
import DeepenTask from "../DeepenTask/DeepenTask";
import DeepenTaskForm from "../DeepenTaskForm/DeepenTaskForm";
import { useStoreActions, useStoreState } from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import ConfirmationModal from "../../Dialogs/ConfirmationModal";

interface IProps {
    milestone: Milestone;
    onCreate: any;
}

const DeepenMilestone = ({milestone, onCreate}: IProps) => {

    const notifications = useNotifications();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const openMenu = Boolean(anchorEl);

    const loadTasks = async () => {
        console.log("Load Tasks");
        console.log(milestone);
        const res = await api.task.getTasksByMilestone(Number(milestone.MilestoneID))
        console.log(res);
        if(res) {
            const taskData = res.data;
            const incompleteTasks = taskData.filter(task => task.Completed == false);
            setTasks(incompleteTasks);
            const completedTasks = taskData.filter(task => task.Completed == true);
            setCompletedTasks(completedTasks);
        }
        else {
            setTasks([]);
        }
    }

    useEffect(() => {
        loadTasks();
    }, [milestone]);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };

    const handleCloseMenu = () => {
        setAnchorEl(null);
      };

    const deleteMilestone = async () => {
        notifications.toggleLoading(true);
        notifications.addSuccessNotification('Milestone Deleted!');
        api.milestone.deleteMilestone(Number(milestone.MilestoneID));
        setAnchorEl(null);
        onCreate();
        notifications.toggleLoading(false);
    };

    const handleCreate = async () => {
        notifications.toggleLoading(true);
        notifications.addSuccessNotification("Milestone Added!")
        loadTasks();
        onCreate(milestone.ActionItemID);

        notifications.toggleLoading(false);
    }
    
    return (
        <>
            <div style={{display: "flex", flexDirection: "column" }}>
                <Box border={1} borderColor="#FFFFFF" borderRadius="5px" width="300px" padding="10px" marginRight="10px" marginBottom="10px" style={{backgroundColor: "#FFFFFF"}}>
                    <>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: "8", verticalAlign: "middle"}}>{milestone.MilestoneName} </div>
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
                                <MenuItem key={'delete'} onClick={() => setShowDeleteConfirmation(true)}>
                                    Delete
                                </MenuItem>
                            </Menu>
                            <ConfirmationModal isOpen={showDeleteConfirmation}
                                onConfirm={deleteMilestone} onCancel={() => setShowDeleteConfirmation(false)} />
                        </div>
                    </div>
                    <hr color="#DBEAF2"/>
                    <Box>
                        <CalendarTodayRoundedIcon/>{moment(milestone.StartDate).format("MM/DD/YYYY")} { milestone.EndDate ? " - " +  moment(milestone.EndDate).format("MM/DD/YYYY") : null}
                    </Box>
                    </>
                </Box>
                <DeepenTaskForm milestoneId={Number(milestone.MilestoneID)} onCreate={handleCreate} />
                {tasks.map(task => {
                    return (
                        <>
                            <DeepenTask task={task} onUpdate={loadTasks} />
                        </>
                    )
                })}

                {completedTasks.length > 0 ?
                <>
                    <Box border={1} borderColor="#C3D6E3" borderRadius="5px" 
                        width="300px" padding="10px" marginRight="10px" marginBottom="10px" style={{backgroundColor: "#C3D6E3"}}
                        onClick={() => setShowCompletedTasks(!showCompletedTasks)}>
                        Completed Tasks ({completedTasks.length})
                    </Box>
                    { showCompletedTasks ?
                    completedTasks.map(task => {
                        return (
                            <>
                                <DeepenTask task={task} onUpdate={loadTasks} />
                            </>
                        )
                    })
                    : null } 
                </> : null }
            </div>
        </>
    )
}

export default DeepenMilestone;
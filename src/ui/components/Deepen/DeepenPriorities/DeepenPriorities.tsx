import { TreeItem, TreeView } from "@material-ui/lab";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ImageOutlined from "@material-ui/icons/ImageOutlined";
import React, {useState, useEffect} from "react";
import api from "~/services/api";
import { useStoreActions, useStoreState } from "~/store/hooks";
import { Objective } from "~/types/api/models";
import { Priority } from "~/types/api/priority";
import { Box, Button } from "@material-ui/core";
import { ActionItem } from "~/types/api/actionItem";

interface IProps {
    actionStep?: ActionItem;
    onSelect: any;
}

const DeepenPriorities = ({actionStep, onSelect} : IProps) => {

    const {householdId, dreamInterviewId} = useStoreState(state => state.selected);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    
    const loadData = async () => {

        const res = await api.objective.getSelectedListFull(householdId);
        const selectedObjectives  = res?.data as Priority[];
        console.log(selectedObjectives);

        setPriorities(selectedObjectives);

    }   

    useEffect(() => {
        console.log("Deepen");
        loadData();
    }, [])    

    const handleSelect = (priority: Priority, actionItem: ActionItem) => {
        console.log("Select Action Item");
        console.log(actionItem);
        onSelect(actionItem, priority);
    }

    return (
        <>
            {/* <Box sx={{ mb: 1 }}>
                <Button onClick={handleExpandClick}>
                    {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
            </Box> */}
            <TreeView defaultExpandIcon={<ImageOutlined/>} defaultCollapseIcon={<ImageOutlined/>} >
                {priorities.map(priority => {
                    return (
                        <>
                        <div style={{}}>
                        <TreeItem nodeId={String(priority.ObjectiveID)} label={priority.Description} style={{padding: "5px"}}>
                            {(priority?.ActionItems && priority?.ActionItems?.length > 0) ?
                                priority?.ActionItems?.map(actionItem => {
                                    return (
                                        <TreeItem nodeId={String(actionItem.ActionItemID)} label={actionItem.Description} style={{padding: "5px"}} onClick={() => handleSelect(priority, actionItem)}/>
                                    );
                                })
                                : 
                                    <TreeItem nodeId={priority.ObjectiveID + "-none"} label="No Action Steps" style={{padding: "5px"}}/>
                            }
                        </TreeItem>
                        </div>
                        </>);
                })}
            </TreeView>
        </>
    );

}

export default DeepenPriorities;
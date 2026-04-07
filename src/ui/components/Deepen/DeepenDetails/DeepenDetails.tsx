import {useEffect, useState} from 'react';
import { Grid } from "@material-ui/core"
import moment from "moment";
import api from "~/services/api";
import { ActionItem } from "~/types/api/actionItem";
import { Priority } from "~/types/api/priority";
import DeepenMilestone from "../DeepenMilestone/DeepenMilestone";
import DeepenMilestoneForm from "../DeepenMilestoneForm/DeepenMilestoneForm";
import { Milestone } from '~/types/api/milestone';
import useMilestones from '~/ui/hooks/useMilestones';
import { mutate } from 'swr';

interface IProps {
    selectedPriority?: Priority;
    selectedActionItem?: ActionItem;
}

const DeepenDetails = ({selectedPriority, selectedActionItem}: IProps) => {

    const { milestones } = useMilestones();
    //const { deepenActionItemId, deepenPriorityId } = useStoreState(state => state.selected);
    //const [milestones, setMilestones] = useState<Milestone[]>([]);

    const loadMilestones = async () => {
        //mutate(`${process.env.NEXT_PUBLIC_API_URL}/MilestoneByActionItem?actionItemId=${selectedActionItem?.ActionItemID}`);
        // console.log(selectedActionItem?.ActionItemID);
        // const res = await api.milestone.getMilestonesByActionItem(Number(selectedActionItem?.ActionItemID));
        // if(res) {
        //     console.log("Load Milestones");
        //     setMilestones(res.data);
        // }
        // else {
        //     setMilestones([]);
        // }
    }

    // useEffect(() => {
    //     loadMilestones();
    // }, [selectedActionItem]);

    return (
        <>
            <Grid xs={10} style={{minHeight: "750px"}} >
                <div style={{width: "100%", height: "100%", backgroundColor : "#DBEAF2"}}>
                <div style={{padding: "10px 20px"}}>
                    {selectedPriority ? 
                    <>
                    <h2 style={{textAlign: "left"}}>{selectedPriority?.Description}</h2>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{marginRight:"20px"}}>
                        {selectedActionItem?.Description} 
                        </div>
                        <div>
                        { selectedActionItem?.StartDate ? moment(selectedActionItem?.StartDate).format("MM/DD/YYYY") : null} { String(selectedActionItem?.DueDate) != "0001-01-01T00:00:00" ? "- " + moment(selectedActionItem?.DueDate).format("MM/DD/YYYY") : null}
                        </div>
                    </div>
                    </>
                    : null
                     }
                </div>
                <hr/>
                <div style={{padding: "20px", display: "flex", minHeight: "100%"}}>
                    {milestones?.map(milestone => {
                        return(
                            <>
                                <DeepenMilestone milestone={milestone} onCreate={loadMilestones} />
                            </>
                        )
                    })}
                    {selectedActionItem ? 
                        <DeepenMilestoneForm actionItemId={selectedActionItem?.ActionItemID} onCreate={() => {loadMilestones}} />
                        : null 
                    }
                    
                </div>  
                </div>
            </Grid>
        </>
    )
}

export default DeepenDetails;
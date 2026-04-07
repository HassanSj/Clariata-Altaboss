import React, {useState, useEffect} from "react";
import { Box, Card, CardContent, Grid } from "@material-ui/core";
import { Milestone } from "~/types/api/milestone";
import DeepenMilestone from "~/ui/components/Deepen/DeepenMilestone/DeepenMilestone";
import DeepenPriorities from "~/ui/components/Deepen/DeepenPriorities/DeepenPriorities";
import api from "~/services/api";
import { ActionItem } from "~/types/api/actionItem";
import { Priority } from "~/types/api/priority";
import moment from "moment";
import DateValue from "~/ui/components/Data/Formatters/DateValue";
import { DateFormatType } from "~/ui/components/Data/Formatters/DateValue/DateValue";
import Button from "~/ui/components/Button";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import DeepenMilestoneForm from "~/ui/components/Deepen/DeepenMilestoneForm/DeepenMilestoneForm";
import { useStoreActions, useStoreState } from "~/store/hooks";
import DataTableViews from "~/ui/components/Data/DataTableViews";
import { Alert } from "@material-ui/lab";
import DeepenDetails from "~/ui/components/Deepen/DeepenDetails/DeepenDetails";
import styles from "./Deepen.module.scss";
import classnames from "classnames";


const Deepen = () => {

    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [selectedPriority, setSelectedPriority] = useState<Priority>();
    const [actionItem, setActionItem] = useState<ActionItem>()
    const { deepenActionItemId, deepenPriorityId } = useStoreState(state => state.selected)
    const { onSelectDeepenActionItem, onSelectDeepenPriority } = useStoreActions(action => action.selected)
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [moduleName, setModuleName] = React.useState<String>("");
    const [moduleOverview, setModuleOverview] = React.useState<String>("");
    const [isActiveTrial, setIsActiveTrial] = React.useState<boolean>(false);

    const handleSelect = async (actionItem: ActionItem, priority: Priority) => {
        onSelectDeepenActionItem(actionItem.ActionItemID);
        setSelectedPriority(priority);
        setActionItem(actionItem);
        //loadMilestones(Number(actionItem.ActionItemID));
    }

    const loadData = async () => {
        
        const responseModule = await api.clariataModule.get("Deepen");

        if(responseModule) {
            const clariataModule = await responseModule.data;
            
            setModuleOverview(clariataModule.ModuleOverview);
            setModuleName(clariataModule.ModuleName);
            setIsActive(clariataModule.IsActive);
            setIsActiveTrial(clariataModule.IsActive);
        }
    }

    useEffect(() => {

        loadData();

    }, []);

    if (isActive) {
        return (
            <>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <div className={classnames("card-header-image",styles.header_bg)}></div>
                </Grid>
                <Grid item xs={4}>
                    <div className={styles.text_wrapper}>
                        <Alert severity="info" style={{width:"52px"}}></Alert>
                        <div>
                            What needs to be done to turn our client's dreams into reality? The Deepen Module establishes the execution plan for our team. Using the Navigation Manager a personalized, proactive, and priorities-driven action plan is developed. Milestones for each action step are established to measure progress. Each milestone lists the specific tasks to be done to reach each milestone. 
                        </div>
                    </div>
                </Grid>
    
            </Grid>
            
            <Grid container spacing={1} style={{minHeight: "100%"}}>
                <Grid xs={2} style={{minHeight: "100%", padding: "10px 20px"}} >
                    <div  style={{width: "100%", height: "100%"}}>
                    <div style={{padding: "10px"}}>
                        <h2 style={{textAlign: "center"}}>Deepen</h2>
                    </div>
                    <hr/>
                    <div>
                    <DeepenPriorities onSelect={handleSelect} actionStep={actionItem} />
                    </div>
                    </div>
                </Grid>
                <DeepenDetails selectedPriority={selectedPriority} selectedActionItem={actionItem} />
            </Grid>
            </>
        )
    }
    else {
        return (
            <>
                <Card>
                    <CardContent>
                    <div className={classnames("card-header-image",styles.header_bg)}></div>
                    <div>
                    {moduleOverview}
                    </div>
                    
                    </CardContent>
                </Card>
            </>
        )
    }
}

export default Deepen;
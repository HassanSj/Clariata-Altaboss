import { Grid, MenuItem, Select } from "@material-ui/core";
import Button from "~/ui/components/Button";
import { useEffect, useState } from "react";
import { DevelopmentPlan } from "~/types/api/developmentPlan";
import api from "~/services/api";
import { useStoreState } from "~/store/hooks";

interface DestinyFamilyOverviewSelectorProps {
    RunReport: any;
}


const DestinyFamilyOverviewSelector = ({RunReport}: DestinyFamilyOverviewSelectorProps) => {
    const [formType, setFormType] = useState<string>("");
    const [formTypes, setFormTypes] = useState<string[]>([]);
    const [selectedPlanID, setSelectedPlanID] = useState<number>(-1);
    const {selectedHousehold,households } = useStoreState((state) => state.household);
    const [plans, setPlans] = useState<DevelopmentPlan[]>([])


    const loadData = () => {
        GetPlans();
    }

    const GetPlans = async () => {
        const plansResponse = await api.developmentPlan.getDevelopmentPlans(selectedHousehold.HouseholdID);
        const plans = await plansResponse.data;
        setPlans(plans);
        console.log("Plans",plans);
      }

    useEffect(() => {
        loadData();
    },[])

    const changeFormType = (type: any) => {
        setFormType(type);
        console.log("FormType:" + type);
    }

    const OnChange= (planId: any) => {
        console.log(planId);
        setSelectedPlanID(planId);
    }

    const runReport = () => {

        RunReport(selectedPlanID);
    }

    return (
        <>
        <div className="full-width">
            <Grid container className="m-t-20">
                <Grid item xs={4}>
                    Select Plan: 
                    <Select onChange={event => OnChange(event.target.value)} style={{width: "220px", padding: "5px 10px", borderRadius: "2px", marginLeft: "15px"}} >
                        <option value="0">Select a PlanName</option>
                            {plans.map(plan => {
                                return (
                                    <MenuItem value={plan.DevelopmentPlanId}>{plan.PlanName}</MenuItem>
                                )}  
                            )}                                        
                    </Select>
                </Grid>
                <Grid item xs={2}>
                <Button type="button" text="Run Report" size="large" variant="contained" color="primary" onClick={runReport}/>
                </Grid>
            </Grid>
        </div>
        </>
    )
} 

export default DestinyFamilyOverviewSelector;
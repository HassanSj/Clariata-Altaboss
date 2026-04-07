import { Grid, MenuItem, Select } from "@material-ui/core";
import Button from "~/ui/components/Button";
import { useEffect, useState } from "react";
import { DevelopmentPlan } from "~/types/api/developmentPlan";
import api from "~/services/api";
import { useStoreState } from "~/store/hooks";
import { getHouseholdFamily } from "~/services/reports/persons";
import { Person } from "~/types/api/person";

interface DestinyItemSelectorProps {
    RunReport: any;
    householdId: number;
}


const DevelopmentPlanSelector = ({RunReport, householdId}: DestinyItemSelectorProps) => {
    const [formType, setFormType] = useState<string>("");
    const [formTypes, setFormTypes] = useState<string[]>([]);
    const [selectedPlanID, setSelectedPlanID] = useState<number>(-1);
    const {selectedHousehold,households } = useStoreState((state) => state.household);
    const [plans, setPlans] = useState<DevelopmentPlan[]>([])
    const [familyMembers, setFamilyMembers] = useState<(Person | undefined)[]>();
    const [familyMemberId, setFamilyMemberId] = useState<number>(0);

    const GetFamilyMembers = async () => {

        const family = await getHouseholdFamily(selectedHousehold.HouseholdID, true);
    
        const primary1 = family.persons[0];
    
        let members = [primary1.person];
    
        const primary2 = family.persons[1];
        members.push(primary2.person);
        
        primary1?.children?.forEach((child) => {
          members.push(child.person);
          
          child.children?.forEach((grandchild) => {
            members.push(grandchild.person);
          })
        });
    
        setFamilyMembers(members);
    
      }

      const GetPlans = async () => {
        const plansResponse = await api.developmentPlan.getDevelopmentPlans(selectedHousehold.HouseholdID);
        const plans = await plansResponse.data;
        setPlans(plans);
        console.log(plans);
      }

    const loadData = () => {
        GetPlans();
        GetFamilyMembers();
    }

    

    useEffect(() => {
        loadData();
    },[])

    const changeFamilyMember = (familyMemberId: any) => {
        setFamilyMemberId(familyMemberId);
    }

    const OnChange= (planId: any) => {
        console.log(planId);
        setSelectedPlanID(planId);
    }

    const runReport = () => {

        RunReport(selectedPlanID, familyMemberId);
    }

    return (
        <>
        <div className="full-width">
            <Grid container className="m-t-20" spacing={1}>
                <Grid item xs={3}>
                    <div style={{marginLeft: "15px"}}>Select Plan: </div>
                    <Select onChange={event => OnChange(event.target.value)} style={{width: "150px", padding: "5px 10px", borderRadius: "2px", marginLeft: "15px"}} >
                        <option value="0">Select a Plan</option>
                            {plans.map(plan => {
                                return (
                                    <MenuItem value={plan.DevelopmentPlanId}>{plan.PlanName}</MenuItem>
                                )}  
                            )}                                        
                    </Select>
                </Grid>
                <Grid item xs={5}>
                    <div style={{marginLeft: "15px"}}>Select Family Member:</div>
                    <Select style={{width: "200px", marginBottom: "25px", padding: "5px 10px", marginLeft: "15px"}} onChange={event => {changeFamilyMember(event.target.value)}} required={true} >
                        {familyMembers?.map((familyMember) => (
                            <MenuItem
                                key={familyMember?.PersonID}
                                value={familyMember?.PersonID}
                                >{familyMember?.FirstName} {familyMember?.LastName}</MenuItem>
                        )
                        )}
                    </Select>
                </Grid>
                <Grid item xs={2}>
                    <br/>
                    <Button type="button" text="Run Report" size="large" variant="contained" color="primary" onClick={runReport}/>
                </Grid>
            </Grid>
        </div>
        </>
    )
} 

export default DevelopmentPlanSelector;
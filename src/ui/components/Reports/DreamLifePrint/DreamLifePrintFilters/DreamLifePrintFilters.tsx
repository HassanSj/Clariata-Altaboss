import { useState } from "react"
import { Button, Checkbox, FormControlLabel, Grid } from "@material-ui/core"
import { useStoreState } from "~/store/hooks"
import { Household, Objective } from "~/types/api/models"
import { Person } from "~/types/api/person"
import { SelectedPriorities } from "../DreamLifePrint"

type NumberBool = {[key:number]:boolean}

function subHeadline(title: string){
    return (
        <Grid container>
            <Grid item xs={12} className="text-center">{title}</Grid>
        </Grid>
    )
}

const copyAndSet = (arr:NumberBool, key:number, value: boolean) =>{
    console.log(key, value);
    const copy:NumberBool = JSON.parse(JSON.stringify(arr));
    copy[key] = value;

    return copy
}

const onlySelected = (arr: NumberBool) => {
    return Object.keys(arr).filter(id => arr[Number(id)])
}

function prioritiesColumn(priorities: Objective[], limit: number, id: string, selection: NumberBool, setValue: (key: number, value: boolean) => void){
    const selectionCount = () => Object.keys(selection).map(key => selection[Number(key)]).filter(s => s).length

    return (
        <>
            {priorities.map(obj => (
                <FormControlLabel
                    style={{display: "block"}}
                    key={`${obj.ObjectiveID}-${id}`}
                    control={<Checkbox checked={selection[obj.ObjectiveID] ?? false} />}
                    onChange={(e, value) => {
                        if(limit > 0) {
                            if(selectionCount() < limit || !value) {
                                setValue(obj.ObjectiveID, value);
                            }
                        }
                    }}
                    label={obj.Description}/>
            ))}
        </>
    )
}

function personPrioritiesColumn(person:Person, allObjectives: Objective[], selection:NumberBool, setValue: (key: number, value: boolean) => void){
    const personObjectives = allObjectives.filter(obj => obj.PersonID === person.PersonID && obj.DimensionOfLifeID == 1)

    return (
        <>
            {prioritiesColumn(personObjectives, 3, String(person.PersonID), selection, (k,v) => setValue(k, v))}
        </>
    )
}

interface IProps {
    household: Household,
    objectives: Objective[]
    persons: Person[]
    ProcessDreamReport: (data: SelectedPriorities) => unknown;
}


const DreamLifePrintFilters = ({household, objectives, persons, ProcessDreamReport}: IProps) => {

    const [person1Objs, setPerson1Objs] = useState<NumberBool>({});
    const [person2Objs, setPerson2Objs] = useState<NumberBool>({});
    const [familyPriorities, setFamilyPriorities] = useState<NumberBool>({});
    const [workPriorities, setWorkPriorities] = useState<NumberBool>({});
    const [communityPriorities, setCommunityPriorities] = useState<NumberBool>({});
    const [additionalPriorities, setAdditionalPriorities] = useState<NumberBool>({});

    const primaryPeople = persons.filter(p => p.PersonID === household.PrimaryPerson1ID || p.PersonID === household.PrimaryPerson2ID);
    const familyObjectives = objectives.filter( obj => obj.DimensionOfLifeID === 2);
    const workObjectives = objectives.filter( obj => obj.DimensionOfLifeID === 3);
    const communityObjective = objectives.filter( obj => obj.DimensionOfLifeID === 4);
    const additionalObjectives = objectives.filter( obj => obj.DimensionOfLifeID != 1);

    const displayDreamLifePrint = async () => {  

        let data: SelectedPriorities = {
            person1Objs: onlySelected(person1Objs),
            person2Objs: onlySelected(person2Objs),
            familyPriorities: onlySelected(familyPriorities),
            workPriorities: onlySelected(workPriorities),
            communityPriorities: onlySelected(communityPriorities),
            additionalPriorities: onlySelected(additionalPriorities)
        }
        
        ProcessDreamReport(data);
    }

    return (
        <div className="full-width">
            <Grid container className="m-t-20">
                <Grid item xs={6}>
                    {primaryPeople[0] &&
                        <h2 className="text-center">{primaryPeople[0].FullName}</h2>
                    }
                </Grid>
                <Grid item xs={6}>
                    {primaryPeople[1] &&
                        <h2 className="text-center">{primaryPeople[1].FullName}</h2>
                    }
                </Grid>
            </Grid>
            {subHeadline("Select Spouse priorities. Maximum 3 items / person")}
            <Grid container className="m-t-10">
                <Grid item xs={6}>
                    {primaryPeople[0] && personPrioritiesColumn(primaryPeople[0], objectives, person1Objs, (key, value) => setPerson1Objs(copyAndSet(person1Objs, key, value)))}
                </Grid>
                <Grid item xs={6}>
                    {primaryPeople[1] && personPrioritiesColumn(primaryPeople[1], objectives, person2Objs, (key, value) => setPerson2Objs(copyAndSet(person2Objs, key, value)))}
                </Grid>
            </Grid>
            <Grid container className="m-t-20">
                <Grid item xs={4} className="text-center">
                    <h2>Family Priorities</h2>
                </Grid>
                <Grid item xs={4} className="text-center">
                    <h2>Work-Life Priorities</h2>
                </Grid>
                <Grid item xs={4} className="text-center">
                    <h2>Community Priorities</h2>
                </Grid>
            </Grid>
            {subHeadline("Select priorities by dimension of life. Maximum 2 items / dimension")}
            <Grid container className="m-t-20">
                <Grid item xs={4} >
                    {prioritiesColumn(familyObjectives, 2, "family", familyPriorities, (k,v) => setFamilyPriorities(copyAndSet(familyPriorities, k, v)))}
                </Grid>
                <Grid item xs={4}>
                    {prioritiesColumn(workObjectives, 2, "work", workPriorities, (k,v) => setWorkPriorities(copyAndSet(workPriorities, k, v)))}
                </Grid>
                <Grid item xs={4}>
                    {prioritiesColumn(communityObjective, 2, "community", communityPriorities, (k,v) => setCommunityPriorities(copyAndSet(communityPriorities, k, v)))}
                </Grid>
            </Grid>
            { additionalObjectives.length > 0 ? 
                <Grid container className="m-t-20">
                    <Grid item xs={4}/>
                    <Grid item xs={4} className="text-center">
                        <h2>Additional priorities</h2>
                    </Grid>
                    <Grid item xs={4}/>
                </Grid> : null 
            }
            { additionalObjectives.length > 0 ? subHeadline("Select additional priorities.") : null }
            { additionalObjectives.length > 0 ?                
                <Grid container className="m-t-20">
                    <Grid item xs={3}/>
                    <Grid item xs={6}>
                        { console.log(additionalPriorities)}
                        {prioritiesColumn(additionalObjectives, 0,"additional", additionalPriorities, (k,v) => setAdditionalPriorities(copyAndSet(additionalPriorities, k, v)))}
                    </Grid>
                    <Grid item xs={3}/>
                </Grid> : null
            }
            <Grid item xs={4}>
                <div style={{paddingTop: "25px"}}>
                    <Button size="large" variant="contained" color="primary" onClick={() => displayDreamLifePrint()}>Run Report</Button>
                </div>
            </Grid>
        </div>
    )
}

export default DreamLifePrintFilters;
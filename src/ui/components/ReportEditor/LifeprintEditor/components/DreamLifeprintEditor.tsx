import React, {ReactElement, useState} from "react";
import {useStoreState} from "~/store/hooks";
import {Button as MuiButton, Checkbox, DialogActions, FormControlLabel, Grid} from "@material-ui/core";
import {Person} from "~/types/api/person";
import {Objective} from "~/types/api/objective";
import {ReportType} from "~/ui/constants/reports";
import {LifeprintEditorPageProps} from "../LifeprintEditor";

export type NumberBool = {[key:number]:boolean}

export function prioritiesColumn(priorities: Objective[], limit: number, id: string, selection: NumberBool, setValue: (key: number, value: boolean) => void){
    const selectionCount = () => Object.keys(selection).map(key => selection[Number(key)]).filter(s => s).length

    return (
        <>
            {priorities.map(obj => (
                <FormControlLabel
                    style={{display: "block"}}
                    key={`${obj.ObjectiveID}-${id}`}
                    control={<Checkbox checked={selection[obj.ObjectiveID] ?? false} />}
                    onChange={(e, value) => {
                        if(selectionCount() < limit || !value) {
                            setValue(obj.ObjectiveID, value)
                        }
                    }}
                    label={obj.Description}/>
            ))}
        </>
    )
}

function personPrioritiesColumn(person:Person, allObjectives: Objective[], selection:NumberBool, setValue: (key: number, value: boolean) => void){
    const personObjectives = allObjectives.filter(obj => obj.PersonID === person.PersonID)

    return (
        <>
            {prioritiesColumn(personObjectives, 3, String(person.PersonID), selection, setValue)}
        </>
    )
}

export function subHeadline(title: string){
    return (
        <Grid container>
            <Grid item xs={12} className="text-center">{title}</Grid>
        </Grid>
    )
}

export const copyAndSet = (arr:NumberBool, key:number, value: boolean) =>{
    const copy:NumberBool = JSON.parse(JSON.stringify(arr))
    copy[key] = value

    return copy
}

export const onlySelected = (arr: NumberBool) => {
    return Object.keys(arr).filter(id => arr[Number(id)])
}

export function LifeprintActions({view, downloadPDF}:{view:()=>void, downloadPDF:()=>void}){
    return (
        <DialogActions>
            <MuiButton onClick={view} size="large" variant="contained">
                View
            </MuiButton>
            <MuiButton onClick={downloadPDF} size="large" variant="contained" color="primary">
                Download
            </MuiButton>
        </DialogActions>
    )
}

/**
 * Main component
 * @constructor
 */
const DreamLifeprintEditor = ({viewReport,downloadPdfReport}:LifeprintEditorPageProps): ReactElement => {

    const { selectedHousehold } = useStoreState((state) => state.household);
    const { persons } = useStoreState((state) => state.person);
    const { objectives } = useStoreState((state) => state.objective);

    const [person1Objs, setPerson1Objs] = useState<NumberBool>({})
    const [person2Objs, setPerson2Objs] = useState<NumberBool>({})
    const [familyPriorities, setFamilyPriorities]       = useState<NumberBool>({})
    const [workPriorities, setWorkPriorities]           = useState<NumberBool>({})
    const [communityPriorities, setCommunityPriorities] = useState<NumberBool>({})

    const [additionalPriorities, setAdditionalPriorities] = useState<NumberBool>({})

    const primaryPeople = persons.filter(p => p.PersonID === selectedHousehold.PrimaryPerson1ID || p.PersonID === selectedHousehold.PrimaryPerson2ID)
    const familyObjectives      = objectives.filter( obj => obj.DimensionOfLifeID === 2)
    const workObjectives        = objectives.filter( obj => obj.DimensionOfLifeID === 3)
    const communityObjective    = objectives.filter( obj => obj.DimensionOfLifeID === 4)

    const reportParams = () => (
        {
            person1Objs: onlySelected(person1Objs),
            person2Objs: onlySelected(person2Objs),
            familyPriorities: onlySelected(familyPriorities),
            workPriorities: onlySelected(workPriorities),
            communityPriorities: onlySelected(communityPriorities),
            additionalPriorities: onlySelected(additionalPriorities)
        }
    )

    const downloadPDF = async () => {
        await downloadPdfReport(ReportType.DREAM_LIFEPRINT, undefined, undefined, undefined, reportParams())
    }

    const view = async () => {
        await viewReport(ReportType.DREAM_LIFEPRINT, reportParams())
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
            <Grid container className="m-t-20">
                <Grid item xs={4}/>
                <Grid item xs={4} className="text-center">
                    <h2>Additional priorities</h2>
                </Grid>
                <Grid item xs={4}/>
            </Grid>
            {subHeadline("Select additional priorities. Maximum 9 items")}
            <Grid container className="m-t-20">
                <Grid item xs={3}/>
                <Grid item xs={6}>
                    {prioritiesColumn(objectives, 9, "additional", additionalPriorities, (k,v) => setAdditionalPriorities(copyAndSet(additionalPriorities, k, v)))}
                </Grid>
                <Grid item xs={3}/>
            </Grid>
            <LifeprintActions view={view} downloadPDF={downloadPDF}/>
        </div>
    )
}

export default DreamLifeprintEditor
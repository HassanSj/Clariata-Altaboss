import { Button, Checkbox, FormControlLabel, Grid, Box } from "@material-ui/core"
import moment from "moment";
import React from "react";
import { useStoreState } from "~/store/hooks";
import { Objective } from "~/types/api/models";
import SelectDate from "~/ui/components/Forms/SelectDate"
import {addMonths} from "~/ui/constants/utils";
import { DirectionLifeprintData } from "../DirectionLifePrint";

function title(title: string){
    return (
        <Grid container className="m-t-20">
            <Grid item xs={4}/>
            <Grid item xs={4} className="text-center">
                <h2>{title}</h2>
            </Grid>
            <Grid item xs={4}/>
        </Grid>
    )
}

type NumberBool = {[key:number]:boolean}

const copyAndSet = (arr:NumberBool, key:number, value: boolean) =>{
    const copy:NumberBool = JSON.parse(JSON.stringify(arr))
    copy[key] = value

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
                        if(selectionCount() < limit || !value) {
                            setValue(obj.ObjectiveID, value)
                        }
                    }}
                    label={obj.Description}/>
            ))}
        </>
    )
}

interface IProps {
    ProcessDirectionReport: (data: DirectionLifeprintData) => unknown;
}

const DirectionLifePrintFilters = ({ProcessDirectionReport}: IProps) => {

    const { objectives } = useStoreState((state) => state.objective);
    const [top5priorities, setTop5Priorities] = React.useState<NumberBool>({})
    const [startDate, setStartDate] = React.useState<Date>(new Date())
    const [endDate, setEndDate] = React.useState<Date>(addMonths(new Date(),12)!)
    const [showError, setShowError] = React.useState<boolean>(false);

    const displayDirectionLifePrint = async () => {  
       
        console.log(moment(endDate).diff(moment(startDate), "years", true));
        const difference = moment(endDate).diff(moment(startDate), "years", true);
        console.log("Months" + difference);
        if(difference > 1)
        {
             setShowError(true);
        }
        else {
            const data:DirectionLifeprintData = {
                priorities: onlySelected(top5priorities),
                startDate: moment(startDate).format(),
                endDate: moment(endDate).format()
            }
            console.log(onlySelected(top5priorities));
            ProcessDirectionReport(data);
        }
    }    

    return (
        <div className="full-width">
                        {title("Top 5 Priorities")}
                        <Grid container className="m-t-20">
                            <Grid item xs={4}/>
                            <Grid item xs={4}>
                                {prioritiesColumn(objectives,5,"top-5",top5priorities, (key, value) => setTop5Priorities(copyAndSet(top5priorities, key, value)))}
                            </Grid>
                            <Grid item xs={4}/>
                        </Grid>
                        {title("Time Frame")}
                        <Grid container className="p-20" spacing={5}>
                            <Box
                                component={Grid}
                                display={showError ? "block" : "none"}
                            >
                                <div style={{color: "red", textAlign: "center"}}>End Date cannot be beyond 1 year from the Start Date</div>
                            </Box>
                            <Grid item xs={6}>
                                <SelectDate
                                    type="month_year"
                                    label="Start"
                                    field={{value: startDate}}
                                    onChange={(e:{target:{value:any}}) => {
                                        setStartDate(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <SelectDate
                                    type="month_year"
                                    label="End"
                                    field={{value: endDate}}
                                    onChange={(e:{target:{value:any}}) => {
                                        setEndDate(e.target.value)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <div style={{paddingTop: "25px"}}>
                                <Button size="large" variant="contained" color="primary" onClick={() => displayDirectionLifePrint()}>Run Report</Button>
                            </div>
                    </div>
    )
}

export default DirectionLifePrintFilters;
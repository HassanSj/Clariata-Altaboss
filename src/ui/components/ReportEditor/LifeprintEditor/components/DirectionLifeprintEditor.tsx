import React, {ReactElement, useState} from "react";
import {Grid} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import {
    copyAndSet, LifeprintActions,
    NumberBool, onlySelected,
    prioritiesColumn
} from "./DreamLifeprintEditor";
import {addMonths} from "~/ui/constants/utils";
import SelectDate from "~/ui/components/Forms/SelectDate";
import {ReportType} from "~/ui/constants/reports";
import {LifeprintEditorPageProps} from "../LifeprintEditor";
import {formatDate} from "@telerik/kendo-intl";
import moment from "moment";

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

/**
 * Main component
 * @constructor
 */
const DirectionLifeprintEditor = ({viewReport,downloadPdfReport}:LifeprintEditorPageProps):ReactElement => {
    const { objectives } = useStoreState((state) => state.objective);

    const [top5priorities, setTop5Priorities] = useState<NumberBool>({})
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(addMonths(new Date(),12)!)

    const reportParams = () => (
        {
            priorities: onlySelected(top5priorities),
            startDate: moment(startDate).format(),
            endDate: moment(endDate).format()
        }
    )

    const downloadPDF = async () => {
        await downloadPdfReport(ReportType.DIRECTION_LIFEPRINT, undefined, undefined, undefined, reportParams())
    }

    const view = async () => {
        console.log(reportParams);
        await viewReport(ReportType.DIRECTION_LIFEPRINT, reportParams());
    }

    return (
        <div className="full-width">
            {title("Top 5 Priorities")}
            <Grid container className="m-t-20">
                <Grid item xs={4}/>
                <Grid item xs={4}>
                    {prioritiesColumn(objectives,9,"top-5",top5priorities, (key, value) => setTop5Priorities(copyAndSet(top5priorities, key, value)))}
                </Grid>
                <Grid item xs={4}/>
            </Grid>
            {title("Time Frame")}
            <Grid container className="p-20" spacing={5}>
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

            <LifeprintActions view={view} downloadPDF={downloadPDF}/>
        </div>
    )
}

export default DirectionLifeprintEditor
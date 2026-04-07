import React, {ReactElement, useState} from "react";
import Modal from "~/ui/components/Dialogs/Modal";
import {Button, ButtonGroup, Grid} from "@material-ui/core";
import DirectionLifeprintEditor from "./components/DirectionLifeprintEditor";
import DreamLifeprintEditor from "./components/DreamLifeprintEditor";
import useReports from "~/ui/hooks/useReports";
import ReportViewer from "~/ui/components/Reports/ReportViewer";
import {ReportType} from "~/ui/constants/reports";
import {StringKeyedObject} from "~/ui/constants/utils";

interface IProp{
    isOpen: boolean,
    onClose: ()=> void
}

export interface LifeprintEditorPageProps {
    viewReport: (type: ReportType,extraOptions?:StringKeyedObject) => Promise<void>,
    downloadPdfReport: (type: ReportType, evaluationId?: number, year?: number, quarter?: number,extraOptions?: StringKeyedObject) => Promise<void>
}

const modalHeader = () => {
    return (
        <div className="text-center">
            <h3>LifePrint</h3>
        </div>
    )
}

const LifeprintEditor = ({isOpen,onClose}:IProp): ReactElement => {
    const {
        selectedReport,
        selectedReportProps,
        showReport,
        viewReport,
        hideReport,
        downloadPdfReport,
    } = useReports();

    const [latestProps, setLatestProps] = useState<any|undefined>()
    const [reportType, setReportType] = useState<1|2>(1)

    // Color of the button
    const color = (pageIndex: number) => reportType === pageIndex ? 'primary' : 'default'

    const viewReportCustom = async (type: ReportType,extraOptions?:StringKeyedObject)=>{
        setLatestProps(extraOptions)
        await viewReport(type,extraOptions)
    }

    return (
        <>
        <Modal title={modalHeader()} isOpen={isOpen} handleClose={onClose} width="lg" hideFooter={true}>
            <Grid container>
                <Grid item xs={5}/>
                <Grid item xs={2}>
                    <ButtonGroup color="primary" variant="contained">
                        <Button color={color(1)}
                                onClick={() => setReportType(1)}>Direction</Button>
                        <Button color={color(2)}
                                onClick={() => setReportType(2)}>Dream</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={5}/>
            </Grid>

            {reportType === 1 ?
                <DirectionLifeprintEditor viewReport={viewReportCustom} downloadPdfReport={downloadPdfReport}/> :
                <DreamLifeprintEditor viewReport={viewReportCustom} downloadPdfReport={downloadPdfReport}/>
            }

            {selectedReport &&
                <ReportViewer definition={selectedReport}
                              props={selectedReportProps}
                              isOpen={showReport}
                              onClose={() => {
                                  setLatestProps(undefined)
                                  hideReport()
                              }}
                              onDownload={() => downloadPdfReport(selectedReport.type,undefined, undefined,undefined,latestProps)}/>
            }
        </Modal>
        </>
    )
}

export default LifeprintEditor
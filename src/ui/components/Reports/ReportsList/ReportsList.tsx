import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Button,
    Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import React from "react";
import {useStoreState} from "~/store/hooks";
import {isExcelReport, isPdfReport, ReportDefinition, ReportType, ReportTypes} from "~/ui/constants/reports";
import useReports from "~/ui/hooks/useReports";
import ReportViewer from "~/ui/components/Reports/ReportViewer";
import GuideBookEditor from "../../ReportEditor/GuideBookEditor";
import LifeprintEditor from "../../ReportEditor/LifeprintEditor";
import TimelineEditor from "../../ReportEditor/TimelineEditor";
import InterviewEditor from "../../ReportEditor/InterviewEditor";

interface IProps {
    isModal?: boolean;
    discover?: boolean;
    stories?: boolean;
}

const ReportsList = ({isModal, discover, stories} : IProps) => {
    const {
        selectedReport,
        selectedReportProps,
        showReport,
        showReportList,
        viewReport,
        hideReport,
        downloadPdfReport,
        downloadExcelReport
    } = useReports();

    const [showGuideBookEditor,setShowGuideBookEditor] = React.useState<boolean>(false);
    const [showLifePrintEditor, setShowLifePrintEditor] = React.useState<boolean>(false);
    const [showTimelineEditor,setShowTimelineEditor] = React.useState<boolean>(false);
    const [showInterviewEditor,setShowInterviewEditor] = React.useState<boolean>(false);

    const { selectedHousehold } = useStoreState((state) => state.household);
    const { persons } = useStoreState((state) => state.person);

    const person1 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson1ID);
    const person2 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson2ID);

    return (
        <>
            { selectedHousehold?.HouseholdID && !isModal ?
                <>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} style={{marginBottom: '30px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Report Editors
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                                <ListItem button key={1} style={{
                                            backgroundColor: '#E9E9E9'
                                        }} onClick={() => setShowLifePrintEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Lifeprint Editor" />
                                </ListItem>

                                <ListItem button key={2} style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => setShowTimelineEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Ancestral Timeline Editor" />
                                </ListItem>

                                <ListItem button key={3} style={{
                                            backgroundColor: '#E9E9E9'
                                        }} onClick={() => setShowGuideBookEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Guidebook Editor" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            
                            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Discovery Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                            {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.discover && !ReportTypes[reportKey]?.editable)?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if((report.type === ReportType.PERSONAL_STORY && !selectedHousehold.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !selectedHousehold.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={(report.type === ReportType.LIFE_GRAPH ? "Dimensions of Life " : (ReportType.LIFE_GRAPH_METRIC === report.type ? "Metrics of Success " : "")) + report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => viewReport(report.type)}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            {isPdfReport(report?.format) ?
                                                <Tooltip title="Download PDF Report">
                                                    <IconButton edge="end" aria-label="pdf" onClick={() => downloadPdfReport(report.type)}>
                                                        <Icon>picture_as_pdf</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                            {isExcelReport(report?.format) ?
                                                <Tooltip title="Download Excel Report">
                                                    <IconButton edge="end" aria-label="excel" onClick={() => downloadExcelReport(report.type)}>
                                                        <Icon>border_all</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )
                                }
                            })}
                            </List>
                            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Dream Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                            {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.dream && !ReportTypes[reportKey]?.editable)?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if((report.type === ReportType.PERSONAL_STORY && !selectedHousehold.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !selectedHousehold.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={(report.type === ReportType.LIFE_GRAPH ? "Dimensions of Life " : (ReportType.LIFE_GRAPH_METRIC === report.type ? "Metrics of Success " : "")) + report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => viewReport(report.type)}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            {isPdfReport(report?.format) ?
                                                <Tooltip title="Download PDF Report">
                                                    <IconButton edge="end" aria-label="pdf" onClick={() => downloadPdfReport(report.type)}>
                                                        <Icon>picture_as_pdf</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                            {isExcelReport(report?.format) ?
                                                <Tooltip title="Download Excel Report">
                                                    <IconButton edge="end" aria-label="excel" onClick={() => downloadExcelReport(report.type)}>
                                                        <Icon>border_all</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )
                                }
                            })}
                            </List>
                            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Direction Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                            {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.direction && !ReportTypes[reportKey]?.editable)?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if((report.type === ReportType.PERSONAL_STORY && !selectedHousehold.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !selectedHousehold.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={(report.type === ReportType.LIFE_GRAPH ? "Dimensions of Life " : (ReportType.LIFE_GRAPH_METRIC === report.type ? "Metrics of Success " : "")) + report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => viewReport(report.type)}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>

                                            {isPdfReport(report?.format) ?
                                                <Tooltip title="Download PDF Report">
                                                    <IconButton edge="end" aria-label="pdf" onClick={() => downloadPdfReport(report.type)}>
                                                        <Icon>picture_as_pdf</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                            {isExcelReport(report?.format) ?
                                                <Tooltip title="Download Excel Report">
                                                    <IconButton edge="end" aria-label="excel" onClick={() => downloadExcelReport(report.type)}>
                                                        <Icon>border_all</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )
                                }
                            })}
                            </List>
                            { (selectedReport) ?
                              <ReportViewer definition={selectedReport}
                                            props={selectedReportProps}
                                            isOpen={showReport}
                                            onClose={() => hideReport()}
                                            onDownload={(saveToAWS) => downloadPdfReport(selectedReport.type, undefined, undefined,undefined, undefined, saveToAWS, selectedHousehold.HouseholdID, selectedReport?.name)} />
                            : null }
                        </CardContent>
                    </Card>
                    <GuideBookEditor isOpen={showGuideBookEditor} onClose={() => setShowGuideBookEditor(false)} />
                    <LifeprintEditor isOpen={showLifePrintEditor} onClose={() => setShowLifePrintEditor(false)}/>
                    <TimelineEditor isOpen={showTimelineEditor} onClose={() => setShowTimelineEditor(false)} />
                </>
            : null }
            { selectedHousehold?.HouseholdID && isModal && (discover || stories) && (showReportList) ? 
            <Card>
                <CardContent>
                    <List>
                    {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.story)?.map((reportKey: any, index: number) => {
                        const report: ReportDefinition = ReportTypes[reportKey];
                        if((report.type === ReportType.PERSONAL_STORY && !selectedHousehold.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !selectedHousehold.PrimaryPerson2ID))
                        {}
                        else {
                            return (
                            <ListItem key={index} style={{
                                backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                            }}>
                                <ListItemIcon>
                                    <Icon>{report.icon}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                    
                                <ListItemSecondaryAction>
                                    <Tooltip title="View">
                                        <IconButton edge="end" aria-label="view" onClick={() => viewReport(report.type)}>
                                            <Icon>visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                            )
                        }
                        })}
                        {/* <ListItem button key={4} style={{
                                    backgroundColor: '#FFFFFF'
                                }} onClick={() => setShowInterviewEditor(true)}>
                            <ListItemIcon>
                                <Icon>settings_application</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Interview Report Editor" />
                        </ListItem> */}
                    </List>
                    <InterviewEditor isOpen={showInterviewEditor} onClose={() => setShowInterviewEditor(false)} />
                </CardContent>
            </Card>
            : (selectedReport) ?
                <ReportViewer definition={selectedReport}
                              props={selectedReportProps}
                              isOpen={showReport}
                              onClose={() => hideReport()}
                              onDownload={() => downloadPdfReport(selectedReport.type)} />
                     : null }
        </>
    )
}

export default ReportsList;

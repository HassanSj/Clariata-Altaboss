import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import {NavigationTab} from "~/ui/constants/navigations";
import React, {ReactElement} from "react";
import {Button, Grid, Input, 
  IconButton,
  List, Card,
  ListItem, Icon,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  FormControlLabel,
  Checkbox,
  DialogActions} from "@material-ui/core";
import ReportsList from "~/ui/components/Reports/ReportsList";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import useReports from "~/ui/hooks/useReports";
import ReportViewer from "~/ui/components/Reports/ReportViewer";
import GuideBookEditor from "~/ui/components/ReportEditor/GuideBookEditor/";
import LifeprintEditor from "~/ui/components/ReportEditor/LifeprintEditor";
import TimelineEditor from "~/ui/components/ReportEditor/TimelineEditor";
import InterviewEditor from "~/ui/components/ReportEditor/InterviewEditor";
import {useStoreState} from "~/store/hooks";
import {isExcelReport, isPdfReport, ReportDefinition, ReportType, ReportTypes} from "~/ui/constants/reports";
import DiscoverLifePrint, { getDiscoverLifePrintData } from "~/ui/components/Reports/DiscoverLifePrint/DiscoverLifePrint";
import moment from "moment";
import { TimelineFilters } from "~/ui/components/Reports/TimelineReport/TimelineReport";
import SelectDate from "~/ui/components/Forms/SelectDate";
import DreamLifeprintEditor from "~/ui/components/ReportEditor/LifeprintEditor/components/DreamLifeprintEditor";
import DirectionLifePrint from "~/ui/components/Reports/DirectionLifePrint";
import DiscoverLifePrintFilters from "~/ui/components/Reports/DiscoverLifePrint/DiscoverLifePrintFilters/DiscoverLifePrintFilters";
import { DirectionLifeprintData, getDirectionLifePrintData } from "~/ui/components/Reports/DirectionLifePrint/DirectionLifePrint";
import DirectionLifePrintFilters from "~/ui/components/Reports/DirectionLifePrint/DirectionLifePrintFilters/DirectionLifePrintFilters";
import DreamLifePrint, { getDreamLifePrintData, SelectedPriorities } from "~/ui/components/Reports/DreamLifePrint/DreamLifePrint";
import DreamLifePrintFilters from "~/ui/components/Reports/DreamLifePrint/DreamLifePrintFilters";
import useNotifications from "~/ui/hooks/useNotifications";
import DestinyItemSelector from "~/ui/components/Reports/DestinyReport/DestinyItemSelector";
import DestinyReport, { getDestinyReportData } from "~/ui/components/Reports/DestinyReport/DestinyReport";
import { DevelopmentPlan } from "~/types/api/developmentPlan";
import { PlanMemberItem } from "~/types/api/planMemberItem";
import { DevelopmentPlanCategoryItem, getDevelopmentPlanData } from "~/ui/components/Reports/DevelopmentPlanReport/DevelopmentPlan";
import DevelopmentPlanReport from "~/ui/components/Reports/DevelopmentPlanReport/DevelopmentPlanReport";
import {Person} from "~/types/api/person";
import api from "~/services/api";
import selectPerson from "~/store/destiny/actions/selectPerson";
import DevelopmentPlanSelector from "~/ui/components/Reports/DevelopmentPlanReport/DevelopmentPlanSelector";
import { DestinyOverviewSummaryItem, getDestinyFamilyData } from "~/ui/components/Reports/DestinyFamilyOverview/DestinyFamilyOverview";
import DestinyFamilyOverviewSelector from "~/ui/components/Reports/DestinyFamilyOverview/DestinyFamilyOverviewSelector";
import DestinyFamilyOverviewReport from "~/ui/components/Reports/DestinyFamilyOverview/DestinyFamilyOverviewReport";
import router from "next/router";
import paths from "~/ui/constants/paths";
import { CustomFilter } from "~/ui/components/Timeline/TimelineReport";
import useHousehold from "~/ui/hooks/useHousehold";
import { Household } from "~/types/api/household";
import usePersons from "~/ui/hooks/usePersons";
import {addMonths} from "~/ui/constants/utils";
import Modal from "~/ui/components/Dialogs/Modal";
import ButtonComponent from "~/ui/components/Button";

const Reports = (): ReactElement => {

  const {
    selectedReport,
    selectedReportProps,
    showReport,
    viewReport,
    hideReport,
    downloadPdfReport,
    showReportList,
    hideReportList,
    getReportRoutePath
} = useReports();


const notifications = useNotifications();
/**************************************************/
/**************************************************/
// START DISPLAY/HIDE REPORT ACTIONS //
/**************************************************/
/**************************************************/

const returnToReport = () => {
    setShowGuideBookEditor(false);
    hideReport(); 
    setShowDiscoverLifePrint(false);
    setShowDiscoverLifePrintFilters(false);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrintFilters(false);
    setShowDirectionLifePrint(false);
    setShowDestinyItemSelector(false);
    setShowInterviewEditor(false);
    setShowDestinyItemReport(false);
    setShowDevelopmentPlanReport(false);
    setShowDestinyFamilyReport(false);
    setShowDestinyFamilySelector(false);
    
};

const displayGuideBookEditor = () => {
  setShowGuideBookEditor(true);
  hideReportList();
}

const displayDestinyItemSelector = () => {
    setShowDestinyItemSelector(true);    
    hideReportList();
}

const displayDestinyItemReport = async (planId: number, type: string) => {
    notifications.toggleLoading(true);
    setShowDestinyItemSelector(false);    
    hideReportList();
    setItemType(type);
    const destinyItemData = await getDestinyReportData(householdId, planId, type);
    //setDestinyItemReportData(destinyItemData);
    setShowDestinyItemReport(true);
    notifications.toggleLoading(false);
}

const displayDevelopmentPlanSelector = () => {
    setShowDevelopmentPlanSelector(true);    
    hideReportList();
}

const displayDevelopmentPlanReport = async (planId: number, personId: number) => {
    notifications.toggleLoading(true);
    setShowDevelopmentPlanSelector(false);    
    hideReportList();
    const response = await api.person.get(personId, householdId);
    const person = await response.data;
    setReportPerson(person);
    const developmentPlanData = await getDevelopmentPlanData(personId, planId, householdId);
    setDevelopmentPlanReportData(developmentPlanData);
    setShowDevelopmentPlanReport(true);
    notifications.toggleLoading(false);
}

const displayDestinyFamilySelector = () => {
    setShowDestinyFamilySelector(true);    
    hideReportList();
}

const displayDestinyFamilyReport = async (planId: number) => {
    setShowDestinyFamilySelector(false);    
    hideReportList();
    notifications.toggleLoading(true);
    const destinyFamilyData = await getDestinyFamilyData(planId, householdId);
    setDestinyFamilyReportData(destinyFamilyData);
    setShowDestinyFamilyReport(true);
    notifications.toggleLoading(false);
}

const displayDiscoverLifePrintFilters = async () => {
    hideReportList();
    setShowDiscoverLifePrintFilters(true);
    setShowDiscoverLifePrint(false);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrintFilters(false);
    setShowDirectionLifePrint(false);
}

const displayDiscoverLifePrint = async () => {
    hideReportList();
    setShowDiscoverLifePrintFilters(false);
    setShowDiscoverLifePrint(true);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrintFilters(false);
    setShowDirectionLifePrint(false);
}

const displayDreamLifePrintFilters = async () => {
    hideReportList();
    setShowDiscoverLifePrintFilters(false);
    setShowDiscoverLifePrint(false);
    setShowDreamLifePrintFilters(true);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrintFilters(false);
    setShowDirectionLifePrint(false);
}

const displayDreamLifePrint = async () => {
    hideReportList();
    setShowDiscoverLifePrintFilters(false);
    setShowDiscoverLifePrint(false);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(true);
    setShowDirectionLifePrintFilters(false);
    setShowDirectionLifePrint(false);
}

const displayDirectionLifePrintFilters = async () => {
    hideReportList();
    setShowDiscoverLifePrintFilters(false);
    setShowDiscoverLifePrint(false);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrintFilters(true);
    setShowDirectionLifePrint(false);
}

const displayDirectionLifePrint = async () => {  
       
    setShowDiscoverLifePrintFilters(false);
    setShowDiscoverLifePrint(false);
    setShowDreamLifePrintFilters(false);
    setShowDreamLifePrint(false);
    setShowDirectionLifePrint(true);
    setShowDirectionLifePrintFilters(false);
}

const handleRoute = (
    reportType: ReportType,
    year?:number,
    startMonth?:number,
    endMonth?:number) => {
        if(reportType === ReportType.ACTION_PLAN_SUMMARY_QUARTER){
            router.push({
                pathname: getReportRoutePath(reportType),
                query: {
                    year: year,
                    start: startMonth,
                    end: endMonth
                }
            })
        }
        else{
            const pathName = getReportRoutePath(reportType);
            router.push(pathName);
        }
}
/**************************************************/
/**************************************************/
// END DISPLAY/HIDE REPORT ACTIONS //
/**************************************************/
/**************************************************/

/************************************************ */
/************************************************ */
//  START USESTATE  //
/************************************************ */
/************************************************ */
const [showGuideBookEditor,setShowGuideBookEditor] = React.useState<boolean>(false);
const [showLifePrintEditor, setShowLifePrintEditor] = React.useState<boolean>(false);
const [showDiscoverLifePrint, setShowDiscoverLifePrint] = React.useState<boolean>(false);
const [showDiscoverLifePrintFilters, setShowDiscoverLifePrintFilters] = React.useState<boolean>(false);
const [showDreamLifePrint, setShowDreamLifePrint] = React.useState<boolean>(false);
const [showDreamLifePrintFilters, setShowDreamLifePrintFilters] = React.useState<boolean>(false);
const [showDirectionLifePrint, setShowDirectionLifePrint] = React.useState<boolean>(false);
const [showDirectionLifePrintFilters, setShowDirectionLifePrintFilters] = React.useState<boolean>(false);
const [showTimelineEditor,setShowTimelineEditor] = React.useState<boolean>(false);
const [showInterviewEditor,setShowInterviewEditor] = React.useState<boolean>(false);
const [showDestinyItemSelector,setShowDestinyItemSelector] = React.useState<boolean>(false);
const [showDestinyItemReport,setShowDestinyItemReport] = React.useState<boolean>(false);
const [showDevelopmentPlanSelector,setShowDevelopmentPlanSelector] = React.useState<boolean>(false);
const [showDevelopmentPlanReport,setShowDevelopmentPlanReport] = React.useState<boolean>(false);
const [showDestinyFamilySelector,setShowDestinyFamilySelector] = React.useState<boolean>(false);
const [showDestinyFamilyReport,setShowDestinyFamilyReport] = React.useState<boolean>(false);
const [discoverData, setDiscoverData] = React.useState<any>();
const [directionData, setDirectionData] = React.useState<any>();
const [dreamData, setDreamData] = React.useState<any>();
const [destinyItemReportData, setDestinyItemReportData] = React.useState<PlanMemberItem[]>();
const [developmentPlanReportData, setDevelopmentPlanReportData] = React.useState<DevelopmentPlanCategoryItem[]>();
const [destinyFamilyReportData, setDestinyFamilyReportData] = React.useState<DestinyOverviewSummaryItem[]>();
const [isLoading, setIsLoading] = React.useState<boolean>();
const [itemType, setItemType] = React.useState<string>("");
const [reportPerson, setReportPerson] = React.useState<Person>();

let newDate = new Date();
let beginDate = moment(newDate).subtract(100, 'year').toDate();
let begin = beginDate.toLocaleString();
let end = newDate;

// const { selectedHousehold } = useStoreState((state) => state.household);
// const { persons } = useStoreState((state) => state.person);
// const { dreamInterviewId, discoverInterviewId } = useStoreState(state => state.interview);
const { discoverInterviewId, dreamInterviewId, householdId } = useStoreState(state => state.selected);
const { household } = useHousehold();
const { persons } = usePersons();

const { objectives } = useStoreState((state) => state.objective);

/************************************************ */
/************************************************ */
//  END USESTATE  //
/************************************************ */
/************************************************ */


const ProcessDiscoverReport = async (discoverStartDate: Date, discoverEndDate: Date, filters: TimelineFilters[], customFilter: CustomFilter) => {
    notifications.toggleLoading(true);
    let data = await getDiscoverLifePrintData(householdId, discoverInterviewId, discoverStartDate, discoverEndDate, filters, customFilter);
    console.log("Process Data");
    console.log(data);
    setDiscoverData(data);
    displayDiscoverLifePrint();
    notifications.toggleLoading(false);
}

const ProcessDreamReport = async (selectedPriorities: SelectedPriorities) => {
    notifications.toggleLoading(true);
    let data = await getDreamLifePrintData(householdId, dreamInterviewId, selectedPriorities);
    setDreamData(data);    
    displayDreamLifePrint();
    notifications.toggleLoading(false);
}

const ProcessDirectionReport = async (dataProp: DirectionLifeprintData) => {
    notifications.toggleLoading(true);
    let data = await getDirectionLifePrintData(householdId, dreamInterviewId, 2022, dataProp)
    setDirectionData(data);
    displayDirectionLifePrint();
    notifications.toggleLoading(false);
}

const person1 = persons?.find(p => p?.PersonID === household?.PrimaryPerson1ID);
const person2 = persons?.find(p => p?.PersonID === household?.PrimaryPerson2ID);

const [open , isOpen] = React.useState<boolean>(false)
const [startMonth, setStartMonth] = React.useState<Date>(new Date());
const [endMonth, setEndMonth] = React.useState<Date>(addMonths((new Date()), 3)!);
const [startYear, setStartYear] = React.useState<Date>(new Date());

const handleClose = () =>{
    isOpen(false)
}

  if(showReportList) {
    return (
      <>
        <DashboardWrapper tab={NavigationTab.REPORTS}>
          <Grid container spacing={1}>
            <Grid xs={3}></Grid>
            <Grid item xs={6}>
            { household?.HouseholdID ?
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
                                {/* <ListItem button key={1} style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => setShowLifePrintEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Lifeprint Editor" />
                                </ListItem> */}

                                <ListItem button key="1a" style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => displayDiscoverLifePrintFilters()}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Discover LifePrint" />
                                </ListItem>

                                <ListItem button key="2a" style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => displayDreamLifePrintFilters()}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Dream LifePrint" />
                                </ListItem>

                                <ListItem button key="3a" style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => displayDirectionLifePrintFilters()}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Direction LifePrint" />
                                </ListItem>
                                <ListItem button key="4a" style={{
                                            backgroundColor: '#E9E9E9'
                                        }} onClick={() => displayGuideBookEditor()}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Guidebook Editor" />
                                </ListItem>
                                {/* <ListItem button key={2} style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => setShowTimelineEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Ancestral Timeline Editor" />
                                </ListItem> */}
                                

                                {/* <ListItem button key={4} style={{
                                            backgroundColor: '#FFFFFF'
                                        }} onClick={() => setShowInterviewEditor(true)}>
                                    <ListItemIcon>
                                        <Icon>settings_application</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary="Interview Report Editor" />
                                </ListItem> */}

                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                        <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Profile Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                            {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.profile && !ReportTypes[reportKey]?.editable)?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if((report.type === ReportType.PERSONAL_STORY && !household.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !household?.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index + "d"} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => {handleRoute(report.type)}}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )
                                }
                            })}
                            </List>                            
                            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Discover Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                            {Object.keys(ReportTypes)?.filter(reportKey => ReportTypes[reportKey]?.discover && !ReportTypes[reportKey]?.editable)?.map((reportKey: any, index: number) => {
                                const report: ReportDefinition = ReportTypes[reportKey];
                                if((report.type === ReportType.PERSONAL_STORY && !household.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !household?.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={(report.type === ReportType.LIFE_GRAPH ? "Dimensions of LIfe " : (ReportType.LIFE_GRAPH_METRIC === report.type ? "Metrics of Success " : "")) + report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                                {/* <IconButton edge="end" aria-label="view" onClick={() => viewReport(report.type)}>
                                                    <Icon>visibility</Icon>
                                                </IconButton> */}
                                                <Tooltip title="View">
                                                    <IconButton edge="end" aria-label="view" onClick={() => {handleRoute(report.type)}}>
                                                        <Icon>visibility</Icon>
                                                    </IconButton>
                                                </Tooltip>
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
                                if((report.type === ReportType.PERSONAL_STORY && !household.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !household?.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index + "b"} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={(report.type === ReportType.LIFE_GRAPH ? "Dimensions of Life " : (ReportType.LIFE_GRAPH_METRIC === report.type ? "Metrics of Success " : "")) + report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => {handleRoute(report.type)}}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
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
                                if((report.type === ReportType.PERSONAL_STORY && !household.PrimaryPerson1ID) || (report.type === ReportType.PERSONAL_STORY_2 && !household.PrimaryPerson2ID))
                                {}
                                else {
                                    return (
                                    <ListItem key={index + "c"} style={{
                                        backgroundColor: index % 2 == 0 ? '#E9E9E9' : '#FFFFFF',
                                    }}>
                                        <ListItemIcon>
                                            <Icon>{report.icon}</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary={report.name} />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view"
                                                    onClick={() => {
                                                        report.type === ReportType.ACTION_PLAN_SUMMARY_QUARTER
                                                        ?
                                                        isOpen(true)
                                                        :
                                                        handleRoute(report.type)
                                                    }}
                                                >
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    )
                                }
                            })}
                            </List>
                            <Grid container spacing={2} style={{marginBottom: '10px'}}>
                                <Grid item xs={3}>
                                    <Typography color="textSecondary" gutterBottom>
                                        Destiny Reports
                                    </Typography>
                                </Grid>
                            </Grid>
                            <List>
                                
                                {/* <ListItem style={{
                                        backgroundColor: '#E9E9E9'
                                    }}>
                                        <ListItemIcon>
                                            <Icon>table_chart</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Destiny Item Report" />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => displayDestinyItemSelector()}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                </ListItem> */}
                                <ListItem style={{
                                        backgroundColor: '#FFFFFF'
                                    }}>
                                        <ListItemIcon>
                                            <Icon>table_chart</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Development Plan Report" />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => displayDevelopmentPlanSelector()}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem style={{
                                        backgroundColor: '#FFFFFF'
                                    }}>
                                        <ListItemIcon>
                                            <Icon>table_chart</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Destiny Family Overview Report" />
                                            
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View">
                                                <IconButton edge="end" aria-label="view" onClick={() => displayDestinyFamilySelector()}>
                                                    <Icon>visibility</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <LifeprintEditor isOpen={showLifePrintEditor} onClose={() => setShowLifePrintEditor(false)}/>
                    <TimelineEditor isOpen={showTimelineEditor} onClose={() => setShowTimelineEditor(false)} />
                    {/* <InterviewEditor isOpen={showInterviewEditor} onClose={() => setShowInterviewEditor(false)} /> */}
                </>
                    : null }
            </Grid>
          </Grid>
        </DashboardWrapper>
        <Modal title={`Select Dates`} isOpen={open} handleClose={handleClose} width="md" hideFooter={true}>
            <>
                <Grid container className="m-t-20" spacing={2}>
                <Grid item xs={4}>
                    <SelectDate
                    type="month"
                    label="Start Month"
                    field={{ value: startMonth }}
                    onChange={(e: { target: { value: any } }) => {
                        setStartMonth(e.target.value);
                    }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <SelectDate
                    type="month"
                    label="End Month"
                    field={{ value: endMonth }}
                    onChange={(e: { target: { value: any } }) => {
                        setEndMonth(e.target.value);
                    }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <SelectDate
                    type="year"
                    label="Start Year"
                    field={{ value: startYear }}
                    onChange={(e: { target: { value: any } }) => {
                        setStartYear(e.target.value);
                    }}
                    />
                </Grid>
                </Grid>
            </>
            <DialogActions>
                <ButtonComponent
                type="button"
                text={`View Report`}
                variant="contained"
                size="large"
                color="primary"
                onClick={async () => {
                    handleRoute(
                        ReportType.ACTION_PLAN_SUMMARY_QUARTER,
                        moment(startYear).year(),
                        moment(startMonth).month(),
                        moment(endMonth).month()
                    );
                    // viewReport(ReportType.ACTION_PLAN_SUMMARY_QUARTER,
                    //         undefined,
                    //         moment(startYear).year(),
                    //         4,
                    //         moment(startMonth).month(),
                    //         moment(endMonth).month()
                    // );

                    // onClose();
                }}
                />
            </DialogActions>
        </Modal>
      </>
    )
  }
  
  if(!showReportList) {
      return (
        <>
          <DashboardWrapper tab={NavigationTab.REPORTS}>
          <Grid container spacing={1}>
            <Grid item xs={2}/>
            <Grid item xs={8}>
              <Button style={{marginBottom: "50px"}} onClick={returnToReport}>
                Return to Report Manager
              </Button>
              <Grid>
              { (showReport && selectedReport) ?
                      <ReportViewer definition={selectedReport}
                                    props={selectedReportProps}
                                    isOpen={showReport}
                                    onClose={() => hideReport()}
                                    onDownload={() => downloadPdfReport(selectedReport.type)} />
                    : null }
              { (showGuideBookEditor) ?
                <GuideBookEditor isOpen={showGuideBookEditor} onClose={() => hideReport()}/>
              :null}
            
                { (showDiscoverLifePrintFilters) ?
                <>
                    <DiscoverLifePrintFilters processDiscoverReport={ProcessDiscoverReport} />
                </>
                : null }
                {(showDiscoverLifePrint) ? 
                    <DiscoverLifePrint household={household} persons={persons} vision={discoverData.vision} mission1={discoverData.mission1} mission2={discoverData.mission2} coreValues={discoverData.coreValues} treeData={discoverData.treeData} timelineItems={discoverData.timelineItems} owner={discoverData.owner} />
                : null }

                { (showDreamLifePrintFilters) ? 
                <>
                    <DreamLifePrintFilters household={household as Household} objectives={objectives} persons={persons as Person[]} ProcessDreamReport={ProcessDreamReport} />
                </>
                : null }

                { (showDreamLifePrint) ?
                <>
                    <DreamLifePrint household={household} persons={persons} objectives={dreamData.objectives} familyPriorities={dreamData.familyPriorities} workLifePriorities={dreamData.workLifePriorities} communityPriorities={dreamData.communityPriorities} person2Priorities={dreamData.person2Priorities} person1Priorities={dreamData.person1Priorities} additionalPriorities={dreamData.additionalPriorities} whyData={dreamData.whyData} chartData={dreamData.chartData} chartImages={dreamData.chartImages} owner={dreamData.owner} />
                </>
                : null
                }
                { (showDirectionLifePrintFilters) ? 
                <>
                    <DirectionLifePrintFilters ProcessDirectionReport={ProcessDirectionReport} />
                </>
                : null }

                { (showDirectionLifePrint) ?
                <>
                    <DirectionLifePrint  household={household} persons={persons} objectives={directionData.objectives} year={2022} startDate={directionData.startDate} endDate={directionData.endDate} ownerName={directionData.owner} />
                </>
                : null
                }
                {/* { (showDestinyItemSelector) ?
                    <>
                        <DestinyItemSelector RunReport={displayDestinyItemReport}/>
                    </>
                    : null
                } */}
                {/* { (showDestinyItemReport) ? 
                <>
                    <DestinyReport data={destinyItemReportData} itemType={itemType} household={selectedHousehold} persons={persons} />
                </>
                : null
                } */}
                { (showDevelopmentPlanSelector) ?
                    <>
                        <DevelopmentPlanSelector RunReport={displayDevelopmentPlanReport} householdId={householdId}/>
                    </>
                    : null
                }
                { (showDevelopmentPlanReport) ? 
                <>
                    <DevelopmentPlanReport data={developmentPlanReportData} person={reportPerson} household={household as Household} />
                </>
                : null
                }
                { (showDestinyFamilySelector) ?
                    <>
                        <DestinyFamilyOverviewSelector RunReport={displayDestinyFamilyReport}/>
                    </>
                    : null
                }
                { (showDestinyFamilyReport) ? 
                <>
                    <DestinyFamilyOverviewReport data={destinyFamilyReportData} persons={persons} household={household as Household} />
                </>
                : null
                }
              </Grid>
            </Grid>
            </Grid>
        </DashboardWrapper>
        </>
      )
  }
  else{
    return <></>;
  }

  
}

export default Reports;
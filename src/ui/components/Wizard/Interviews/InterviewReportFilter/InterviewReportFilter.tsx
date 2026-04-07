import styles from "./InterviewReportFilter.module.scss";
import {useStoreState} from "~/store/hooks";
import React from "react";
import {Card, CardContent, Checkbox, DialogActions, FormControl, FormControlLabel, Grid, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Tooltip} from "@material-ui/core";
import {WizardType} from "~/ui/constants/wizard";
import Button from "~/ui/components/Button";
import { ReportDefinition, ReportType, ReportTypes } from "~/ui/constants/reports";
import ReportViewer from "~/ui/components/Reports/ReportViewer";
import Modal from "~/ui/components/Dialogs/Modal";
import { InterviewGridStep } from "../InterviewGrid/InterviewGrid";
import useReports from '~/ui/hooks/useReports';
import useMountEvents from "~/ui/hooks/useMountEvents";
import DreamInterviewGrid from "~/ui/components/Reports/DreamInterviewGrid";

interface IProps {
  dreamInterview: boolean;
}

const InterviewReportFilter = ({ dreamInterview }: IProps) => {

  const [report,setReport] = React.useState(dreamInterview ? ReportTypes[ReportType.DREAM_INTERVIEW] : ReportTypes[ReportType.DISCOVER_INTERVIEW]);

  const [props,setProps] = React.useState<any>();
  const [params,setParams] = React.useState<any>();
  const [downloadUrl,setDownloadUrl] = React.useState<string>();

  const [showFilteredReport,setShowFilteredReport] = React.useState(false);
  const [doPrint, setDoPrint] = React.useState(false);
  
  const {downloadFilteredInterviewReport,
          downloadPdfReport,
          selectedReport,
          selectedReportProps,
          showReport,
          viewReport,
          hideReport} = useReports();


  const {wizard} = useStoreState((state) => state.wizard);
  const {dreamInterviewId, discoverInterviewId} = useStoreState(state => state.interview);

  const [Sections, setSections] = React.useState<number[]>([]);

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);
  const [steps, setSteps] = React.useState(Object.assign([], wizard?.steps));

  const [reportType, setReportType] = React.useState<Number>(0);
  const [responseType, setResponseType] = React.useState<Number>(0);
  const [questionType, setQuestionType] = React.useState<Number>(0);

  const [showStoryReports,setShowStoryReports] = React.useState(false);
  const [showGridSelector,setShowGridSelector] = React.useState(false);
  const [showInterviewGrid, setShowInterviewGrid] = React.useState(false);

  const [clarifying, setClarifying] = React.useState(false);

  const { selectedHousehold } = useStoreState((state) => state.household);
  const { persons } = useStoreState((state) => state.person);

  const person1 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson1ID);
  const person2 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson2ID);

  const [showResponses,setShowResponses] = React.useState(true);
  const [answeredOnly, setAnsweredOnly] = React.useState(false);
  const [unansweredOnly, setUnansweredOnly] = React.useState(false);
  const [starredOnly, setStarredOnly] = React.useState(false);
  const [hiddenOnly, setHiddenOnly] = React.useState(false);
  const [storyReportType, setStoryReportType] = React.useState<ReportType>();


  const printReport = async () => {
    const r = await downloadFilteredInterviewReport(isDreamInterview ? dreamInterviewId : discoverInterviewId, showResponses, clarifying, answeredOnly, unansweredOnly, starredOnly, hiddenOnly, Sections, storyReportType);
    setProps(r?.props);
    setParams(r?.params);
    setDownloadUrl(r?.url);
    setShowFilteredReport(true);
    setDoPrint(false);
  }

  const selectSection = (Id?: number) => {
    let sections = Sections;
    if(Id) {
      if(sections?.indexOf(Id) > -1) {
        sections?.filter(s => s != Id);
      } else {
        sections.push(Id);
      }
      setSections(sections);
    }
  }

  const processReport2 = async () => {
    switch (responseType) {
      case 0: viewReport(ReportType.PRIORITY_GRID); break;
      case 1: viewReport(ReportType.WHY); break;
      case 2: viewReport(ReportType.LIFE_GRAPH); break;
      case 3: viewReport(ReportType.LIFE_GRAPH_METRIC); break;
      default: break;
    }
  }

  const processReportProps = async () => {
    setShowResponses(true);
    setAnsweredOnly(false);
    setUnansweredOnly(false);
    setStarredOnly(false);
    setHiddenOnly(false);
    if(!isDreamInterview) {
      switch (responseType) {
          case 0: 
            break;
          case 1: 
            setAnsweredOnly(true);
            break;
          case 2: 
            setUnansweredOnly(true);
            setShowResponses(false);
            break;
          case 3: 
            setStarredOnly(true);
            break;
          case 4: 
            setHiddenOnly(true);
            break;
          default: break;
      }
    }
  }

  const processReportSettings = async () => {
    if(isDreamInterview) {
      switch (reportType) {
        case 0:
            setSections([]);
            setStoryReportType(undefined);
            setShowGridSelector(false);
            setShowInterviewGrid(true);
            break;
        case 1:
            setSections([]);
            setStoryReportType(undefined);
            setShowResponses(false);
            setDoPrint(true);
            setShowInterviewGrid(false);
            break;
        default:
            break;
      }
    } else {
      switch (reportType) {
        case 0:
            setSections([]);
            setStoryReportType(undefined);
            setDoPrint(true);
            break;
        case 1:
            setSections([]);
            setStoryReportType(undefined);
            setShowGridSelector(true);
            break;
        case 2:
            setSections([]);
            setStoryReportType(undefined);
            setShowStoryReports(true);
            break;
        default:
            break;
      }
    }
  }

  useMountEvents({
    onChange: async () => {
      if(doPrint) {
        printReport();
      }
    },
    watchItems: [doPrint]
  });

  const dropdownReportTypes: string[] = isDreamInterview ? 
          [
            'Interview Grid',
            'Interview Questions',
          ] : [
            'All Responses',
            'Grid Sections',
            'Story Reports',
          ];

  const dropdownResponseTypes: string[] = isDreamInterview ? 
        [
          'Priority Grid',
          'Why Report',
          'Dimensions of Life',
          'Metrics of Success',
        ] : [
          'All',
          'Answered',
          'Unanswered',
          'Starred',
          'Hidden',
        ];

  
  const [viewReportTypeText, setViewReportTypeText] = React.useState<string>(dropdownReportTypes[0]);
  const [viewResponseTypeText, setViewResponseTypeText] = React.useState<string>(dropdownResponseTypes[0]);

  return (
    <>
        <div className={styles.reportsWrapper}>
            <div className={styles.reports}>
            <div className={styles.bottom}>
                <Grid container spacing={2}>
                <Grid item xs={isDreamInterview ? 6 : 4}>
                    <FormControl variant="outlined">
                    {/* <InputLabel id="filterReportType">Select Report Type</InputLabel> */}
                    <Select 
                        value = {reportType}
                        // labelId = "filterReportType"
                        label = "Select Report Type"
                        onChange={event => {
                            setReportType(event.target.value as number);
                            setViewReportTypeText(dropdownReportTypes[event.target.value as number]);
                        }}
                        displayEmpty
                        MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getContentAnchorEl: null
                        }}
                    >
                        {dropdownReportTypes.map((text, index) => {
                        return <MenuItem key={index} value={index}>{text}</MenuItem>
                        })}
                        

                    </Select>

                    </FormControl>
                </Grid>
                <Grid item xs={isDreamInterview ? 6 : 4}>
                    <FormControl variant="outlined">
                    {/* <InputLabel id="filterResponseTypes">Select Response Type</InputLabel> */}
                    <Select 
                        value = {responseType}
                        // labelId = "filterResponseTypes"
                        label = "Select Response Type"
                        onChange={event => {
                            setResponseType(event.target.value as number);
                            setViewResponseTypeText(dropdownResponseTypes[event.target.value as number]);
                        }}
                        displayEmpty
                        MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getContentAnchorEl: null
                        }}
                    >
                        {dropdownResponseTypes.map((text, index) => {
                        return <MenuItem key={index} value={index}>{text}</MenuItem>
                        })}
                        

                    </Select>

                    </FormControl>
                </Grid>
                {!isDreamInterview ? 
                <Grid item xs={1}>
                  <Tooltip title="Enable/Disable Response Filters">
                    <IconButton style={{color: wizard?.filtered ? '#C9E6E9' : '#737373',paddingLeft:"20px"}} 
                                className={styles.filter}
                                onClick={async () => {
                                    await processReportProps();
                                    await processReportSettings();
                                }}>
                        <Icon>filter_alt</Icon>
                    </IconButton>
                  </Tooltip>
                </Grid>
                : null }
                {!isDreamInterview ? 
                <Grid item xs={3}>
                  <Button text="Run Report"
                          variant="contained"
                          color="info"
                          size="large"
                          fullWidth={true}
                          // onClick={async () => setDoPrint(true)} />
                          onClick={async () => {
                            await processReportProps();
                            await processReportSettings();
                          }}/>
                </Grid> : null }
                </Grid>
                
            </div>
            {isDreamInterview ? <div className={styles.top}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button text="View Worksheet"
                  // {viewReportTypeText}
                          variant="contained"
                          color="info"
                          size="large"
                          fullWidth={true}
                          onClick={async () => {
                            await processReportProps();
                            await processReportSettings();
                          }} />
                </Grid>
                <Grid item xs={6}>
                  <Button text="View Report"
                          // text={viewResponseTypeText}
                          variant="contained"
                          color="info"
                          size="large"
                          fullWidth={true}
                          onClick={async () => {
                            await processReport2();
                          }} />
                </Grid>
              </Grid>
            </div> : null }
            </div>
        </div>

<Modal title="" isOpen={showFilteredReport} handleClose={() => setShowFilteredReport(false)}>
        <ReportViewer definition={report}
            props={props}
            isOpen={showFilteredReport}
            onClose={() => setShowFilteredReport(false)}
            onDownload={() => window.open(downloadUrl)} />
</Modal>
        { (selectedReport) ?
        <Modal title="" isOpen={showReport} handleClose={() => hideReport()}>
          <ReportViewer definition={selectedReport}
                        props={selectedReportProps}
                        isOpen={showReport}
                        onClose={() => hideReport()}
                        onDownload={() => downloadPdfReport(selectedReport.type)} />
         </Modal>
        : null }

        <Modal title=""  isOpen={showInterviewGrid} handleClose={()=> setShowInterviewGrid(false)} width="md" hideFooter={true}>
          <>
          <DreamInterviewGrid></DreamInterviewGrid>
          </>
        </Modal>

        <Modal title=""
                isOpen={showStoryReports}
                handleClose={() => setShowStoryReports(false)}
                width="md"
                hideFooter={true}>
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
                            }} onClick={async () => {
                                  setShowStoryReports(false);
                                  setStoryReportType(report.type);
                                  setDoPrint(true);
                              }
                            }>
                                <ListItemIcon>
                                    <Icon>{report.icon}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={report.name + " " + (report.type === ReportType.PERSONAL_STORY ? person1?.FirstName : (ReportType.PERSONAL_STORY_2 === report.type ? person2?.FirstName : ""))} />
                            </ListItem>
                            )
                        }
                        })}
                    </List>
                </CardContent>
            </Card>
        </Modal> 

        <Modal title={`Grid Section Selector`}
                isOpen={showGridSelector}
                handleClose={() => setShowGridSelector(false)}
                width="md"
                hideFooter={true}>
            <Grid container spacing={1}>
            {steps?.map((step: any, index: number) => {
              return (
                <>
                  {isDreamInterview ?
                    <Grid key={index} item xs={3}>
                      <InterviewGridStep key={index}
                                         step={step}
                                         index={index}
                                         showChildrenOnly={wizard?.steps?.length === 1}
                                         isNestedStep={false}
                                         onSelectStep={() => {}}
                                         onSelectSubStep={() => {}}
                                         onSelectStepAndSubStep={() => {}}
                                         selector={true}
                                         selectSection={selectSection}
                                         selectorDream={isDreamInterview}/>
                    </Grid>
                    :
                    <InterviewGridStep key={index}
                                       step={step}
                                       index={index}
                                       showChildrenOnly={wizard?.steps?.length === 1}
                                       isNestedStep={false}
                                       onSelectStep={() => {}}
                                       onSelectSubStep={() => {}}
                                       onSelectStepAndSubStep={() => {}}
                                       selector={true}
                                       selectSection={selectSection}
                                       selectorDream={isDreamInterview}/>
                  }
                </>
              )
            })}
            </Grid>
            <DialogActions>
                <Button
                    type="button"
                    text={`Print`}
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={async () => setDoPrint(true)}
                />
            </DialogActions>
      </Modal>
    </>

  )
}

export default InterviewReportFilter;

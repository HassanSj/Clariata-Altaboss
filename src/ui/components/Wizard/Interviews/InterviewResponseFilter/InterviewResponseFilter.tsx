import styles from "./InterviewResponseFilter.module.scss";
import {useStoreActions, useStoreState} from "~/store/hooks";
import React from "react";
import { Card, CardContent, DialogActions, FormControl, Grid, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, Tooltip} from "@material-ui/core";
import {WizardType} from "~/ui/constants/wizard";
import Button from "~/ui/components/Button";
import {Button as MuiButton} from "@material-ui/core";
import { ReportDefinition, ReportType, ReportTypes } from "~/ui/constants/reports";
import ReportViewer from "~/ui/components/Reports/ReportViewer";
import Modal from "~/ui/components/Dialogs/Modal";
import { InterviewGridStep } from "../InterviewGrid/InterviewGrid";
import useReports from '~/ui/hooks/useReports';
import useWizard from "~/ui/hooks/useWizard";

interface IProps {
  dreamInterview: boolean;
  applyFilter: (sections: number[], clarifying: boolean) => any;
  onNextSubStep: () => unknown;
}

const InterviewResponseFilter = ({ dreamInterview, applyFilter, onNextSubStep }: IProps) => {

  const [report,setReport] = React.useState(dreamInterview ? ReportTypes[ReportType.DREAM_INTERVIEW] : ReportTypes[ReportType.DISCOVER_INTERVIEW]);

  const { onToggleFilter } = useStoreActions(actions => actions.wizard);

  const [props,setProps] = React.useState<any>();
  const [params,setParams] = React.useState<any>();
  const [downloadUrl,setDownloadUrl] = React.useState<string>();

  const [showReport,setShowReport] =React.useState(false);
  
  const {downloadFilteredInterviewReport} = useReports();


  const {wizard} = useStoreState((state) => state.wizard);
  const {dreamInterviewId, discoverInterviewId} = useStoreState(state => state.interview);

  const [Sections, setSections] = React.useState<number[]>([]);

  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);
  const [steps, setSteps] = React.useState(Object.assign([], wizard?.steps));

  const [reportType, setReportType] = React.useState<Number>(0);
  const [questionType, setQuestionType] = React.useState<Number>(0);

  const [showStoryReports,setShowStoryReports] = React.useState(false);
  const [showGridSelector,setShowGridSelector] = React.useState(false);

  const [clarifying, setClarifying] = React.useState(true);

  const { selectedHousehold } = useStoreState((state) => state.household);
  const { persons } = useStoreState((state) => state.person);

  const person1 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson1ID);
  const person2 = persons.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson2ID);


  const printReport = async () => {
      const r = await downloadFilteredInterviewReport(isDreamInterview ? dreamInterviewId : discoverInterviewId, true, clarifying, false, false, false, false, Sections, wizard?.selectedReport);
      setProps(r?.props);
      setParams(r?.params);
      setDownloadUrl(r?.url);
      setShowReport(true);
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

  const dropdownReportTypes: string[] = 
    [
      'All',
      'Grid Sections',
      'Story Reports',
    ];


  const dropdownQuestionTypes: string[] = 
    [
      'Main',
      'Main and Clarifying',
    ];


  const toggleFilter = async () => {
    if(questionType === 1) setClarifying(false);
    else setClarifying(true);
    if(wizard?.filtered){
      await onToggleFilter({});
      // onNextSubStep();
    } 
    else {
      switch (reportType) {
        case 0:
          setSections([]);
          await onToggleFilter({hideClarifying: clarifying});
          // onNextSubStep();
          break;
        case 1:
          setSections([]);
          setShowGridSelector(true);
          break;
        case 2:
          setSections([]);
          setShowStoryReports(true);
          break;
        default:
          break;
      }
    }
  }

  return (
    <>
      <div className={styles.filter_section} >
        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={3}>
              <FormControl variant="outlined">
              {/* <InputLabel id="filterReportType">Select Report Type</InputLabel> */}
              <Select 
                  value = {reportType}
                  // labelId = "filterReportType"
                  label = "Select Report Type"
                  onChange={event => {
                      setReportType(event.target.value as number);
                      // setViewReportTypeText(dropdownReportTypes[event.target.value as number]);
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
          
          <Grid item xs={3}>
              <FormControl variant="outlined">
              {/* <InputLabel id="filterQuestionTypes">Select Question Type</InputLabel> */}
              <Select 
                  value = {questionType}
                  // labelId = "filterQuestionTypes"
                  label = "Select Question Type"
                  onChange={event => {
                      setQuestionType(event.target.value as number);
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
                  {dropdownQuestionTypes.map((text, index) => {
                  return <MenuItem key={index} value={index}>{text}</MenuItem>
                  })}
                  

              </Select>

              </FormControl>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Enable/Disable Response Filters">
              <IconButton style={{color: wizard?.filtered ? '#C9E6E9' : '#737373'}} 
              className={styles.filter}
                          onClick={async () => {
                              await toggleFilter();
                          }}>
                  <Icon>filter_alt</Icon>
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item xs={3}>
            <MuiButton className={styles.wizard_header_menu_button}
                    color="secondary"
                    variant="contained"
                    onClick={async () => await printReport()}>
              Run Report
            </MuiButton>
            
          </Grid>
        </Grid>
      </div>
                
      <Modal title="" isOpen={showReport} handleClose={() => setShowReport(false)}>
        <ReportViewer definition={report}
            props={props}
            isOpen={showReport}
            onClose={() => setShowReport(false)}
            onDownload={() => window.open(downloadUrl)} />
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
                                  await onToggleFilter({
                                    reportType: report.type,
                                    hideClarifying: clarifying
                                  });
                                  // onNextSubStep();
                                  setShowStoryReports(false);
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
                    text={`Done`}
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={async () => {
                      await onToggleFilter({
                        sections: Sections,
                        hideClarifying: clarifying
                      });
                      // onNextSubStep();
                      setShowGridSelector(false)
                    }}
                />
            </DialogActions>
      </Modal>
    </>

  )
}

export default InterviewResponseFilter;

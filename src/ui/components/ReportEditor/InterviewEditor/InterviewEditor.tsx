import React, {ReactElement} from 'react';
import Modal from "~/ui/components/Dialogs/Modal";
import {DialogActions, Button as MuiButton, FormControlLabel, Checkbox, Grid, Card, CardContent, Icon, Chip, Box, Button, ButtonGroup, Typography} from "@material-ui/core";
import useReports from '~/ui/hooks/useReports';
import { useStoreState } from '~/store/hooks';
import { WizardType } from '~/ui/constants/wizard';
import { WizardState, WizardStep } from '~/types/wizard/wizard';
import { getInterviewWizardFull, toDiscoverWizard } from '~/services/interview';
import useMountEvents from '~/ui/hooks/useMountEvents';
import { InterviewQuestionsReportContent } from '../../Reports/InterviewQuestionsReport/InterviewQuestionsReport';
import StoryOfUsStyles from "~/ui/components/Reports/storyofus";
import ReportViewer from '../../Reports/ReportViewer';
import { ReportType, ReportTypes } from '~/ui/constants/reports';
import { InterviewGridStep } from '../../Wizard/Interviews/InterviewGrid/InterviewGrid';
import useNotifications from '~/ui/hooks/useNotifications';
import InterviewReport from '../../Reports/InterviewQuestionsReport';

interface IProps {
  isOpen: boolean;
  onClose: () => unknown;
}


const InterviewEditor = ({ isOpen, onClose }: IProps): ReactElement => {
 
  const { dreamInterviewId, discoverInterviewId, selectedInterview } = useStoreState(state => state.interview);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const {downloadFilteredInterviewReport} = useReports();

  const notifications = useNotifications();

  // const {persons} = 

  const [wizard,setWizard] = React.useState<WizardState>();
  const [wizardType,setWizardType] = React.useState<WizardType>(WizardType.DISCOVER_INTERVIEW);
  const [props,setProps] = React.useState<any>();
  const [params,setParams] = React.useState<any>();
  const [downloadUrl,setDownloadUrl] = React.useState<string>();
  const [selectedSteps,setSelectedSteps] = React.useState<number[]>([]);
  const [steps,setSteps] = React.useState<WizardStep[]>();

  const isDreamInterview = (wizardType === WizardType.DREAM_INTERVIEW);

  const [showReport,setShowReport] = React.useState(false);

  const [report,setReport] = React.useState(isDreamInterview ? ReportTypes[ReportType.DREAM_INTERVIEW] : ReportTypes[ReportType.DISCOVER_INTERVIEW]);


  const handleView = async () => {
    const interviewReport = await downloadFilteredInterviewReport(isDreamInterview ? dreamInterviewId : discoverInterviewId, showResponses, hideClarifying, undefined, undefined, undefined, undefined, selectedSteps);
    setProps(interviewReport?.props);
    setParams(interviewReport?.params);
    setDownloadUrl(interviewReport?.url);
    setShowReport(true);
  };

  const handleClose = () => {
    onClose();
  }

  
  const selectSection = (Id?: number) => {
    let sections = selectedSteps;
    if(Id) {
      if(sections?.indexOf(Id) > -1) {
        sections?.filter(s => s != Id);
      } else {
        sections.push(Id);
      }
      setSelectedSteps(selectedSteps);
    }
  }

  const [showResponses,setShowResponses] = React.useState(false);
  const [hideClarifying,setHideClarifying] = React.useState(false);
  // const [responsesCheckBox,setResponsesCheckBox] = React.useState(false);

  const checkShowResponses = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowResponses(event.target.checked);
  };

  const checkHideClarifying = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHideClarifying(event.target.checked);
  };

  const modalHeader = () => { 
    return (
      <div style={{
        textAlign: 'center'
      }}> 
        <h3>Interview Report Editor</h3>
      </div>
    )
  }

  const populateData = async () => {
    notifications.toggleLoading(true);
    const w = await getInterviewWizardFull(selectedHousehold?.HouseholdID, wizardType === WizardType.DREAM_INTERVIEW ? dreamInterviewId : discoverInterviewId);
    setWizard(w);
    setSteps([]);
    setSteps(w?.steps);
    setSelectedSteps([]);
    notifications.toggleLoading(false);
  }

  // Color of the button
  const color = (type: WizardType) => type === wizardType ? 'primary' : 'default'

  useMountEvents({
    onMounted: async () => {
      await populateData();
    },
    onChange: async () => {
      await populateData();
    },
    watchItems: [wizardType]
  });


  return (
    <>
      <Modal title={modalHeader()} isOpen={isOpen} handleClose={handleClose} width="md" hideFooter={true}>
        <Grid container>
          <Grid item xs={5}/>
          <Grid item xs={2}>
              <ButtonGroup color="primary" variant="contained">
                  <Button color={color(WizardType.DISCOVER_INTERVIEW)}
                          onClick={() => setWizardType(WizardType.DISCOVER_INTERVIEW)}>Discover</Button>
                  <Button color={color(WizardType.DREAM_INTERVIEW)}
                          onClick={() => setWizardType(WizardType.DREAM_INTERVIEW)}>Dream</Button>
              </ButtonGroup>
          </Grid>
          <Grid item xs={5}/>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={2} />
          <Grid item xs={3}>
              <FormControlLabel
                  label="Show Responses"
                  control={
                      <Checkbox
                          checked={showResponses}
                          onChange={checkShowResponses}
                      />
                  }
              />
          </Grid>
          <Grid item xs={3}>
              <FormControlLabel
                  label="Hide Clarifying"
                  control={
                      <Checkbox
                          checked={hideClarifying}
                          onChange={checkHideClarifying}
                      />
                  }
              />
          </Grid>
          <Grid item xs={2} />
        </Grid>
        <Typography variant="caption" gutterBottom>
          Select the grid sections that you want to be included on the report
        </Typography>
        <br/>
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
        <ReportViewer definition={report}
                      props={props}
                      isOpen={showReport}
                      onClose={() => setShowReport(false)}
                      onDownload={() => window.open(downloadUrl)} />
        <DialogActions>
          
            <MuiButton onClick={handleView}
                        size="large"
                        variant="contained"
                        color="primary">
                          View Report
            </MuiButton>
          
        </DialogActions>
          
      </Modal>
    </>
  );
};

export default InterviewEditor;

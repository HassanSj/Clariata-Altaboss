import React, {ReactElement} from 'react';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Modal from "~/ui/components/Dialogs/Modal";
import {DialogActions, Button as MuiButton, FormControlLabel, Checkbox, Grid, List, ListItem, Snackbar} from "@material-ui/core";
import { useStoreActions, useStoreState} from "~/store/hooks";
import { ReportType, ReportTypes } from '~/ui/constants/reports';
import useReports from '~/ui/hooks/useReports';
import { IObjectiveDataType } from '~/types/objective/store';
import { MAX_OBJECTIVES } from '~/ui/constants/objectives';
import { Alert } from '@material-ui/lab';
import SelectDate from "~/ui/components/Forms/SelectDate";
import {addMonths} from "~/ui/constants/utils";
import {formatDate} from "@telerik/kendo-intl";
import moment from "moment";
import GuideBook, { GuideBookProps } from '../../GuideBook/GuideBook';
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
  isOpen: boolean;
  onClose: () => unknown;
}

export const MaxGuideBookReports = 17;

export enum GuideBookReports {
  LEGACY_OF_FIVE = ReportType.LEGACY_OF_FIVE,
  PERSONAL_STORY = ReportType.PERSONAL_STORY,
  STORY_OF_US = ReportType.STORY_OF_US,
  FAMILY_STORY = ReportType.FAMILY_STORY,
  OUR_ENTERPRISE = ReportType.OUR_ENTERPRISE,
  ANCESTRAL_TIMELINE = ReportType.ANCESTRAL_TIMELINE,
  FAMILY_TREE = ReportType.FAMILY_TREE,
  VMV = ReportType.VMV,
  PRIORITY_GRID = ReportType.PRIORITY_GRID,
  WHY = ReportType.WHY,
  LIFE_GRAPH = ReportType.LIFE_GRAPH,
  PRIORITY_RANKING = ReportType.PRIORITY_RANKING,
  CURATION_SUMMARY = ReportType.CURATION_SUMMARY,
  ACTION_PLAN_SUMMARY_QUARTER = ReportType.ACTION_PLAN_SUMMARY_QUARTER,
  GANTT_CHART = ReportType.GANTT_CHART
}

/**
 * Main component
 * @param isOpen
 * @param onClose
 * @constructor
 */
const GuideBookEditor = ({isOpen, onClose }: IProps): ReactElement => {

  const { selectedHousehold } = useStoreState((state) => state.household);
  const { persons } = useStoreState((state) => state.person);
  const { objectives, selectedObjectiveIds } = useStoreState((state) => state.objective);
  const { onSelect } = useStoreActions(actions => actions.objective);

  const [coverPageChecked, setCoverPageChecked] = React.useState<boolean>(false);
  const [tocChecked, setTocChecked] = React.useState<boolean>(false);
  const [introductionChecked, setIntroductionChecked] = React.useState<boolean>(false);  
  const [atAGlanceCoverChecked, setAtAGlanceCoverChecked] = React.useState<boolean>(false);
  const [atAGlanceChecked, setAtAGlanceChecked] = React.useState<boolean>(false);  
  const [finalThoughtsCoverChecked, setFinalThoughtsCoverChecked] = React.useState<boolean>(false);
  const [finalThoughtsChecked, setFinalThoughtsChecked] = React.useState<boolean>(false);
  
  const [discoverCoverChecked, setDiscoverCoverChecked] = React.useState<boolean>(false);
  const [discoverIntroChecked, setDiscoverIntroChecked] = React.useState<boolean>(false);
  const [vmvChecked, setVmvChecked] = React.useState<boolean>(false);
  const [storyOfUsChecked, setStoryOfUsChecked] = React.useState<boolean>(false);
  const [person1Checked, setPerson1Checked] = React.useState<boolean>(false);
  const [person2Checked, setPerson2Checked] = React.useState<boolean>(false);  
  const [familyStoryChecked, setFamilyStoryChecked] = React.useState<boolean>(false);
  const [enterpriseChecked, setEnterpriseChecked] = React.useState<boolean>(false);
  const [timelineChecked, setTimelineChecked] = React.useState<boolean>(false);
  const [treeChecked, setTreeChecked] = React.useState<boolean>(false);  
  const [legacyOfFiveChecked, setLegacyOfFiveChecked] = React.useState<boolean>(false);

  const [dreamCoverChecked, setDreamCoverChecked] = React.useState<boolean>(false);
  const [dreamIntroChecked, setDreamIntroChecked] = React.useState<boolean>(false);
  const [priorityGridChecked, setPriorityGridChecked] = React.useState<boolean>(false);
  const [whyChecked, setWhyChecked] = React.useState<boolean>(false);
  const [dimensionChecked, setDimensionChecked] = React.useState<boolean>(false);
  const [metricChecked, setMetricChecked] = React.useState<boolean>(false);

  const [directionCoverChecked, setDirectionCoverChecked] = React.useState<boolean>(false);
  const [directionIntroChecked, setDirectionIntroChecked] = React.useState<boolean>(false);
  const [priorityRankingChecked, setPriorityRankingChecked] = React.useState<boolean>(false);
  const [curationSummaryChecked, setCurationSummaryChecked] = React.useState<boolean>(false);
  const [actionPlanChecked, setActionPlanChecked] = React.useState<boolean>(false);
  const [ganttChecked, setGanttChecked] = React.useState<boolean>(false);

  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(addMonths((new Date()), 3)!);
  const [guideBookData, setGuideBookData] = React.useState<GuideBookProps>();
  // const {dreamInterviewId, discoverInterviewId} = useStoreState(state => state.interview);
  const { discoverInterviewId, dreamInterviewId } = useStoreState(state => state.selected);

  // Report Filters
  const [allReportsSelected, setAllReportsSelected] = React.useState<boolean>(false);

  const {downloadPdfGuideBook, getGuidebookData} = useReports();
  const notifications = useNotifications();

  const handleDownload = async () => {
    
    notifications.toggleLoading(true);
    const data = await getGuidebookData(selectedHousehold.HouseholdID, discoverInterviewId, dreamInterviewId, coverPageChecked, tocChecked, introductionChecked, 
      atAGlanceCoverChecked, atAGlanceChecked, discoverCoverChecked, discoverIntroChecked, vmvChecked, storyOfUsChecked, person1Checked, person2Checked, familyStoryChecked, enterpriseChecked,
      timelineChecked, treeChecked, legacyOfFiveChecked, dreamCoverChecked, dreamIntroChecked, priorityGridChecked, whyChecked, dimensionChecked, metricChecked, directionCoverChecked, directionIntroChecked, 
      priorityRankingChecked, curationSummaryChecked, actionPlanChecked, ganttChecked, finalThoughtsCoverChecked, finalThoughtsChecked, moment(startDate).format("YYYY-MM-DD"),  moment(endDate).format("YYYY-MM-DD"));

    
    setGuideBookData(data);

    setCurrentPage(3);
    notifications.toggleLoading(false);
    // downloadPdfGuideBook(legacyOfFiveChecked, person1Checked , person2Checked, storyOfUsChecked, familyStoryChecked, enterpriseChecked, timelineChecked, treeChecked, vmvChecked, 
    //   priorityGridChecked, whyChecked, dimensionChecked, metricChecked, priorityRankingChecked, curationSummaryChecked, actionPlanChecked, ganttChecked, undefined, undefined, moment(startDate).format("YYYY-MM-DD"),  moment(endDate).format("YYYY-MM-DD"));
  };

  const [currentPage,setCurrentPage] = React.useState<number>(1);

  const [allSelected, setAllSelected] = React.useState<boolean>(false);

  const setAllSelectedIfSo = () => {
    if(legacyOfFiveChecked && person1Checked && person2Checked && storyOfUsChecked && familyStoryChecked && enterpriseChecked && timelineChecked && treeChecked && vmvChecked && 
       priorityGridChecked && whyChecked && dimensionChecked && metricChecked && priorityRankingChecked && curationSummaryChecked && actionPlanChecked && ganttChecked) setAllSelected(true);
    else setAllSelected(false);
  }

  const [ isMoreThan10, setIsMoreThan10 ] = React.useState(false);

  const handleErrorClose = () => {
    setIsMoreThan10(false);
  }

  const handleSelectObjective = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value)
    if ((event.target.checked && canSelect()) || !event.target.checked) {
      const adjusted = { ...selectedObjectiveIds, [event.target.value]: event.target.checked };
      onSelect({
        type: IObjectiveDataType.OBJECTIVE_IDS,
        objectiveIds: adjusted,
        objectiveId: event.target.value,
        selected: event.target.checked
      });
    } else {
      event.stopPropagation();
      setIsMoreThan10(true);
    }
  };

  const canSelect = () => {
    const count = getSelectedCount();
    return count < MAX_OBJECTIVES;
  }

  const getSelectedCount = () => {
    let count = 0;
    if (selectedObjectiveIds) {
      for (const [key, value] of Object.entries(selectedObjectiveIds)) {
        if (value) {
          count++;
        }
      }
    }
    return count;
  }

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    setCoverPageChecked(checked);
    setTocChecked(checked);
    setIntroductionChecked(checked);
    setAtAGlanceCoverChecked(checked);
    setAtAGlanceChecked(checked);
    setFinalThoughtsCoverChecked(checked);
    setFinalThoughtsChecked(checked);
    setDiscoverCoverChecked(checked);
    setDiscoverIntroChecked(checked); 
    setVmvChecked(checked);   
    setStoryOfUsChecked(checked);
    setPerson1Checked(checked);
    setPerson2Checked(checked);
    setFamilyStoryChecked(checked);
    setEnterpriseChecked(checked);
    setTimelineChecked(checked);
    setTreeChecked(checked);
    setLegacyOfFiveChecked(checked);
    setDreamCoverChecked(checked);
    setDreamIntroChecked(checked);
    setPriorityGridChecked(checked);
    setWhyChecked(checked);
    setDimensionChecked(checked);
    setMetricChecked(checked);
    setDirectionCoverChecked(checked);
    setDirectionIntroChecked(checked);
    setPriorityRankingChecked(checked);
    setCurationSummaryChecked(checked);
    setActionPlanChecked(checked);
    setGanttChecked(checked);
    setFinalThoughtsChecked(checked);
    setFinalThoughtsCoverChecked(checked);
  }

  const handleSelectReportsAll = (checked: boolean) => {
    setAllReportsSelected(checked);

  }

  const modalHeader = () => { 
    return (
      <div style={{
        textAlign: 'center'
      }}> 
        <h3>Guidebook</h3>
        {currentPage == 1 ? <span style={{fontSize: "18px", fontWeight: "600"}}>Select the reports that should be included</span> : null }
        {currentPage == 2 ? <span style={{fontSize: "18px", fontWeight: "600"}}>Select the top 10 priorities</span> : null }
      </div>
    )
  }

  const getPersonalStoryTitle = (personId: number | undefined) => {
    const name = persons.find(p => p.PersonID === personId)?.FirstName;
    return `${name}'s Personal Story`;
  }

  return (
    <>
    <Grid>
        <FormWrapper modelName="GuideBookEditor">
        <DialogActions>
            {currentPage > 1 ?
              <MuiButton onClick={() => setCurrentPage(currentPage - 1)}
                        size="large"
                        variant="contained">
                            Back
              </MuiButton>
            : null }
            {currentPage < 2 ? 
              <MuiButton onClick={() => setCurrentPage(currentPage + 1)}
                        size="large"
                        variant="contained">
                            Next
              </MuiButton>
            : null }
            {currentPage == 2 ?
              <MuiButton onClick={handleDownload}
                          size="large"
                          variant="contained"
                          color="primary">
                            Create Report
              </MuiButton>
            : null }
            
          </DialogActions>
          <div>
            {currentPage === 1 ? 
            <>
              <Grid container spacing={1} xs={12} style={{marginBottom: '30px'}}>
                <span style={{fontSize: "18px", fontWeight: "600"}}>Select the reports that should be included</span>
              </Grid>
              <Grid container spacing={1} xs={12}>
                {currentPage === 1 &&
                <>
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
                </>
              }
              </Grid>
              <Grid container spacing={1} xs={12} style={{marginBottom: '30px'}}>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={allSelected}
                                                        onChange={() => handleSelectAll(!allSelected)} />} 
                                    label="All Reports" />
                </Grid>
              </Grid>
              <Grid container spacing={1} xs={12} style={{marginBottom: '30px'}}>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={coverPageChecked}
                                                        onChange={() => setCoverPageChecked(!coverPageChecked)} />} 
                                    label="Guidebook Cover Page" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={tocChecked}
                                                        onChange={() => setTocChecked(!tocChecked)} />} 
                                    label="Table of Contents" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={introductionChecked}
                                                        onChange={() => setIntroductionChecked(!introductionChecked)} />} 
                                    label="Introduction" />
                </Grid>
                {/* <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={howToUseChecked}
                                                        onChange={() => setHowToUseChecked(!howToUseChecked)} />} 
                                    label="How to use the Guidebook" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={implementationChecked}
                                                        onChange={() => setImplementationChecked(!implementationChecked)} />} 
                                    label="Implementation Steps" />
                </Grid> */}
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={atAGlanceCoverChecked}
                                                        onChange={() => setAtAGlanceCoverChecked(!atAGlanceCoverChecked)} />} 
                                    label="At A Glance Cover Page" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={atAGlanceChecked}
                                                        onChange={() => setAtAGlanceChecked(!atAGlanceChecked)} />} 
                                    label="At A Glance" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={finalThoughtsCoverChecked}
                                                        onChange={() => setFinalThoughtsCoverChecked(!finalThoughtsCoverChecked)} />} 
                                    label="Final Thoughts Cover Page" />
                </Grid>
                <Grid item container direction="column" xs={4} spacing={1}>
                  <FormControlLabel control={ <Checkbox checked={finalThoughtsChecked}
                                                        onChange={() => setFinalThoughtsChecked(!finalThoughtsChecked)} />} 
                                    label="Final Thoughts" />
                </Grid>
              </Grid>
              <Grid container xs={12}>
                <Grid item xs={4}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{fontSize: "18px", fontWeight: "600"}}>Discover</div>
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={discoverCoverChecked}
                                                        onChange={() => setDiscoverCoverChecked(!discoverCoverChecked)} />} 
                                    label="Discover Cover Page" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={discoverIntroChecked}
                                                        onChange={() => setDiscoverIntroChecked(!discoverIntroChecked)}/>} 
                                    label="Discover Introduction" />
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={vmvChecked}
                                                        onChange={() => {
                                                          setVmvChecked(!vmvChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.VMV]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={storyOfUsChecked}
                                                        onChange={() => {
                                                          setStoryOfUsChecked(!storyOfUsChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.STORY_OF_US]?.name} />
                    </Grid>
                    {selectedHousehold?.PrimaryPerson1ID && persons.some(p => p.PersonID === selectedHousehold?.PrimaryPerson1ID) ? 
                    <Grid item xs={12}>                      
                      <FormControlLabel control={ <Checkbox checked={person1Checked} 
                                                        onChange={() => {
                                                          setPerson1Checked(!person1Checked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={getPersonalStoryTitle(selectedHousehold?.PrimaryPerson1ID)} /> 
                    </Grid>
                    : null }
                    {selectedHousehold?.PrimaryPerson2ID && persons.some(p => p.PersonID === selectedHousehold?.PrimaryPerson2ID) ? 
                    <Grid item xs={12}>                    
                      <FormControlLabel control={ <Checkbox checked={person2Checked}
                                                        onChange={() => {
                                                          setPerson2Checked(!person2Checked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={getPersonalStoryTitle(selectedHousehold?.PrimaryPerson2ID)} /> 
                    </Grid>
                    : null }
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={familyStoryChecked}
                                                        onChange={() => {
                                                          setFamilyStoryChecked(!familyStoryChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.FAMILY_STORY]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={enterpriseChecked}
                                                        onChange={() => {
                                                          setEnterpriseChecked(!enterpriseChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.OUR_ENTERPRISE]?.name} />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={timelineChecked}
                                                        onChange={() => {
                                                          setTimelineChecked(!timelineChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.ANCESTRAL_TIMELINE]?.name} />
                    </Grid> */}
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={treeChecked}
                                                        onChange={() => {
                                                          setTreeChecked(!treeChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.FAMILY_TREE]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={legacyOfFiveChecked}
                                                        onChange={() => {
                                                          setLegacyOfFiveChecked(!legacyOfFiveChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.LEGACY_OF_FIVE]?.name} />
                    </Grid>
                  </Grid>                  
                  
                </Grid>
                <Grid item spacing={1} xs={4}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{fontSize: "18px", fontWeight: "600"}}>Dream</div>
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={dreamCoverChecked}
                                                        onChange={() => setDreamCoverChecked(!dreamCoverChecked)} />} 
                                    label="Dream Cover Page" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={dreamIntroChecked}
                                                        onChange={() => setDreamIntroChecked(!dreamIntroChecked)} />} 
                                    label="Dream Introduction" />
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={priorityGridChecked}
                                                        onChange={() => {
                                                          setPriorityGridChecked(!priorityGridChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.PRIORITY_GRID]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={whyChecked}
                                                        onChange={() => {
                                                          setWhyChecked(!whyChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.WHY]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControlLabel control={ <Checkbox checked={dimensionChecked}
                                                        onChange={() => {
                                                          setDimensionChecked(!dimensionChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label="Dimensions of Life Lifegraph" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={metricChecked}
                                                          onChange={() => {
                                                            setMetricChecked(!metricChecked);
                                                            // setallselectedifso();
                                                          }} />} 
                                      label="Metrics of Success Lifegraph" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item spacing={1} xs={4}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{fontSize: "18px", fontWeight: "600"}}>Direction</div>
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={directionCoverChecked}
                                                        onChange={() => setDirectionCoverChecked(!directionCoverChecked)} />} 
                                    label="Direction Cover Page" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={directionIntroChecked}
                                                        onChange={() => setDirectionIntroChecked(!directionIntroChecked)} />} 
                                    label="Direction Introduction" />
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={priorityRankingChecked}
                                                        onChange={() => {
                                                          setPriorityRankingChecked(!priorityRankingChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.PRIORITY_RANKING]?.name} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={curationSummaryChecked}
                                                        onChange={() => {
                                                          setCurationSummaryChecked(!curationSummaryChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.CURATION_SUMMARY]?.name} /> 
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={actionPlanChecked}
                                                        onChange={() => {
                                                          setActionPlanChecked(!actionPlanChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.ACTION_PLAN_SUMMARY_QUARTER]?.name} />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <FormControlLabel control={ <Checkbox checked={ganttChecked}
                                                        onChange={() => {
                                                          setGanttChecked(!ganttChecked);
                                                          // setallselectedifso();
                                                        }} />} 
                                    label={ReportTypes[ReportType.GANTT_CHART]?.name} />
                    </Grid> */}
                  </Grid>
                </Grid>                
              </Grid>
            </>

            : null }

            {currentPage === 2 ? 
            <>
              <Grid container spacing={1} xs={12}>
                <div>
                {objectives.map(o => {
                  return (
                    <div>
                      <FormControlLabel control={ <Checkbox value={o?.ObjectiveID} checked={selectedObjectiveIds && selectedObjectiveIds[o?.ObjectiveID] ? true : false}
                                                            onChange={handleSelectObjective} 
                                                />} 
                                        label={o?.Description} />
                    </div>
                  )
                })}
                </div>
              </Grid> 
            </>

            : null }
              
            

            {currentPage === 3 ?
              <>
              {/* <Grid container lg={10} style={{marginBottom: '30px'}}> */}
                <GuideBook
                  household={guideBookData?.household} 
                  family={guideBookData?.family}
                  persons={guideBookData?.persons} 
                  owner={guideBookData?.owner}
                  storyOfUsData={guideBookData?.storyOfUsData}
                  storyOfUsQuestionsAndResponses={guideBookData?.storyOfUsQuestionsAndResponses}
                  familyStoryData={guideBookData?.familyStoryData}
                  enterprise={guideBookData?.enterprise}
                  enterpriseData={guideBookData?.enterpriseData}
                  treeData={guideBookData?.treeData}
                  vmvResponses={guideBookData?.vmvResponses}
                  timelineData={guideBookData?.timelineData}
                  objectives={guideBookData?.objectives}
                  selectedObjectives={guideBookData?.selectedObjectives}
                  dimensions={guideBookData?.dimensions}
                  metrics={guideBookData?.metrics}
                  dimensionsGraph={guideBookData?.dimensionsGraph}
                  metricsGraph={guideBookData?.metricsGraph}
                  curationPriorities={guideBookData?.curationPriorities}
                  curationPriorityPages={guideBookData?.curationPriorityPages}
                  year={guideBookData?.year}
                  quarters={guideBookData?.quarters}
                  spouse1={guideBookData?.spouse1}
                  spouse2={guideBookData?.spouse2}
                  personalStoryDataSpouse1={guideBookData?.personalStoryDataSpouse1}
                  personalStoryDataSpouse2={guideBookData?.personalStoryDataSpouse2}                                  
                  coverPage={guideBookData?.coverPage}
                  toc={guideBookData?.toc}
                  introduction={guideBookData?.introduction}
                  atAGlanceCover={guideBookData?.atAGlanceCover}
                  atAGlance={guideBookData?.atAGlance}
                  
                  discoverCover={guideBookData?.discoverCover}
                  discoverIntro={guideBookData?.discoverIntro}
                  vmv={guideBookData?.vmv}
                  familyStory={guideBookData?.familyStory}
                  person1={guideBookData?.person1}
                  person2={guideBookData?.person2}
                  storyofus={guideBookData?.storyofus}
                  enterpriseReport={guideBookData?.enterpriseReport}
                  timeline={guideBookData?.timeline}
                  familyTree={guideBookData?.familyTree}
                  legacyOfFive={guideBookData?.legacyOfFive}

                  dreamCover={guideBookData?.dreamCover}
                  dreamIntro={guideBookData?.dreamIntro}  
                  priorityGrid={guideBookData?.priorityGrid}  
                  why={guideBookData?.why}          
                  dimension={guideBookData?.dimension}
                  metric={guideBookData?.metric}                 
                  
                  directionCover= {guideBookData?.directionCover}
                  directionIntro = {guideBookData?.directionCover} 
                  priorityRanking = {guideBookData?.priorityRanking}                      
                  curationSummary={guideBookData?.curationSummary}
                  actionPlan={guideBookData?.actionPlan} 
                  gantt={guideBookData?.gantt}
                  finalCover = {guideBookData?.finalCover}                  
                  finalIntro = {guideBookData?.finalIntro}
                   
                  actionPlanEndDate={guideBookData?.actionPlanEndDate}
                  actionPlanStartDate={guideBookData?.actionPlanStartDate}      
                />
                {/* </Grid> */}
              </>
              : null }
          </div>
          <DialogActions>
            {currentPage > 1 ?
              <MuiButton onClick={() => setCurrentPage(currentPage - 1)}
                        size="large"
                        variant="contained">
                            Back
              </MuiButton>
            : null }
            {currentPage < 2 ? 
              <MuiButton onClick={() => setCurrentPage(currentPage + 1)}
                        size="large"
                        variant="contained">
                            Next
              </MuiButton>
            : null }
            {currentPage == 2 ?
              <MuiButton onClick={handleDownload}
                          size="large"
                          variant="contained"
                          color="primary">
                            Create Report
              </MuiButton>
            : null }
            
          </DialogActions>
          <Snackbar open={isMoreThan10} autoHideDuration={1000} onClose={handleErrorClose}>
            <Alert severity="error" onClose={handleErrorClose}>
              A maximum of {MAX_OBJECTIVES} can be selected.
            </Alert>
          </Snackbar>
        </FormWrapper>
      </Grid>
    </>
  );
};

export default GuideBookEditor;

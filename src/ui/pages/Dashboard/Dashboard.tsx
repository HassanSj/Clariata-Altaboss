import React, { useEffect } from 'react';
import {Grid,} from '@material-ui/core';
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import {NavigationTab} from "~/ui/constants/navigations";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {InterviewType} from "~/ui/constants/interview";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "../../components/Widgets/Widgets.module.scss";
import paths from "~/ui/constants/paths";
import ObjectiveWidget from "~/ui/components/Widgets/ObjectiveWidget";
import InterviewWidget from "~/ui/components/Widgets/InterviewWidget";
import DirectionWidget from "~/ui/components/Widgets/DirectionWidget";
import DeepenWidget from "~/ui/components/Widgets/DeepenWidget";
import DestinyWidget from "~/ui/components/Widgets/DestinyWidget";
import LinksWidget from "~/ui/components/Widgets/LinksWidget";
import { ApiRequestType, OwnerModelType, OwnerType } from '~/ui/constants/api';
import api from '~/services/api';
import { Photo } from '~/types/api/photo';
import { OwnerParams } from '~/types/relations';
import { convertImgToBase64URL } from '~/ui/constants/utils';
import useNotifications from '~/ui/hooks/useNotifications';
import { PhotoAlbum } from '~/types/api/photoAlbum';
import { ContactDataType, ContactDataTypes } from '~/ui/constants/contact';
import useEditable from '~/ui/hooks/useEditable';
import {processServerError} from "~/services/api/errors";
import { getDefaultFamilyPhotoSrc } from '~/ui/constants/user';
import household from '~/store/household';
import ProfileWidget from '~/ui/components/Widgets/ProfileWidget';
import VMVWidget from '~/ui/components/Widgets/VMVWidget';
import PriorityProgressWidget from '~/ui/components/Widgets/PriorityProgressWidget';
import NoToolsWidget from '~/ui/components/Widgets/NoToolsWidget';
import TopPriorityWidget from '~/ui/components/Widgets/TopPriorityWidget';
import LifeGraphWidget from '~/ui/components/Widgets/LifeGraphWidget';
import { ReportType } from '~/ui/constants/reports';
import useReports from "~/ui/hooks/useReports";
import ReportViewer from '~/ui/components/Reports/ReportViewer';
import TimelineEditor from '~/ui/components/ReportEditor/TimelineEditor';
import Modal from '~/ui/components/Dialogs/Modal';
import PriorityGridReport from '~/ui/components/Reports/PriorityGridReport';
import { getPriorityGridReportProps } from '~/ui/components/Reports/PriorityGridReport/PriorityGridReport';
import GanttChart from '~/ui/components/Reports/GanttChartReport/GanttChart';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { getAccessToken } from '~/services/auth';
import { Household } from '~/types/api/household';
import { Objective } from '~/types/api/objective';
import useHousehold from '~/ui/hooks/useHousehold';
import useObjectives from '~/ui/hooks/useObjectives';
import usePersons from '~/ui/hooks/usePersons';
import ResourcesWidget from '~/ui/components/Widgets/ResourcesWidget';
import { useRouter } from 'next/router';
import TimelineWidget from '~/ui/components/Widgets/TimelineWidget';

const {DESTINY, PROFILE, DIRECTION_PRIORITIES, DEEPEN} = paths;

const Dashboard = () => {

  const router = useRouter();
  //const token = getAccessToken();
  const { householdId } = useStoreState((state) => state.selected);
  //const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;
  //const {data: selectedHousehold, isValidating} = useSWR<Household>([urlHousehold, token], fetcher);
  const { household: selectedHousehold } = useHousehold();
  //const { objectives } = useStoreState((state) => state.objective);
  const { dreamInterviewId, discoverInterviewId } = useStoreState((state) => state.selected);

  //const urlObjectives = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${dreamInterviewId}/objective/list`;
  //const {data: objectives} = useSWR<Objective[]>([urlObjectives, token], fetcher);
  const { objectives } = useObjectives(dreamInterviewId);
  
  //const { persons } = useStoreState((state) => state.person);
  const { persons } = usePersons();
  
  const {
    selectedReport,
    selectedReportProps,
    selectedReportParams,
    selectedReportPath,
    showReport,
    viewReport,
    hideReport,
    downloadPdfReport,
    downloadExcelReport
  } = useReports();

  const [showTimelineEditor,setShowTimelineEditor] = React.useState<boolean>(false);
  const [showReportModal,setShowReportModal] = React.useState<boolean>(false);
  const [reportTitle,setReportTitle] = React.useState<string>('');
  const [reportType,setReportType] = React.useState<ReportType | undefined>();

  const openPriorityGridModal = async (title: string, reportType: ReportType | undefined) => {
    setReportTitle(title)
    setReportType(reportType)
    setShowReportModal(true)
  }
  
  const closePriorityGridModal = () => {
    setReportTitle('')
    setShowReportModal(false);
    setReportType(undefined)
  }

  const openGanttModal = async (title: string, reportType: ReportType | undefined) => {
    setReportTitle(title)
    setReportType(reportType)
    setShowReportModal(true)
  }
  
  const closeGanttModal = () => {
    setReportTitle('')
    setShowReportModal(false);
    setReportType(undefined)
  }

  const goToTimeline = () => {
    router.push(paths.TIMELINE)
  }

  const goToCustomEvents = () => {
    router.push(paths.CUSTOM_TIMELINE_EVENTS)
  }

  if (!selectedHousehold) return <h1>Loading ....</h1>;


  return (
    <>
      <DashboardWrapper tab={NavigationTab.HOME}>

        <Grid container spacing={2}>
          <Grid item xs={2}/>
          {selectedHousehold?.PrimaryPerson1ID ? <Grid item xs={2} ><ProfileWidget personID={selectedHousehold.PrimaryPerson1ID}/></Grid> : null}
          <Grid item xs={2} ><InterviewWidget interviewType={InterviewType.DISCOVER} id={discoverInterviewId}/></Grid>
          <Grid item xs={2} ><InterviewWidget interviewType={InterviewType.DREAM} id={dreamInterviewId}/></Grid>
          <Grid item xs={2} ><DirectionWidget/></Grid>
          <Grid item xs={2} />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={2} />
          {selectedHousehold?.PrimaryPerson2ID ? <Grid item xs={2} ><ProfileWidget personID={selectedHousehold?.PrimaryPerson2ID}/></Grid> : null}
          <Grid item xs={2} ><DeepenWidget/></Grid>
          <Grid item xs={2} ><DestinyWidget/></Grid>
          <Grid item xs={2} ><ResourcesWidget/></Grid>
          <Grid item xs={4} />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={8}><VMVWidget/></Grid>        
          <Grid item xs={2} />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={2}><TopPriorityWidget/></Grid>
          <Grid item xs={4}><LifeGraphWidget/></Grid>
          <Grid item xs={2}>
            <Grid container direction="column" >
              {/* <PriorityProgressWidget/> */}
              <NoToolsWidget last={true} isFamily={true} title="Family Development" text="Coming Soon" link="" iconClass={styles.cl_icon_family}/>
            </Grid>
          </Grid>
          <Grid item xs={2} />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={2} />
          <Grid item xs={2}>
            {/* <NoToolsWidget title="Timeline" text="Timeline of your family history across generations  " link="" onClick={() => goToTimeline()} iconClass={styles.cl_icon_timeline}/> */}
            <TimelineWidget title="Timeline" text="Timeline of your family history across generations  " goToTimeline={goToTimeline} goToCustomEvents={goToCustomEvents} iconClass={styles.cl_icon_timeline}/>
          </Grid>
          <Grid item xs={2}>
            <NoToolsWidget title="Family Tree" text="Diagram showing the relationships between people in several generations of your family  " link="/tree" /*onClick={() => viewReport(ReportType.FAMILY_TREE)}*/ iconClass={styles.cl_icon_tree}/>
          </Grid>
          <Grid item xs={2}>
            <NoToolsWidget title="Client Stories" stories={true} text="Stories of our journey  " link="" iconClass={styles.cl_icon_stories}/>
          </Grid>
          {/* <Grid item xs={2}>
            <NoToolsWidget title="Celebration" text="A look at what has been accomplished  " link={DEEPEN} iconClass={styles.cl_icon_celebration}/>
          </Grid> */}
          <Grid item xs={2} />
        </Grid>
        { (selectedReport) ?
          <ReportViewer definition={selectedReport}
                        props={selectedReportProps}
                        isOpen={showReport}
                        onClose={() => hideReport()}
                        onDownload={() => downloadPdfReport(selectedReport.type)} />
        : null }
         <TimelineEditor isOpen={showTimelineEditor} onClose={() => setShowTimelineEditor(false)} />
         <Modal title={reportTitle} isOpen={showReportModal} handleClose={() => closePriorityGridModal()} width="lg" hideFooter={true}>
            {reportType == ReportType.PRIORITY_GRID ?
              <PriorityGridReport household={selectedHousehold} persons={persons} objectives={objectives} />
            : null }
            
            {reportType == ReportType.GANTT_CHART ?
              <GanttChart household={selectedHousehold} persons={persons} objectives={objectives} year={2022} />
            : null
            }
          </Modal>

          {/* <Grid item sm={12} lg={4}>
            <ProfileWidget/>
            <InterviewWidget interviewType={InterviewType.DISCOVER}></InterviewWidget>
            <InterviewWidget interviewType={InterviewType.DREAM}></InterviewWidget>
            <DirectionWidget></DirectionWidget>
            <DeepenWidget></DeepenWidget>
            <DestinyWidget></DestinyWidget>
          </Grid>
          <Grid item sm={12} lg={4}>
            <Widget title="Profile"
                    content="This is the fake text."
                    image={image}
                    link={paths.PROFILE}
                    updateImage={setImage}>
            </Widget>
            <ObjectiveWidget></ObjectiveWidget>
          </Grid>
          <Grid item sm={12} lg={4}>
            <LinksWidget type="DISCOVER"></LinksWidget>
            <Widget title="Priority Grid"
                    content="This is the fake text."
                    icon="group">
            </Widget>
          </Grid> */}
        {/* </div> */}
      </DashboardWrapper>
    </>
  );
};

export default Dashboard;


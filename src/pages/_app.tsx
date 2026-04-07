import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {StoreProvider, useStoreRehydrated} from 'easy-peasy';
import store from '../store';

import '../../public/images/logo/favicon.png';
import '../../public/images/logo/logo.png';
import '../../public/images/placeholders/user.png';
import '../../public/images/backgrounds/family2.jpg';
import '../../public/images/backgrounds/family_on_porch.jpg';
import '../../public/images/backgrounds/family_dock.jpg';
import '../../public/images/backgrounds/family_beach.jpg';
import '../../public/images/backgrounds/eyes.jpg';
import '../../public/images/backgrounds/woman_ocean.jpg';
import '../../public/images/backgrounds/couple_boat.jpg';
import '../../public/images/backgrounds/buildings.jpg';
import '../../public/images/backgrounds/family_gathering.jpg';
import '../../public/images/backgrounds/family_meadow.jpg';
import '../../public/images/backgrounds/fishing.jpg';
import '../../public/styles/colors.scss';
import '../../public/styles/data.scss';
import '../fonts/akzidenz/akzidenz.css';
import '../../public/styles/icon.css';
import '../../public/styles/highlight.css';
import '../../public/plugins/cropper/cropper.css';
import '../../public/styles/kendo.css';
import '../../public/plugins/marker/marker';
// import "../ui/components/CustomEvents/CustomEvents.scss"
// import './report.css';
import '~/ui/components/reports/PDFReportExport/PDFReportExport.css';
import '~/ui/components/reports/StoryOfUsReport/storyofus.css';
import '~/ui/components/reports/VMVReport/vmvreport.css';
import '~/ui/components/reports/VMVWorksheet/vmvworksheet.css';
import '~/ui/components/reports/FamilyStoryReport/familystory.css';
import '~/ui/components/reports/EnterpriseReport/enterprise.css';
import '~/ui/components/reports/PersonalStoryReport/personalstory.css';
import '~/ui/components/reports/LifeGraphReport/lifegraph.css';
import '~/ui/components/reports/WhyReport/whyreport.css';
import '~/ui/components/reports/PriorityGridReport/prioritygrid.css';
import '~/ui/components/reports/PriorityRankingReport/priorityranking.css';
import '~/ui/components/reports/PriorityRankingWorksheet/priorityworksheet.css';
import '~/ui/components/reports/ActionStepWorksheet/actionstepworksheet.css';
import '~/ui/components/reports/ActionStepReport/actionstepreport.css';
import '~/ui/components/reports/CurationOverviewWorksheet/curationoverviewworksheet.css';
import '~/ui/components/reports/CurationSummaryReport/curationsummary.css';
import '~/ui/components/reports/CurationInterviewWorksheet/curationinterview.css';
import '~/ui/components/reports/FamilyTreeReport/familytree.css';
import '~/ui/components/reports/ActionPlanSummaryQuarterReport/actionplan.css';
import '~/ui/components/reports/LegacyOfFiveFamilyProfile/legacyoffive.css';
import '~/ui/components/reports/InterviewQuestionsReport/InterviewQuestions.css';
import '~/ui/components/GuideBook/guidebook.css';
import '~/ui/components/reports/DiscoverLifePrint/discoverlifeprint.css';
import '~/ui/components/reports/DreamLifePrint/dreamlifeprint.css';
import '~/ui/components/reports/DirectionLifePrint/directionlifeprint.css';
import '~/ui/components/reports/ClientProfileReport/clientprofile.css';
import '~/ui/components/reports/DreamInterviewGrid/DreamInterviewGrid.css';
import '~/ui/components/reports/DevelopmentPlanReport/DevelopmentPlan.css';
import '~/ui/components/reports/DestinyFamilyOverview/DestinyFamilyOverview.css';
import '~/ui/components/AdvisorDashboard/AdvisorDashboard.css';
import './destiny/style.css'
import '~/ui/components/Reports/GanttChartReport/GanttChart.css'
import '~/ui/components/Timeline/Timeline.css'
// import '~/ui/components/CustomEvents/CustomEvents.scss'
import '~/ui/components/Evaluations/EvaluationFormModal/EvaluationPdfExport/EvaluationPdfExport.css'
import '~/ui/components/Destiny/destiny.css'
import '~/ui/components/Destiny/DestinyFilter/DestinyKendo.css'
import Loader from "~/ui/components/Loader";
import APINotificationProvider from "~/ui/providers/APINotificationProvider";
import { MuiThemeProvider } from '@material-ui/core/styles';
import {theme} from "~/ui/constants/theme";
import PrivateLayout from "~/ui/layouts/PrivateLayout";
import {useRouter} from "next/router";
import {DndProvider} from "react-dnd";
import {DRAG_AND_DROP_BE} from "~/ui/constants/data";
import { SWRConfig } from 'swr';
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { isAuthenticated, setAuthenticated } from '~/services/auth';

interface IWaitForStateRehydrationProps {
  children: React.ReactNode;
  isReport: boolean;
}

const WaitForStateRehydration = ({children, isReport}: IWaitForStateRehydrationProps) => {
  const isRehydrated = useStoreRehydrated();
  return (
    <>
      {isRehydrated || isReport ? children : <Loader/>}
    </>
  )
}

const App = ({Component, pageProps}: AppProps): ReactElement => {
  const router = useRouter();
  // @ts-ignore
  const Layout = Component.Layout || PrivateLayout;
  const isPrivateLayout = (Layout === PrivateLayout);
  const isPdfLayout = Boolean(router.query.pdf);
  // if (process.env.NODE_ENV == 'production') {
  //   disableReactDevTools();
  // }
  useEffect(() => {
    isAuthenticated() &&
      setTimeout(() => {
        setAuthenticated(false);
        localStorage.clear();
        window.location.reload();
      }, 8 * 60 * 60 * 1000);
  }, [store.getState().user.authorized]);
   
  return (
    <StoreProvider store={store}>
      <SWRConfig>
      <MuiThemeProvider  theme={theme}>
        <APINotificationProvider>
          <DndProvider backend={DRAG_AND_DROP_BE}>
            <WaitForStateRehydration isReport={isPdfLayout}>
              <Layout>
                <Head>
                  <title>{process.env.NEXT_PUBLIC_TITLE}</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1"/>
                  <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                  <meta name="robots" content="index, follow"/>
                  <meta key="googlebot" name="googlebot" content="index,follow"/>
                  <meta name="google" content="notranslate"/>
                  <meta name="keywords" content="clariata, legacy planning, legacy plan, family planning"/>
                  <meta charSet="utf-8"/>
                  <meta name="description" content="Clariata"/>
                  <link rel="icon" type="image/png" href="/images/favicon.png"/>
                  <link rel="manifest" href="/manifest.json"/>
                </Head>
                <Component {...pageProps} />
              </Layout>
            </WaitForStateRehydration>
          </DndProvider>
        </APINotificationProvider>
      </MuiThemeProvider >
      </SWRConfig>
    </StoreProvider>
  )
};

export default App;

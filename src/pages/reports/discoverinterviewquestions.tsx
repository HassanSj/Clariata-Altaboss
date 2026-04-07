import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import ActionPlanSummaryQuarterReport, {
  ActionPlanSummaryQuarterReportProps,
  getActionPlanSummaryReportProps,
} from '~/ui/components/Reports/ActionPlanSummaryQuarterReport/ActionPlanSummaryQuarterReport';
import { useStoreState } from 'easy-peasy';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import useMountEvents from '~/ui/hooks/useMountEvents';
import Loader from '~/ui/components/Loader';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';
import { useRouter } from 'next/router';
import InterviewQuestionsReport from '~/ui/components/Reports/InterviewQuestionsReport';

const DiscoverInterviewQuestionsReportPage= () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const interviewquestionprops = await getReportProps(ReportType.DISCOVER_INTERVIEW);
    Promise.resolve(interviewquestionprops);
    console.log('interviewquestionprops  :', interviewquestionprops);
    setData(interviewquestionprops);
    setLoading(false);
  };
  useMountEvents({
    onMounted: async () => {
      fetchData();
    },
  });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <DashboardWrapper tab={NavigationTab.REPORTS}>
          <Grid container spacing={1}>
            <Grid xs={3}></Grid>
            <Grid item xs={6}>
              <InterviewQuestionsReport
                wizard={data.wizard}
                showResponses={data.showResponses}
                hideClarifying={data.hideClarifying}
                vmv={data.vmv}
                household={data.household}
                persons={data.persons}
                answeredOnly={data.answeredOnly}
                unansweredOnly={data.unansweredOnly}
                starredOnly={data.starredOnly}
                hiddenOnly={data.hiddenOnly}
                selectedSections={data.selectedSections}
                storyReportType={data.storyReportType}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<ActionPlanSummaryQuarterReportProps> = async context => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getActionPlanSummaryReportProps(
//       Number(context.query.householdId),
//       Number(context.query.interviewId),
//       Number(context.query.quarter),
//       Number(context.query.year),
//     );
//     return {
//       props: {
//         household: data?.household,
//         persons: data?.persons,
//         objectives: data?.objectives,
//         quarter: data?.quarter,
//         year: data?.year,
//         dimensions: data?.dimensions,
//         metrics: data?.metrics,
//       },
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       objectives: undefined,
//       quarter: 0,
//       year: 0,
//       dimensions: undefined,
//       metrics: undefined,
//     },
//   };
// };

// // @ts-ignore
// ActionPlanSummaryQuarterReportPage.Layout = PDFLayout;

export default DiscoverInterviewQuestionsReportPage;

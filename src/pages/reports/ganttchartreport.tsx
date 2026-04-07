import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import GanttChartReport, {
  GanttChartReportProps,
  getGanttChartReportProps,
} from '~/ui/components/Reports/GanttChartReport/GanttChartReport';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { NavigationTab } from '~/ui/constants/navigations';
import { Grid } from '@material-ui/core';
import Loader from '~/ui/components/Loader';

const GanttChartReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const ganttReportChart = await getReportProps(ReportType.GANTT_CHART);
    Promise.resolve(ganttReportChart);
    console.log('ganttReportChart  :', ganttReportChart);
    setData(ganttReportChart);
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
              <GanttChartReport
                household={data?.household}
                persons={data?.persons}
                objectives={data?.objectives}
                year={data?.year}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<GanttChartReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getGanttChartReportProps(Number(context.query.householdId), Number(context.query.interviewId), Number(context.query.year), Boolean(context.query.showAll));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         objectives: data?.objectives,
//         year: data?.year
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       objectives: undefined,
//       year: 2022
//     }
//   }
// }

// // @ts-ignore
// GanttChartReportPage.Layout = PDFLayout;

export default GanttChartReportPage;

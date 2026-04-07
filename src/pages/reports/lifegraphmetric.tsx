import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import LifeGraphReport, {
  getLifeGraphData,
  LifeGraphReportProps,
} from '~/ui/components/Reports/LifeGraphReport/LifeGraphReport';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { NavigationTab } from '~/ui/constants/navigations';
import { Grid } from '@material-ui/core';
import Loader from '~/ui/components/Loader';

const LifeGraphReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();

  const fetchData = async () => {
    const lifeGraphProps = await getReportProps(ReportType.LIFE_GRAPH_METRIC);
    Promise.resolve(lifeGraphProps);
    setData(lifeGraphProps);
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
              <LifeGraphReport
                chartImages={data?.chartImages}
                household={data?.household}
                chartData={data?.chartData}
                persons={data?.persons}
                isMetric={data?.isMetric}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<LifeGraphReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getLifeGraphData(Number(context.query.householdId), Number(context.query.interviewId), Boolean(context.query.isMetric));

//     return {
//       props: {
//         household: data?.household as Household,
//         chartData: data?.chartData as { value:number, color:string, category:string|undefined }[][],
//         persons: data?.persons as Person[],
//         isMetric: Boolean(context.query.isMetric),
//         chartImages: data?.chartImages
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       chartData: undefined,
//       persons: undefined,
//       isMetric: undefined
//     }
//   }
// }

// // @ts-ignore
// LifeGraphReportPage.Layout = PDFLayout;

export default LifeGraphReportPage;

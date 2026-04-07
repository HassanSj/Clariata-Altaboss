import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import PriorityRankingReport, { getPriorityRankingReportProps, PriorityRankingReportProps } from "~/ui/components/Reports/PriorityRankingReport/PriorityRankingReport";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { Grid } from "@material-ui/core";
import { NavigationTab } from "~/ui/constants/navigations";
import Loader from "~/ui/components/Loader";

const PriorityRankingReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const priorityRankingProps = await getReportProps(ReportType.PRIORITY_RANKING);
    Promise.resolve(priorityRankingProps);
    console.log('priorityRankingProps  :', priorityRankingProps);
    setData(priorityRankingProps);
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
            <PriorityRankingReport household={data?.household} persons={data?.persons} objectives={data?.objectives} />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}

     
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<PriorityRankingReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));

//     const data = await getPriorityRankingReportProps(Number(context.query.householdId), Number(context.query.interviewId));

//     return {
//       props: {
//         household: data?.household,
//         persons: data?.persons,
//         objectives: data?.objectives,
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       objectives: undefined,
//     }
//   }
// }


// // @ts-ignore
// PriorityRankingReportPage.Layout = PDFLayout;

export default PriorityRankingReportPage;
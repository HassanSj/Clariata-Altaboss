import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import PriorityRankingWorksheet, { getPriorityRankingWorksheetProps, PriorityRankingWorksheetProps } from "~/ui/components/Reports/PriorityRankingWorksheet/PriorityRankingWorksheet";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Loader from "~/ui/components/Loader";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { Grid } from "@material-ui/core";
import { NavigationTab } from "~/ui/constants/navigations";

const PriorityRankingWorksheetPage  = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const priorityWorksheetProps = await getReportProps(ReportType.PRIORITY_RANKING_WORKSHEET);
    Promise.resolve(priorityWorksheetProps);
    console.log('priorityWorksheetProps  :', priorityWorksheetProps);
    setData(priorityWorksheetProps);
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
            <PriorityRankingWorksheet household={data?.household} persons={data?.persons} objectives={data?.objectives} />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}

     
    </>

  )
}

// export const getServerSideProps: GetServerSideProps<PriorityRankingWorksheetProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));

//     const data = await getPriorityRankingWorksheetProps(Number(context.query.householdId), Number(context.query.interviewId));

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
// PriorityRankingWorksheetPage.Layout = PDFLayout;

export default PriorityRankingWorksheetPage;
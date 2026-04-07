import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";

import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import WhyReport, { getWhyReportData, WhyReportProps } from "~/ui/components/Reports/WhyReport/WhyReport";
import { Objective } from "~/types/api/models";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import useReports from "~/ui/hooks/useReports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { ReportType } from "~/ui/constants/reports";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { NavigationTab } from "~/ui/constants/navigations";
import { Grid } from "@material-ui/core";
import Loader from "~/ui/components/Loader";

const WhyReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();

  const fetchData = async () => {
    const whyProps = await getReportProps(ReportType.WHY);
    setData(whyProps);
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
            <WhyReport household={data?.household} persons={data?.persons} objectives={data?.objectives} dimensions={data?.dimensions} metrics={data?.metrics}/>
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<WhyReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getWhyReportData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         objectives: data?.objectives as Objective[],
//         dimensions: data?.dimensions as DimensionOfLife[],
//         metrics: data?.metrics as MetricOfSuccess[]
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       objectives: undefined,
//       dimensions: undefined,
//       metrics: undefined
//     }
//   }
// }


// // @ts-ignore
// WhyReportPage.Layout = PDFLayout;

export default WhyReportPage;
import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";

import FamilyStoryReport, { getFamilyStoryReportData, FamilyStoryReportProps } from "~/ui/components/Reports/FamilyStoryReport/FamilyStoryReport";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { NavigationTab } from "~/ui/constants/navigations";
import { Grid } from "@material-ui/core";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Loader from "~/ui/components/Loader";
const FamilyStoryReportPage= () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const familyStoryProps = await getReportProps(ReportType.FAMILY_STORY);
    Promise.resolve(familyStoryProps);
    console.log('familyStoryProps  :', familyStoryProps);
    setData(familyStoryProps);
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
            <FamilyStoryReport household={data?.household} persons={data?.persons} data={data?.data}/>    
            </Grid>
          </Grid>
      </DashboardWrapper>
      )}
    </>

   
  )
}

// export const getServerSideProps: GetServerSideProps<FamilyStoryReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getFamilyStoryReportData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         data: data?.data,
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       data: undefined
//     }
//   }
// }


// // @ts-ignore
// FamilyStoryReportPage.Layout = PDFLayout;

export default FamilyStoryReportPage;
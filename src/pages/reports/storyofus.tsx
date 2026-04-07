import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";

import StoryOfUsReport, { getStoryOfUsData, StoryOfUsReportProps } from "~/ui/components/Reports/StoryOfUsReport/StoryOfUsReport";
import { getStoryOfUsReportData } from "~/ui/components/Reports/StoryOfUsReport/StoryOfUs";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { Grid } from "@material-ui/core";
import { NavigationTab } from "~/ui/constants/navigations";

const StoryOfUsReportPage = () => {
  return (
    <>
    <DashboardWrapper tab={NavigationTab.REPORTS}>
          <Grid container spacing={1}>
            <Grid xs={3}></Grid>
            <Grid item xs={6}>
              <StoryOfUsReport />            
            </Grid>
          </Grid>
      </DashboardWrapper>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<StoryOfUsReportProps> = async (context) => {
//   if (context.query) {
//     //request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getStoryOfUsReportData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household,
//         persons: data?.persons
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       questionsAndResponses: undefined
//     }
//   }
// }


// @ts-ignore
//StoryOfUsReportPage.Layout = PDFLayout;

export default StoryOfUsReportPage;
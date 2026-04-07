import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import {getFullFamily, getHouseholdFamily} from "~/services/reports/persons";
import api from "~/services/api";
import LegacyOfFiveFamilyProfile, { LegacyOfFiveFamilyProfileProps } from "~/ui/components/Reports/LegacyOfFiveFamilyProfile/LegacyOfFiveFamilyProfile";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { Grid } from "@material-ui/core";
import { NavigationTab } from "~/ui/constants/navigations";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Loader from "~/ui/components/Loader";

const LegacyOFFiveFamilyProfileReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const legacyOfFiveProps = await getReportProps(ReportType.LEGACY_OF_FIVE);
    Promise.resolve(legacyOfFiveProps);
    console.log('legacyOfFiveProps  :', legacyOfFiveProps);
    setData(legacyOfFiveProps);
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
            <LegacyOfFiveFamilyProfile family={data?.family} household={data?.household?.household} persons={data?.persons}/>
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<LegacyOfFiveFamilyProfileProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));

//     const household = await api.household.getFull(Number(context.query.householdId));
//     const family = await getHouseholdFamily(Number(context.query.householdId), true);
//     const persons = await api.person.list(Number(context.query.householdId));

//     return {
//       props: {
//         family: family,
//         household: household,
//         persons: persons?.data
//       }
//     };
//   }

//   return {
//     props: {
//       family: undefined,
//       household: undefined,
//       persons: undefined
//     }
//   }
// }


// // @ts-ignore
// LegacyOFFiveFamilyProfileReportPage.Layout = PDFLayout;

export default LegacyOFFiveFamilyProfileReportPage;
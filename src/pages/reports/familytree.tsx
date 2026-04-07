import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import FamilyTreeReport, { FamilyTreeReportProps, getFamilyTreeReportData } from "~/ui/components/Reports/FamilyTreeReport/FamilyTreeReport";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import DashboardWrapper from "~/ui/components/Dashboard/DashboardWrapper";
import { Grid } from "@material-ui/core";
import { NavigationTab } from "~/ui/constants/navigations";
import Loader from "~/ui/components/Loader";

const FamilyTreeReportPage= () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const familyTreeReportProps = await getReportProps(ReportType.FAMILY_TREE);
    Promise.resolve(familyTreeReportProps);
    console.log('familyTreeReportProps  :', familyTreeReportProps);
    setData(familyTreeReportProps);
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
            <FamilyTreeReport household={data?.household} persons={data?.persons} treeData={data?.treeData}/>
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>

  )
}

// export const getServerSideProps: GetServerSideProps<FamilyTreeReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getFamilyTreeReportData(Number(context.query.householdId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         treeData: data?.treeData
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       treeData: undefined
//     }
//   }
// }


// // @ts-ignore
// FamilyTreeReportPage.Layout = PDFLayout;

export default FamilyTreeReportPage;
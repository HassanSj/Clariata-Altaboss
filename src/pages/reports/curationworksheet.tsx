import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import CurationOverviewWorksheet, {
  CurationWorksheetProps,
} from '~/ui/components/Reports/CurationOverviewWorksheet/CurationOverviewWorksheet';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import { getCurationSummaryData } from '~/ui/components/Reports/CurationSummaryReport/CurationSummaryReport';
import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import { Objective } from '~/types/api/models';
import { useStoreState } from 'easy-peasy';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import Loader from '~/ui/components/Loader';
const CurationWorksheetPage= () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();

  const { getReportProps } = useReports();

  const fetchData = async () => {
    const curationworksheetProps = await getReportProps(ReportType.CURATION_WORKSHEET);
    Promise.resolve(curationworksheetProps);

    setData(curationworksheetProps);
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
              <CurationOverviewWorksheet
                household={data?.household}
                persons={data?.persons}
                curationPriorities={data?.curationPriorities}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<CurationWorksheetProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getCurationSummaryData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         curationPriorities: data?.curationPriorities as Objective[]
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       curationPriorities: undefined
//     }
//   }
// }

// // @ts-ignore
// CurationWorksheetPage.Layout = PDFLayout;

export default CurationWorksheetPage;

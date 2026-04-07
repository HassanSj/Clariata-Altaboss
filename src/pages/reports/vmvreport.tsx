import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';

import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import VMVReport, { getVMVReportData, VMVReportProps } from '~/ui/components/Reports/VMVReport/VMVReport';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { NavigationTab } from '~/ui/constants/navigations';
import { Grid } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import useMountEvents from '~/ui/hooks/useMountEvents';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import Loader from '~/ui/components/Loader';

const VMVReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const visionMissionProps = await getReportProps(ReportType.VMV);
    Promise.resolve(visionMissionProps);
    console.log('visionMissionProps  :', visionMissionProps);
    setData(visionMissionProps);
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
              <VMVReport
                household={data?.household}
                persons={data?.persons}
                vision={data?.vision}
                mission1={data?.mission1}
                mission2={data?.mission2}
                coreValues={data?.coreValues}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<VMVReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getVMVReportData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         vision: data?.vision,
//         mission1: data?.mission1,
//         mission2: data?.mission2,
//         coreValues: data?.coreValues
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       vision: undefined,
//       mission1: undefined,
//       mission2: undefined,
//       coreValues: undefined
//     }
//   }
// }

// // @ts-ignore
// VMVReportPage.Layout = PDFLayout;

export default VMVReportPage;

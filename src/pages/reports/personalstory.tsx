import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';

import PersonalStoryReport, {
  getPersonalStoryReportData,
  ClientProfileProps,
  getEducation,
} from '~/ui/components/Reports/PersonalStoryReport/PersonalStoryReport';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';
import Loader from '~/ui/components/Loader';

const PersonalStoryReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const personalStoryOneProps = await getReportProps(ReportType.PERSONAL_STORY);
    Promise.resolve(personalStoryOneProps);
    setData(personalStoryOneProps);
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
              <PersonalStoryReport
                personalData={data?.personalData}
                person={data?.person}
                educationData={data?.educationData}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<ClientProfileProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getPersonalStoryReportData(Number(context.query.householdId), Number(context.query.interviewId), Number(context.query.personId));
//     const education = await getEducation(Number(context.query.personId), Number(context.query.householdId));
//     return {
//       props: {
//         personalData: data?.personalData,
//         person: data?.person,
//         educationData: education
//       }
//     };
//   }

//   return {
//     props: {
//       personalData: undefined,
//       person: undefined,
//     }
//   }
// }

// // @ts-ignore
// PersonalStoryReportPage.Layout = PDFLayout;

export default PersonalStoryReportPage;

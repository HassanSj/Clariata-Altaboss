import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import { getFullFamily, getHouseholdFamily } from '~/services/reports/persons';
import ClientProfileReport from '~/ui/components/Reports/ClientProfileReport';
import { ClientProfileProps } from '~/ui/components/Reports/ClientProfileReport/ClientProfileReport';
import api from '~/services/api';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { NavigationTab } from '~/ui/constants/navigations';
import { Grid } from '@material-ui/core';
import Loader from '~/ui/components/Loader';
import { useStoreState } from '~/store/hooks';


const ProfileReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { householdId } = useStoreState((state) => state.selected)
  const [data, setData] = useState<any>();
  const [household, setHousehold] = useState<any>();
  const [persons, setPersons] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const clientProfile = await getReportProps(ReportType.PROFILE);
    Promise.resolve(clientProfile);
    console.log('clientProfile  :', clientProfile);
    setData(clientProfile);
    const resHousehold = await api.household.getFull(householdId);
    setHousehold(resHousehold);
    const resPersons = await api.person.list(householdId);
    console.log(resPersons);
    setPersons(resPersons.data);
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

              <ClientProfileReport family={data?.family} household={household} persons={persons} />
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
//     const family = await getHouseholdFamily(Number(context.query.householdId));
//     const household = await api.household.getFull(Number(context.query.householdId));
//     const persons = await api.person.list(household?.HouseholdID);

//     return {
//       props: {
//         family,
//         household,
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
// ProfileReportPage.Layout = PDFLayout;

export default ProfileReportPage;

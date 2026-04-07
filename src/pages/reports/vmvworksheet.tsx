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
import VMVWorksheet from '~/ui/components/Reports/VMVWorksheet';

const VMWorksheetPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const visionMissionWorksheetProps = await getReportProps(ReportType.VMV_WORKSHEET);
    Promise.resolve(visionMissionWorksheetProps);
    console.log('visionMissionWorksheetProps  :', visionMissionWorksheetProps);
    setData(visionMissionWorksheetProps);
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
              <VMVWorksheet />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

export default VMWorksheetPage;

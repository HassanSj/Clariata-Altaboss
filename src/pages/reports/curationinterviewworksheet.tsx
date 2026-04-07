import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import CurationInterviewWorksheet, {
  CurationInterviewWorksheetProps,
  getCurationInterviewData,
} from '~/ui/components/Reports/CurationInterviewWorksheet/CurationInterviewWorksheet';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import { Objective } from '~/types/api/models';
import { useStoreState } from 'easy-peasy';
import useMountEvents from '~/ui/hooks/useMountEvents';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import Loader from '~/ui/components/Loader';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';

const CurationInterviewWorksheetPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const curationInterviewProps = await getReportProps(ReportType.CURATION_INTERVIEW_WORKSHEET);
    console.log('Curation Props :', curationInterviewProps);
    Promise.resolve(curationInterviewProps);
    setData(curationInterviewProps);
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
              <div style={{marginTop: "20px"}}>
              <CurationInterviewWorksheet
                household={data?.household}
                persons={data?.persons}
                curationPriorities={data?.curationPriorities}
                isOpen={false}
                onClose={() => {}}
              />
              </div>
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

export default CurationInterviewWorksheetPage;

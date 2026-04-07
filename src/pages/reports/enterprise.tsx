import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import PDFLayout from '~/ui/layouts/PDFLayout';
import request from '~/services/api/request';
import { createServerClientWithToken } from '~/services/api/serverRequest';
import EnterpriseReport, {
  getEnterpriseReportData,
  EnterpriseReportProps,
  getEnterpriseResponses,
} from '~/ui/components/Reports/EnterpriseReport/EnterpriseReport';
import { Household } from '~/types/api/household';
import { Person } from '~/types/api/person';
import DashboardWrapper from '~/ui/components/Dashboard/DashboardWrapper';
import { Grid } from '@material-ui/core';
import { NavigationTab } from '~/ui/constants/navigations';
import { useStoreState } from '~/store/hooks';
import api from '~/services/api';
import useMountEvents from '~/ui/hooks/useMountEvents';
import useReports from '~/ui/hooks/useReports';
import { ReportType } from '~/ui/constants/reports';
import Loader from '~/ui/components/Loader';
const EnterpriseReportPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const enterpriseProps = await getReportProps(ReportType.OUR_ENTERPRISE);
    Promise.resolve(enterpriseProps);
    console.log('enterpriseProps  :', enterpriseProps);
    setData(enterpriseProps);
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
              <EnterpriseReport
                enterpriseData={data?.enterpriseData}
                data={data?.data}
                household={data?.household}
                persons={data?.persons}
              />
            </Grid>
          </Grid>
        </DashboardWrapper>
      )}
    </>
  );
};

export default EnterpriseReportPage;

// const EnterpriseReportPage: NextPage<EnterpriseReportProps> = (props) => {
//   return (
//     <>
//       <EnterpriseReport household={props.household} persons={props.persons} data={props.data} enterpriseData={props.enterpriseData}/>
//     </>
//   )
// }

// export const getServerSideProps: GetServerSideProps<EnterpriseReportProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const data = await getEnterpriseReportData(Number(context.query.householdId), Number(context.query.interviewId));
//     return {
//       props: {
//         household: data?.household as Household,
//         persons: data?.persons as Person[],
//         data: data?.data,
//         enterpriseData: data?.enterpriseData,
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       persons: undefined,
//       data: undefined,
//       enterpriseData: undefined,
//     }
//   }
// }

// // @ts-ignore
// EnterpriseReportPage.Layout = PDFLayout;

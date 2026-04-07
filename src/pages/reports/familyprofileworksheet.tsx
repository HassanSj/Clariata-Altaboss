import {GetServerSideProps, NextPage} from "next";
import React, { useState } from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import api from "~/services/api";
import FamilyProfileWorksheet, { FamilyProfileWorksheetProps } from "~/ui/components/Reports/FamilyProfileWorksheet/FamilyProfileWorksheet";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Loader from "~/ui/components/Loader";

const FamilyProfileWorksheetPage: NextPage<FamilyProfileWorksheetProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();
  const fetchData = async () => {
    const familyWorksheetProps = await getReportProps(ReportType.FAMILY_PROFILE_WORKSHEET);
    Promise.resolve(familyWorksheetProps);
    setData(familyWorksheetProps);
    setLoading(false);
  };

  useMountEvents({
    onMounted: async () => {
      fetchData();
    },
  });

  return (
    <>
      {!loading ? 
      <FamilyProfileWorksheet household={data?.household} person={data?.person} />
    :   <Loader/> }
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<FamilyProfileWorksheetProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));
//     const household = await api.household.get(Number(context.query.householdId))
//     const person = await api.person.get(Number(context.query.personID), Number(context.query.householdId));

//     return {
//       props: {
//         household: household?.data,
//         person: person?.data,
//       }
//     };
//   }

//   return {
//     props: {
//       household: undefined,
//       person: undefined
//     }
//   }
// }


// // @ts-ignore
// FamilyProfileWorksheetPage.Layout = PDFLayout;

export default FamilyProfileWorksheetPage;
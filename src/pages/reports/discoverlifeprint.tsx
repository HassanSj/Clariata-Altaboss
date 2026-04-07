import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import DiscoverLifePrint, {
    DiscoverLifePrintProps,
    getDiscoverLifePrintData
} from "~/ui/components/Reports/DiscoverLifePrint/DiscoverLifePrint";

const DiscoverLifePrintPage: NextPage<DiscoverLifePrintProps> = (props) => {
  return (
    <>
      <DiscoverLifePrint household={props.household} persons={props.persons} timelineItems={props.timelineItems} treeData={props.treeData} vision={props.vision} mission1={props.mission1} mission2={props.mission2} coreValues={props.coreValues} owner={props.owner} />
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<DiscoverLifePrintProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));

//     const data = await getDiscoverLifePrintData(Number(context.query.householdId), Number(context.query.interviewId), true, true, true, true, true, true, true, true, 0, 3000);

//     return {
//         props: {
//             household: data?.household,
//             persons: data?.persons,
//             timelineItems: data?.timelineItems,
//             treeData: data?.treeData,
//             vision: data?.vision,
//             mission1: data?.mission1,
//             mission2: data?.mission2,
//             coreValues: data?.coreValues,
//         }
//     };
//   }

//   return {
//     props: {
//         household: undefined,
//         persons: undefined,
//     }
//   }
// }


// @ts-ignore
DiscoverLifePrintPage.Layout = PDFLayout;

export default DiscoverLifePrintPage;
import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import DreamLifePrint, {
    DreamLifePrintProps,
    getDreamLifePrintData,
    SelectedPriorities
} from "~/ui/components/Reports/DreamLifePrint/DreamLifePrint";

const DreamLifePrintPage: NextPage<DreamLifePrintProps> = (props) => {
  return (
    <>
      <DreamLifePrint
          household={props.household}
          persons={props.persons}
          objectives={props.objectives}
          familyPriorities={props.familyPriorities}
          workLifePriorities={props.workLifePriorities}
          communityPriorities={props.communityPriorities}
          person1Priorities={props.person1Priorities}
          person2Priorities={props.person2Priorities}
          additionalPriorities={props.additionalPriorities}
          whyData={props.whyData}
          chartData={props.chartData}
          chartImages={props.chartImages}
          owner={props.owner} />
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<DreamLifePrintProps> = async (context) => {
//   if (context.query) {
//     request.private = createServerClientWithToken(context.req, String(context.query.token));

//     const selectedPriorities: SelectedPriorities = {
//         person1Objs: context.query.person1Objs as string[],
//         person2Objs: context.query.person2Objs as string[],
//         familyPriorities: context.query.familyPriorities as string[],
//         workPriorities: context.query.workPriorities as string[],
//         communityPriorities: context.query.communityPriorities as string[],
//         additionalPriorities: context.query.additionalPriorities as string[]
//     }

//     const data = await getDreamLifePrintData(Number(context.query.householdId), Number(context.query.interviewId),selectedPriorities);

//     return {
//         props: {
//             household: data?.household,
//             persons: data?.persons,
//             objectives: data?.objectives,
//             familyPriorities: data?.familyPriorities,
//             workLifePriorities: data?.workLifePriorities,
//             communityPriorities: data?.communityPriorities,
//             whyData: data?.whyData,
//             chartData: data?.chartData,
//             additionalPriorities: data?.additionalPriorities,
//             person1Priorities: data?.person1Priorities,
//             person2Priorities: data?.person2Priorities,

//         }
//     };
//   }

//   return {
//     props: {
//         household: undefined,
//         persons: undefined,
//         objectives: undefined,
//         familyPriorities: undefined,
//         workLifePriorities: undefined,
//         communityPriorities: undefined,
//         whyData: undefined,
//         chartData: undefined,
//     }
//   }
// }


// @ts-ignore
DreamLifePrintPage.Layout = PDFLayout;

export default DreamLifePrintPage;
import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import GuideBook, { getGuidebookData, GuideBookProps } from "~/ui/components/GuideBook/GuideBook";

const GuidebookPage: NextPage<GuideBookProps> = (props) => {
  return (
    <>
      <GuideBook household={props.household}
                  family={props.family} 
                  persons={props.persons} 
                  owner={props.owner} 
                  storyOfUsData={props.storyOfUsData}
                  storyOfUsQuestionsAndResponses={props.storyOfUsQuestionsAndResponses}
                  familyStoryData={props.familyStoryData}
                  enterprise={props.enterprise}
                  enterpriseData={props.enterpriseData}
                  treeData={props.treeData}
                  vmvResponses={props.vmvResponses}
                  objectives={props.objectives}
                  selectedObjectives={props.selectedObjectives}
                  dimensions={props.dimensions}
                  metrics={props.metrics}
                  dimensionsGraph={props.dimensionsGraph}
                  metricsGraph={props.metricsGraph}
                  curationPriorities={props.curationPriorities}
                  year={props.year}
                  quarters={props.quarters}
                  spouse1={props.spouse1}
                  spouse2={props.spouse2}
                  personalStoryDataSpouse1={props.personalStoryDataSpouse1}
                  personalStoryDataSpouse2={props.personalStoryDataSpouse2}
                  curationSummary={props.curationSummary}
                  actionPlan={props.actionPlan}
                  why={props.why}
                  gantt={props.gantt}
                  priorityRanking={props.priorityRanking}
                  priorityGrid={props.priorityGrid}
                  legacyOfFive={props.legacyOfFive}
                  timelineData={props.timelineData}
                  actionPlanStartDate={props.actionPlanStartDate}
                  actionPlanEndDate={props.actionPlanEndDate}/>
    </>
  )
}

//export const getServerSideProps: GetServerSideProps<GuideBookProps> = async (context) => {
  // if (context.query) {
  //   request.private = createServerClientWithToken(context.req, String(context.query.token));

  //   // const guidebookProps = await getGuidebookData(Number(context.query.householdId), Number(context.query.discoverInterviewId), Number(context.query.dreamInterviewId), Number(context.query.year), Number(context.query.quarter) );
  //   const guidebookProps = await getGuidebookData(Number(context.query.householdId), 
  //       Number(context.query.discoverInterviewId), 
  //       Number(context.query.dreamInterviewId),
  //       Boolean(context.query.legacyOfFive === 'true' ? 1 : 0), 
  //       Boolean(context.query.person1 === 'true' ? 1 : 0), 
  //       Boolean(context.query.person2 === 'true' ? 1 : 0), 
  //       Boolean(context.query.storyOfUs === 'true' ? 1 : 0), 
  //       Boolean(context.query.familyStory === 'true' ? 1 : 0), 
  //       Boolean(context.query.enterprise === 'true' ? 1 : 0), 
  //       Boolean(context.query.timeline === 'true' ? 1 : 0), 
  //       Boolean(context.query.tree === 'true' ? 1 : 0), 
  //       Boolean(context.query.vmv === 'true' ? 1 : 0), 
  //       Boolean(context.query.priorityGrid === 'true' ? 1 : 0), 
  //       Boolean(context.query.why === 'true' ? 1 : 0), 
  //       Boolean(context.query.dimension === 'true' ? 1 : 0), 
  //       Boolean(context.query.metric === 'true' ? 1 : 0), 
  //       Boolean(context.query.priorityRanking === 'true' ? 1 : 0), 
  //       Boolean(context.query.curationSummary === 'true' ? 1 : 0), 
  //       Boolean(context.query.actionPlan === 'true' ? 1 : 0), 
  //       Boolean(context.query.gantt === 'true' ? 1 : 0),
  //       Number(context.query.year),
  //       Number(context.query.quarter),
  //       context.query.actionPlanStartDate as string|undefined,
  //       context.query.actionPlanEndDate as string|undefined
  //   );
  //   return {
  //     props: {
  //       ...guidebookProps
  //     }
  //   };
  // }

//   return {
//     props: {
//       family: undefined,
//       household: undefined,
//       persons: undefined,
//       owner: undefined,
//       storyOfUsQuestionsAndResponses: undefined,
//       familyStoryData: undefined,
//       enterprise: undefined,
//       enterpriseData: undefined,
//       treeData: undefined,
//       vmvResponses: undefined,
//       objectives: undefined,
//       selectedObjectives: undefined,
//       dimensions: undefined,
//       metrics: undefined,
//       dimensionsGraph: undefined,
//       metricsGraph: undefined,
//       curationPriorities: undefined,
//       year: undefined,
//       quarter: undefined,
//       spouse1: undefined,
//       spouse2: undefined,
//       personalStoryDataSpouse1: undefined,
//       personalStoryDataSpouse2: undefined,
//       curationSummary: undefined,
//       actionPlan: undefined,
//       why: undefined,
//       gantt: undefined,
//       priorityRanking: undefined,
//       priorityGrid: undefined,
//       legacyOfFive: undefined,
//     }
//   }
// }


// // @ts-ignore
//GuidebookPage.Layout = PDFLayout;

export default GuidebookPage;
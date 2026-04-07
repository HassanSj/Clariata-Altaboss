import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import InterviewQuestionsReport, {
  getFilteredInterviewQuestionsReportData,
  IInterviewQuestionsReportProps
} from "~/ui/components/Reports/InterviewQuestionsReport/InterviewQuestionsReport";
import {getFullFamily} from "~/services/reports/persons";
import { ReportType } from "~/ui/constants/reports";

const InterviewReportPage: NextPage<IInterviewQuestionsReportProps> = (props) =>  {
  return (
    <>
      <InterviewQuestionsReport wizard={props.wizard} showResponses={props.showResponses} hideClarifying={props.hideClarifying} vmv={props.vmv} household={props.household} persons={props.persons} answeredOnly={props.answeredOnly} unansweredOnly={props.unansweredOnly} starredOnly={props.starredOnly} hiddenOnly={props.hiddenOnly} selectedSections={props.selectedSections} storyReportType={props.storyReportType}/>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<IInterviewQuestionsReportProps> = async (context) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));

    const report = await getFilteredInterviewQuestionsReportData(
      Number(context.query.householdId),
      Number(context.query.interviewId),
      Boolean(context.query.showResponses === 'true' ? 1 : 0),
      Boolean(context.query.hideClarifying === 'true' ? 1 : 0),
      Boolean(context.query.vmv === 'true' ? 1 : 0),
      Boolean(context.query.answeredOnly === 'true' ? 1 : 0),
      Boolean(context.query.unansweredOnly === 'true' ? 1 : 0),
      Boolean(context.query.starredOnly === 'true' ? 1 : 0),
      Boolean(context.query.hiddenOnly === 'true' ? 1 : 0),
      context.query.selectedSections ? JSON.parse(String(context.query.selectedSections)) as number[] : [],
      context.query.storyReportType && context.query.storyReportType != "" ? context.query.storyReportType as ReportType : undefined);
      
    const household = await getFullFamily(Number(context.query.householdId));

    return {
      props: {
        ...report,
        household
      }
    };
  }

  return {
    props: {
      household: undefined
    }
  }
}

// @ts-ignore
InterviewReportPage.Layout = PDFLayout;

export default InterviewReportPage;
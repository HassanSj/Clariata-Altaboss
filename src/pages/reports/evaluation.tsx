import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";

import HouseholdEvaluationReport, { getEvaluationReportData, HouseholdEvaluationProps } from "~/ui/components/Reports/HouseholdEvaluationReport/HouseholdEvaluationReport";
import { ClientEvaluation } from "~/types/api/clientEvaluation";

const EvaluationReportPage: NextPage<HouseholdEvaluationProps> = (props) => {
  return (
    <>
      <HouseholdEvaluationReport evaluation={props.evaluation} complexityOfNeeds={props.complexityOfNeeds} legacyInterest={props.legacyInterest} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<HouseholdEvaluationProps> = async (context) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));
    const data = await getEvaluationReportData(Number(context.query.evaluationId));
    return {
      props: {
        evaluation: data?.evaluation as ClientEvaluation,
        legacyInterest: data?.legacyInterest,
        complexityOfNeeds: data?.complexityOfNeeds
      }
    };
  }

  return {
    props: {
      evaluation: undefined,
      legacyInterest: undefined,
      complexityOfNeeds: undefined
    }
  }
}


// @ts-ignore
EvaluationReportPage.Layout = PDFLayout;

export default EvaluationReportPage;
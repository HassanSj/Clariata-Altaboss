import {GetServerSideProps} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import FactorMatrixReport, {
  getFactorMatrixReportData,
  IFactorMatrixReportProps
} from "~/ui/components/Reports/FactorMatrixReport/FactorMatrixReport";
import {getFullFamily} from "~/services/reports/persons";


const MatrixReportPage = ({ wizard, questions, dimensionsOfLife, metricsOfSuccess }: IFactorMatrixReportProps) => {
  return (
    <>
      <FactorMatrixReport wizard={wizard}
                          questions={questions}
                          dimensionsOfLife={dimensionsOfLife}
                          metricsOfSuccess={metricsOfSuccess} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<IFactorMatrixReportProps> = async (context) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));
    const report = await getFactorMatrixReportData(
      Number(context.query.householdId),
      Number(context.query.interviewId));
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
MatrixReportPage.Layout = PDFLayout;

export default MatrixReportPage;
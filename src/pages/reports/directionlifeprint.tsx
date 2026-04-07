import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import DirectionLifePrint, {
    DirectionLifeprintData,
    DirectionLifePrintProps,
    getDirectionLifePrintData
} from "~/ui/components/Reports/DirectionLifePrint/DirectionLifePrint";

const DirectionLifePrintPage: NextPage<DirectionLifePrintProps> = (props) => {
  return (
    <>
      <DirectionLifePrint startDate={props.startDate} endDate={props.endDate} household={props.household} persons={props.persons} objectives={props.objectives} year={props.year} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<DirectionLifePrintProps> = async (context) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));

    const params:DirectionLifeprintData = {
        priorities: context.query.priorities as string[],
        startDate: context.query.startDate as string,
        endDate: context.query.endDate as string
    }
    const data = await getDirectionLifePrintData(Number(context.query.householdId), Number(context.query.interviewId), Number(context.query.year),params);

    return {
        props: {
            household: data?.household,
            persons: data?.persons,
            objectives: data?.objectives,
            year: data?.year,
            startDate: data?.startDate,
            endDate: data?.endDate
        }
    };
  }

  return {
    props: {
        household: undefined,
        persons: undefined,
        objectives: undefined,
        year: 0,
    }
  }
}


// @ts-ignore
DirectionLifePrintPage.Layout = PDFLayout;

export default DirectionLifePrintPage;
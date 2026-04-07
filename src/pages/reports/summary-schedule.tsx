import {GetServerSideProps, NextPage} from "next";
import React from "react";
import CurationSummarySchedulerReport, {CurationSummarySchedulerProps} from "~/ui/components/Reports/CurationSummarySchedulerReport/CurationSummarySchedulerReport";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import {Objective} from "~/types/api/objective";
import api from "~/services/api";

const SummarySchedulerReportPage: NextPage<CurationSummarySchedulerProps> = (props) => {
    return (
        <>
            <CurationSummarySchedulerReport objectives={props.objectives} householdID={props.householdID} household={props.household}/>
        </>
    )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<CurationSummarySchedulerProps> = async (context) => {
    if (context.query) {
        request.private = createServerClientWithToken(context.req, String(context.query.token));

        // 521, 528
        const objIDs:string[] = typeof context.query.objectives === "string" ? [context.query.objectives] : context.query.objectives ?? [];
        // @ts-ignore
        const householdID:string = context.query.household;// 29
        // @ts-ignore
        const interviewID:string = context.query.interview;// 103

        const objectives:Objective[] = [];

        for(const id of objIDs){
            const obj = await api.objective.getFull(Number(householdID), interviewID, id);
            objectives.push(obj)
        }

        const hh = await api.household.getFull(householdID);

        return {
            props: {
                objectives,
                householdID,
                household: hh
            }
        };
    }

    return {
        props: {
            objectives: [],
            householdID: 0,
            household: null
        }
    }
}

// @ts-ignore
SummarySchedulerReportPage.Layout = PDFLayout

export default SummarySchedulerReportPage;
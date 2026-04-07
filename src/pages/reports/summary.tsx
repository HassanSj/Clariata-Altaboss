import CurationSummaryReport, {CurationSummaryProps} from "~/ui/components/Reports/CurrationSummaryReport/CurationSummaryReport";
import {GetServerSideProps, NextPage} from "next";
import React from "react";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import api  from "~/services/api"
import {Objective} from "~/types/api/objective";
import {Person} from "~/types/api/person";
import {PersonType} from "~/ui/constants/api";
import {objectiveKnowledgeLevels} from "~/ui/constants/objectives";

const SummaryReportPage: NextPage<CurationSummaryProps> = (props) => {
    return (
        <>
            <CurationSummaryReport objectives={props.objectives} householdID={props.householdID} people={props.people} household={props.household} knowledge={props.knowledge} externalStakeholders={props.externalStakeholders} familyStakeholders={props.familyStakeholders}/>
        </>
    )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<CurationSummaryProps> = async (context) => {
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

        // People and stakeholders

        const allPeople:{[id:number]:Person} = {};

        const fmStk:{[key:string]:Person[]} = {}
        const exStk:{[key:string]:Person[]} = {}

        for(const obj of objectives){
            if(obj.Champion) {
                const ppl = await api.person.get(obj.Champion, Number(householdID));
                allPeople[obj.Champion] = ppl.data as Person
            }

            const fmStks = obj.Stakeholders?.filter((value) => value?.Person?.PersonTypeID === PersonType.FAMILY || value?.Person?.PersonTypeID === PersonType.PRIMARY).map((value) => value!.Person!)
            const exStks = obj.Stakeholders?.filter((value) => value?.Person?.PersonTypeID !== PersonType.FAMILY && value?.Person?.PersonTypeID !== PersonType.PRIMARY).map((value) => value!.Person!)

            // @ts-ignore
            fmStk[obj.ObjectiveID] = fmStks
            // @ts-ignore
            exStk[obj.ObjectiveID] = exStks
        }

        // Knowledge
        const allKnowledge: { [key: string]: string } = {};
        for (const level of objectiveKnowledgeLevels) {
            allKnowledge[level.value] = level.label
        }

        // Household

        const hh = await api.household.getFull(householdID);

        return {
            props: {
                objectives,
                householdID,
                people: allPeople,
                knowledge:allKnowledge,
                familyStakeholders: fmStk,
                externalStakeholders: exStk,
                household: hh
            }
        };
    }

    return {
        props: {
            objectives: [],
            householdID: 0,
            people: {},
            knowledge: {},
            familyStakeholders: {},
            externalStakeholders: {},
            household: null
        }
    }
}

// @ts-ignore
// SummaryReportPage.Layout = PDFLayout

export default SummaryReportPage;
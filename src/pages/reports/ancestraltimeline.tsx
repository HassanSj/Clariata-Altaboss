import {GetServerSideProps, NextPage} from "next";
import React from "react";
import PDFLayout from "~/ui/layouts/PDFLayout";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import TimelineReport, { getTimelineReportData, TimelineReportProps } from "~/ui/components/Reports/TimelineReport/TimelineReport";
import moment from "moment";

const AncestralTimelinePage: NextPage<TimelineReportProps> = (props) => {
  return (
    <>
      <TimelineReport household={props.household} persons={props.persons} timelineItems={props.timelineItems} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<TimelineReportProps> = async (context) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));
    const data = await getTimelineReportData(Number(context.query.householdId),
                                            Boolean(context.query.excludePrimary === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeGrandparents === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeParents === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeChildren === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeGrandchildren === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeBirth === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeDeath === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeMarriage === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeGraduation === 'true' ? 1 : 0), 
                                            Boolean(context.query.excludeCustom === 'true' ? 1 : 0), 
                                            moment(context.query.endYear?.toString()).toDate(),
                                            moment(context.query.startYear?.toString()).toDate()
                                        );
    return {
      props: {
        timelineItems: data?.timelineItem,
        household: data?.household as Household,
        persons: data?.persons as Person[],
      }
    };
  }

  return {
    props: {
      timelineItems: undefined,
      household: undefined,
      persons: undefined,
    }
  }
}


// @ts-ignore
AncestralTimelinePage.Layout = PDFLayout;

export default AncestralTimelinePage;
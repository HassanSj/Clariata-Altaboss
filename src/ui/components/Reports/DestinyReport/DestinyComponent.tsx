import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { InterviewResponse } from "~/types/api/interviewResponse";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { DestinyReportProps } from "./DestinyReport";
import { PlanMemberItem } from "~/types/api/planMemberItem";

const DestinyComponent = ({data, itemType, household, persons}: DestinyReportProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: itemType,
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getFamilyPicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
  };

  console.log(data);

  return (
    <>
    <Header showHeader={headerProps.showHeader}
                title={headerProps.title} 
                subTitle={headerProps.subTitle}
                image={headerProps.image} 
                familyName={headerProps.familyName} 
                headerNoRight={headerProps.headerNoRight} 
                reportLogo={headerProps.reportLogo}
                worksheet={headerProps.worksheet}
                storyofus={headerProps.storyofus}/>
           
    </>
  )
}


export default DestinyComponent;

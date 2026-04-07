import React, {ReactElement, useState} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Objective } from "~/types/api/models";
import { DimensionOfLife } from "~/types/api/dimensionOfLife";
import { MetricOfSuccess } from "~/types/api/metricOfSuccess";
import person1 from './images/person1.png';
import person2 from './images/person2.png';
import both from './images/both.png';
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { useStoreState } from "~/store/hooks";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import useMountEvents from "~/ui/hooks/useMountEvents";


export interface WhyComponentProps {
  household?: Household;
  objectives?: Objective[];
  persons?: Person[];
  dimensions?: DimensionOfLife[];
  metrics?: MetricOfSuccess[];
  page: number;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";


const WhyComponent = ({ household, persons, objectives, dimensions, metrics, page }: WhyComponentProps): ReactElement => {

    console.log(objectives);

    const headerProps = {
        showHeader: true,
        title: 'The "Why" Report',
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getCouplePicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: reportLogo
    };

        return (
        <>
            <ReportWrapper reportTitle={headerProps.title} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)}>
                <Header showHeader={headerProps.showHeader}
                title={headerProps.title} 
                subTitle={headerProps.subTitle}
                image={headerProps.image} 
                familyName={headerProps.familyName} 
                headerNoRight={headerProps.headerNoRight} 
                reportLogo={headerProps.reportLogo}
                worksheet={headerProps.worksheet}
                storyofus={headerProps.storyofus}/>
                <div className="ppw-top">
                    <div className="whyreport-body-copy">
                        <div className="whyreport-intro">
                            <p>
                                <strong><span className="blue">The priority that is most meaningful to me is...</span></strong>
                            </p>
                        </div>
                        <table className="whyreport-table keep-together">

                        <tbody>
                            {objectives?.map((o,i) => {
                                const colorClass = o?.PersonID == household?.PrimaryPerson1ID ? "whyreport-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "whyreport-orange" : "whyreport-blue";
                                return (
                                    <tr>
                                        <td>{(page*10)+i+1}</td>
                                        <td>
                                            <div className="whyreport-priority-container">
                                                <div className="whyreport-priority-img">
                                                    <img src={o?.PersonID == household?.PrimaryPerson1ID ? person1 : o?.PersonID == household?.PrimaryPerson2ID ? person2 : both}/>
                                                </div>
                                                <div className="whyreport-priority-text">
                                                    <p className="whyreport-goal"><strong><span className={colorClass}>{o?.Description}</span> <span className="big-black">({dimensions?.find(d => d.DimensionOfLifeID == o?.DimensionOfLifeID)?.DimensionOfLife}/{metrics?.find(m => m.MetricOfSuccessID == o?.MetricOfSuccessID)?.MetricOfSuccess})</span></strong></p>
                                                    <p className="whyreport-goal-desc">{o?.Why}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td colSpan={2} style={{borderBottom: "0px", borderLeft: "0px", borderRight: "0px", backgroundColor: "#fafafa", padding: "0px"}}>
                                    <div className="whyreport-short-details">
                                        <div className="whyreport-f-col">
                                            <div className="whyreport-f-row clearfix">
                                                {household?.PrimaryPerson1ID ? 
                                                <>
                                                    <img src={person1}/>
                                                    <p>{persons?.find(p => p.PersonID == household?.PrimaryPerson1ID)?.FirstName}</p>
                                                </> : null }
                                                {household?.PrimaryPerson2ID ? 
                                                <>
                                                    <img src={person2}/>
                                                    <p>{persons?.find(p => p.PersonID == household?.PrimaryPerson2ID)?.FirstName}</p>
                                                </> : null }
                                                {household?.PrimaryPerson2ID && household?.PrimaryPerson1ID ?
                                                <>
                                                    <img src={both}/>
                                                    <p>Both</p>
                                                </> : null }
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </ReportWrapper>
        </> 
        );
}


export default WhyComponent;

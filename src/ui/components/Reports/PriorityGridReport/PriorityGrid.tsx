import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { Objective } from "~/types/api/models";
import person1 from "../WhyReport/images/person1.png"
import person2 from "../WhyReport/images/person2.png"
import both from "../WhyReport/images/both.png"
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";

export interface PriorityGridProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";

const PriorityGrid = ({ household, persons, objectives }: PriorityGridProps): ReactElement => {

  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];

  const objectivesToShow = objectives?.filter(obj => !obj.IsHidden)

  const headerProps = {
    showHeader: true,
    title: "Priority Grid Report",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
  };

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
            <div className="prioritygrid-ppw-top">
                <div className="prioritygrid-body-copy">
                    <div className="prioritygrid-intro">
                        <p style={{wordBreak: "break-all", width: "466px"}}>
                            <span style={{fontWeight: "600"}} className="prioritygrid-blue">What does a well-lived life look like for you?</span> The priority grid report is a profile of your vision of success for yourself, your family, your
                            enterprise, and your community in your pursuit of what matters most both today and in the years to come.
                        </p>
                    </div>
                    <table className="prioritygrid-grid keep-together" style={{marginLeft : "-12px"}}>
                        <thead>
                        <tr>
                            <th></th>
                            {household?.PrimaryPerson1ID ? <th>{persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID)?.FirstName}</th> : null}
                            {household?.PrimaryPerson2ID ? <th>{persons?.find(p => p?.PersonID == household?.PrimaryPerson2ID)?.FirstName}</th> : null}
                            <th>Family</th>
                            <th>Work-life</th>
                            <th>Community</th>
                        </tr>
                        </thead>
                        <tbody>
                        
                        {metrics?.map((metric, i) => { return (
                            <tr>
                                <td>{metric}</td>
                                <td>
                                    {objectivesToShow?.map(o => {
                                        if(o?.PersonID == household?.PrimaryPerson1ID && o?.MetricOfSuccessID == i+1 && o?.DimensionOfLifeID == 1) return (
                                            <>
                                                <p className={o?.PersonID == household?.PrimaryPerson1ID ? "prioritygrid-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "prioritygrid-orange" : "prioritygrid-blue"}>{o?.Description}</p>
                                            </>
                                        )
                                    })}
                                </td>
                                <td>
                                    {objectivesToShow?.map(o => {
                                        if(o?.PersonID == household?.PrimaryPerson2ID && o?.MetricOfSuccessID == i+1 && o?.DimensionOfLifeID == 1) return (
                                            <>
                                                <p className={o?.PersonID == household?.PrimaryPerson1ID ? "prioritygrid-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "prioritygrid-orange" : "prioritygrid-blue"}>{o?.Description}</p>
                                            </>
                                        )
                                    })}
                                </td>
                                <td>
                                    {objectivesToShow?.map(o => {
                                        if(o?.MetricOfSuccessID == i+1 && o?.DimensionOfLifeID == 2) return (
                                            <>
                                                <p className={o?.PersonID == household?.PrimaryPerson1ID ? "prioritygrid-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "prioritygrid-orange" : "prioritygrid-blue"}>{o?.Description}</p>
                                            </>
                                        )
                                    })}
                                </td>
                                <td>
                                    {objectivesToShow?.map(o => {
                                        if(o?.MetricOfSuccessID == i+1 && o?.DimensionOfLifeID == 3) return (
                                            <>
                                                <p className={o?.PersonID == household?.PrimaryPerson1ID ? "prioritygrid-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "prioritygrid-orange" : "prioritygrid-blue"}>{o?.Description}</p>
                                            </>
                                        )
                                    })}
                                </td>
                                <td>
                                    {objectivesToShow?.map(o => {
                                        if(o?.MetricOfSuccessID == i+1 && o?.DimensionOfLifeID == 4) return (
                                            <>
                                                <p className={o?.PersonID == household?.PrimaryPerson1ID ? "prioritygrid-dark-turquoise" : o?.PersonID == household?.PrimaryPerson2ID ? "prioritygrid-orange" : "prioritygrid-blue"}>{o?.Description}</p>
                                            </>
                                        )
                                    })}
                                </td>
                            </tr>
                        )})}
               
                </tbody>
                </table>
                <div>
                        <div className="priority-grid-footer">
                        <div className="prioritygrid-short-details">
                        <div className="prioritygrid-f-col">
                            <div className="prioritygrid-f-row clearfix">
                                {household?.PrimaryPerson1ID ? 
                                <>
                                    <img src={person1}/>
                                    <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson1ID)?.FirstName}</p>
                                </> : null}

                                {household?.PrimaryPerson2ID ? 
                                <>
                                    <img src={person2}/>
                                    <p>{persons?.find(p => p?.PersonID == household?.PrimaryPerson2ID)?.FirstName}</p>
                                </> : null}

                                {household?.PrimaryPerson1ID && household?.PrimaryPerson2ID? 
                                <>
                                    <img src={both}/>
                                    <p>Both</p>
                                </> : null}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
        </div>
    </>
  )
}


export default PriorityGrid;

import React, {ReactElement} from "react";
import { Household } from "~/types/api/household";
import { getDefaultFamilyPhotoSrc } from "~/ui/constants/user";
import { Person } from "~/types/api/person";
import { Grid } from "@material-ui/core";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { getCouplePicture } from "../StoryOfUsReport/StoryOfUs";

export const chartColors = [ '#71C7C7', '#173E68', '#F15929', '#34699D' ];

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";

export const getFamilyName = (household: Household | undefined, persons: Person[] | undefined) => {
  const spouse1 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson1ID);
  const spouse2 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson2ID);

  if(spouse2)
  {
    return spouse2.LastName == spouse1?.LastName ? `${spouse1?.FirstName} & ${spouse2.FullName}` :  `${spouse1?.FullName} & ${spouse2.FullName}`;
  }

  return `${spouse1?.FullName}`;
}

export const getFamilyPicture = (household: Household) => {
  return household?.PhotoURL ? household?.PhotoURL : getDefaultFamilyPhotoSrc();
}

const getTitle = (metric?: boolean) => {
  return metric ?  "Metrics of Success" : "Dimensions of Life"
}

export interface LifeGraphProps {
  household?: Household;
  chartData?: { value:number, color:string, category?:string }[][];
  chartImages?: string[];
  persons?: Person[];
  isMetric?: boolean;
}

const LifeGraph = ({ household, chartData, chartImages, persons, isMetric }: LifeGraphProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: getTitle(isMetric),
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
  };

  const getChartTitle = (personId: number) => {
    const metric = isMetric? "METRICS OF SUCCESS" : "DIMENSIONS OF LIFE";
    const person = personId == 0 ? "COMBINED" : "" + persons?.find(p => p.PersonID == personId)?.FirstName?.toUpperCase() + "'S"; 

    return {
      line1: `${person}`,
      line2: metric,
      line3: "OF SUCCESS"
    }
  }

  const chImages = chartImages?.filter(ch => ch)
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
        <Grid container spacing={1}>
          <p className="lifegraph-grid">
            <strong><span className="blue">What does balance look like for you in your life?</span></strong> {isMetric ? 'Based on the priorities you want to pursue, the Metrics of Success LifeGraph depicts how you want to focus your attention with respect to enjoying life experiences, achieving goals, making a difference, and sharing your legacy with others.'
            : 'Based on the priorities you want to pursue, the Dimension of Success LifeGraph depicts where you want to focus your attention with respect to your personal considerations, those of your family, within your enterprise, or in the community.'}
          </p>
        </Grid>
        <div className="three-charts-wrap">
          <div className="lifegraph-three-charts-legend">
              {chartData ? chartData?.find(cd=>cd!==undefined)?.map(cd => {
                return (
                  <div className="lifegraph-three-chart-item">
                    <span style={{ backgroundColor: cd?.color }}/> {cd?.category}
                  </div>
                )
              }) : null }
              {/* <div className="three-chart-item"><span style={{'backgroundColor':chartColors[0]}}></span> Self</div>
              <div className="three-chart-item"><span style={{'backgroundColor':chartColors[1]}}></span> Achievement</div>
              <div className="three-chart-item"><span style={{'backgroundColor':chartColors[2]}}></span> Impact</div>
              <div className="three-chart-item"><span style={{'backgroundColor':chartColors[3]}}></span> Legacy</div> */}
          </div>
          <div className="lifegraph-three-charts keep-together">
          {chartData?.map((c, i) => {return (
              <>
                <div className={'lifegraph-three-chart-'+i}>
                    {/* <DonutChart data={c} chartDiameter={i === 0 ? bigChartDiameter : smallChartDiameter} showLegend={i === 0} {...getChartTitle(i)}/> */}
                    {chImages && chImages[i] ?
                        <>
                          <img src={chImages[i]}/>
                        </>
                    : null }
                </div>
              </>
          )})}
          </div>
        </div>
      </>
  )
}


export default LifeGraph;

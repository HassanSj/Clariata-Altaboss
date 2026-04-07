import { IPDFEmbeddedProps, logoBase64, printBase64 } from '~/ui/components/Reports/PDFEmbedded/PDFEmbedded';
import React, { ReactChildren, useRef } from 'react';
import ReportStyles from '~/ui/components/Reports/reports';
import EvaluationStyles from '~/ui/components/Reports/evaluation';
import { Button, Grid } from '@material-ui/core';
import StoryOfUsStyles from '~/ui/components/Reports/storyofus';
import { useStoreState } from '~/store/hooks';
import { getPhotoUrlOrDefault } from '~/ui/constants/user';
import ProfileImage from '../../../../public/images/reports/Profile.png';
import { useRouter } from 'next/router';
import ReportWrapper from '../Reports/ReportWrapper/ReportWrapper';
import { Household, Objective } from '~/types/api/models';
import { Person } from '~/types/api/person';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import { getCouplePicture, getFamilyName } from '../Reports/StoryOfUsReport/StoryOfUs';
import Header from '../Reports/Header/Header';

export interface WorksheetWrapperProps {
  household?: Household;
  objectives?: Objective[];
  persons?: Person[];
  page?: number;
  children?: any;
  options?: any;
  personData?: any;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";
const WorksheetWrapper = ({ personData , household , persons , children, options , page}: WorksheetWrapperProps) => {
  const headerProps = {
    showHeader: true,
    title: 'Profile WorkSheet Report',
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: reportLogo
};
  return (
    <ReportWrapper
      reportTitle={headerProps.title}
      ownerId={Number(household?.CreatedBy)}
      householdId={Number(household?.HouseholdID)}
    >
      {/* <Header
        showHeader={headerProps.showHeader}
        title={headerProps.title}
        subTitle={headerProps.subTitle}
        image={headerProps.image}
        familyName={headerProps.familyName}
        headerNoRight={headerProps.headerNoRight}
        reportLogo={headerProps.reportLogo}
        worksheet={headerProps.worksheet}
        storyofus={headerProps.storyofus}
      /> */}
      {options.evaluation ? <EvaluationStyles /> : options?.storyofus ? <StoryOfUsStyles /> : <ReportStyles />}
      <div
        id="pdf-container"
        className={options.wide ? 'pdf-page-wrapper clearfix wider-layout' : 'pdf-page-wrapper clearfix '}
      >
        <div className="dynamic">
          <>
            <header className="clearfix pdf-header-as-table">
              <div className="old-header">
                <div className="h-left" style={{marginLeft: "-58px"}}>
                  <img src={ProfileImage} style={{ height: '30px', width: '40px', marginRight: '10px' }} />
                  <p>{options.title}</p>
                </div>

                <div className="h-right">
                  <div className={'hr-wrapper clearfix'} style={{marginLeft: "101px",height: "35px"}}>
                    <>
                      <p
                        style={{
                          verticalAlign: 'middle',
                          fontSize: '10px',
                          textAlign: 'center',
                          color: '#1a3f69',
                          fontWeight: '600',
                          width: '158px',
                          marginTop:'-16px'
                        }}
                      >
                        {options.familyName}
                      </p>
                      <img src={options?.familyImage} />
                    </>
                  </div>
                </div>
              </div>
            </header>
            {children}
            {/* <footer>Some content here</footer> */}
          </>
        </div>
      </div>
    </ReportWrapper>
  );
};

export default WorksheetWrapper;

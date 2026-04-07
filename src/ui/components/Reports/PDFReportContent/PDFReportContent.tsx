import {IPDFEmbeddedProps, logoBase64, printBase64} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import React, {useRef} from "react";
import ReportStyles from "~/ui/components/Reports/reports";
import EvaluationStyles from "~/ui/components/Reports/evaluation";
import {Grid} from "@material-ui/core";
import StoryOfUsStyles from "~/ui/components/Reports/storyofus";
import PdfFooter from "../PdfFooter";
import GuideBookStyles from "../guidebook";
import { useStoreState } from "~/store/hooks";
import { getPrimaryPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";

const PDFReportContent = ({ children, options, isModal }: IPDFEmbeddedProps) => {
  const containerRef = useRef(null);
  const {selectedHousehold} = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const primaryOne = options?.primaryOne;
  const primaryTwo = options?.primaryTwo;
  const householdName = selectedHousehold?.HouseholdName;
  return (
    
    <>
      {options.evaluation ? <EvaluationStyles /> : options?.storyofus ? <StoryOfUsStyles /> : <ReportStyles />}
      {options.guidebook ? <GuideBookStyles /> : null}
      {options.evaluation || options.storyofus ? 
      <div id="pdf-container" ref={containerRef} className={options.wide ? "pdf-page-wrapper clearfix wider-layout" : "pdf-page-wrapper clearfix "}>
        {options?.headerFooter || options?.static ? children : 
        <div className="dynamic"> 
          {options?.customHeader ? children :
          <>
            <header className="clearfix pdf-header-as-table">
             <div className="old-header">
             <div className="h-left">
                {options?.storyofus && <img src={options.reportLogo ? options.reportLogo : printBase64}/>}
                <p>{options.title}</p>
                {options?.subTitle && options?.subTitle != "" ? <><br/><p className="subTitle">{options?.subTitle}</p></> : null }
              </div>
             
              {options?.headerNoRight ? null :
              <div className="h-right">
                  <div className={options?.worksheet ? "hr-wrapper clearfix worksheet" : "hr-wrapper clearfix"}>
                    {options?.worksheet ? 
                    <>
                      NAME: <span>{options?.familyName}</span>
                    </> :
                    <>
                      <p>{options.familyName}</p>
                      {options?.storyofus && <img src={options?.familyImage}/>}
                    </>
                    }
                  </div>
              </div> }
             </div>
              <div className="my-custom-header">
              <div className="person-one-image">
                <img className="header-image" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryOne?.PersonID))}></img>
                <div className="header-text ">{primaryOne?.FirstName} {primaryOne?.LastName}</div>
              </div>
              <div className="family-text">{householdName} Timeline</div>
              <div className="person-two-image">
                <img className="header-image" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryTwo?.PersonID))}></img>
                <div className="header-text ">{primaryTwo?.FirstName} {primaryTwo?.LastName}</div>
              </div>
              </div>
            </header> 
            {children} 
          </> }
        </div>}
        
      </div>
      :
      <div id="pdf-container" ref={containerRef} className="report_wrapper">
        <div className="report_page_header">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <img src={logoBase64} className="report_page_header_logo" />
            </Grid>
            <Grid item xs={6}>

            </Grid>
          </Grid>
        </div>
        <div className="report_page_subheader">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div>{options.title}</div>
            </Grid>
            <Grid item xs={6}>

            </Grid>
          </Grid>
        </div>
        <div className="report_page_content">
          {children}
        </div>
      </div>}
      {/* {isModal ? <PdfFooter title={options.title} ownerName="Stephen Hall" /> : null} */}
      {/* </PDFExport> */}
    </>
  )
}

export default PDFReportContent;
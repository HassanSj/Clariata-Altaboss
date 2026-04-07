import React, {ReactElement, useEffect, useState} from "react";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import api from "~/services/api";
import { isNullOrUndefined } from "util";
import { Household } from "~/types/api/household";
import household from "~/store/household";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { User } from "~/types/api/user";
import { logoBase64WithouText } from "../PDFReportExport/images";
import { useStoreState } from "~/store/hooks";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";
import router from "next/router";


const VMVWorksheet = (): ReactElement => {

  const { selectedHousehold } = useStoreState((state) => state.household);

  const reportOptions: IReportOptions = {
    storyofus: true,
    title: "Vision, Mission, Core Values",
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Vision-Mission-Values-Worksheet",
    scale: 1,
    subject: 'Dream: Vision, Mission, Core Values Worksheet',
    keepTogether: ".keep-together",
    landscape: false,
  }

  const headerProps = {
    showHeader: true,
    title: "Vision, Mission, Core Values Worksheet",
    subTitle: null,
    storyofus: true,
    headerNoRight: true,
    worksheet: true,
    reportLogo: undefined
  };


  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => {
        router.back()
        }}
        style={{width:"151px", marginLeft:"0px", marginBottom:"15px"}}
      >
          Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
      <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold.CreatedBy)} householdId={selectedHousehold.HouseholdID} >
        <Header showHeader={headerProps.showHeader}
          title={headerProps.title} 
          subTitle={headerProps.subTitle}
          image={null} 
          familyName={"null"} 
          headerNoRight={headerProps.headerNoRight} 
          reportLogo={headerProps.reportLogo}
          worksheet={headerProps.worksheet}
          storyofus={headerProps.storyofus}/>
          
                <table className="vmv-table-questions-wrap">        
          <tbody>
          <tr>
              <td className="vmv-table-header">
                  VISION
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question" >
                What would you like people to say about your family in 30 years?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
                What legacy does your family want to perpetuate?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
                In an ideal world, name two or three words you want your family to achieve
              </td>
          </tr>
          <tr>
              <td className="vmv-table-header">
                MISSION
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
                What does your family stand for?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
                What is one way you are unique as a family?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
              Collectively, your family is at your best when...
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
              Name three things you think you could do better as a family.
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
              What are practical ways you can serve each other?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
              What are practical ways you can serve others outside your family?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
              What kind of feeling do you want to have in your home?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
              What kind of relationships do you want to have with one another?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-alt">
              What are your responsibilities as family members?
              </td>
          </tr>
          <tr>
              <td className="vmv-table-header">
              CORE VALUES
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question">
              What are your core values, and what do these values look like in your everyday life?
              </td>
          </tr>
          </tbody>
                </table>
        </ReportWrapper>
        <div className="newPage"></div>
        <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold.CreatedBy)} householdId={selectedHousehold.HouseholdID} >
          <Header showHeader={headerProps.showHeader}
            title={headerProps.title} 
            subTitle={headerProps.subTitle}
            image={null} 
            familyName={"null"} 
            headerNoRight={headerProps.headerNoRight} 
            reportLogo={headerProps.reportLogo}
            worksheet={headerProps.worksheet}
            storyofus={headerProps.storyofus}/>
          <table className="vmv-table-questions-wrap">        
          <tbody>
          <tr>
              <td className="vmv-table-header" >
                  VISION
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2" >
                What would you like people to say about your family in 30 years?
                <br/>
                <div className="vmv-table-explain">
                  Complete this sentence, “The, X Family, aspires to be...”
                  </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
                What legacy does your family want to perpetuate?<br/>
                <div className="vmv-table-explain-alt">
                  Complete this sentence, “We intend to have a legacy of being...”
                </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
                In an ideal world, name two or three words you want your family to achieve.<br/>
                <div className="vmv-table-explain">
                    Complete this sentence, “We strive to be...”
                </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-header">
                MISSION
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
              What does your family stand for?<br/>
                <div className="vmv-table-explain-alt">
              Complete this sentence, “We, the X Family, believe that our purpose as a family is to...”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
              What is one way you are unique as a family?<br/>
                <div className="vmv-table-explain">
              Complete this sentence, “We are unique because we...”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
              Collectively, your family is at your best when...
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
              Name three things you think you could do better as a family.<br/>
                <div className="vmv-table-explain">
              Complete this sentence, “We, as a family, are Improving as a family by ...”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
              What are practical ways you can serve each other?<br/>
                <div className="vmv-table-explain-alt">
              Complete this sentence, “We, as a family, are Serving each other by ....”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
              What are practical ways you can serve others outside your family?<br/>
                <div className="vmv-table-explain">
              Complete this sentence, “We, as a family, are Supporting our community by ....”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
              What kind of feeling do you want to have in your home?<br/>
                <div className="vmv-table-explain-alt">
              Complete this sentence, “We, as a family, are Making our home a place of ....”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
              What kind of relationships do you want to have with one another?<br/>
                <div className="vmv-table-explain">
              Complete this sentence, “We, as a family, are Interacting with each other in a spirit of ....”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2-alt">
              What are your responsibilities as family members?<br/>
                <div className="vmv-table-explain-alt">
              Complete this sentence, “We, as a family, are Maintaining our responsibility to each other by ....”
              </div>
              </td>
          </tr>
          <tr>
              <td className="vmv-table-header">
              CORE VALUES
              </td>
          </tr>
          <tr>
              <td className="vmv-table-question-page2">
              What are your core values, and what do these values look like in your everyday life?
              <br/>
                <div className="vmv-table-explain">
              Narrow the list to five and enter a brief description of what each value looks like for your family
              </div>
              </td>
          </tr>
          </tbody>
        </table>           
        </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default VMVWorksheet;

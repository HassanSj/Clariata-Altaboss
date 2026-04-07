import { report } from 'process';
import React from 'react';
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { useStoreState } from '~/store/hooks';
import ReportWrapper from '../ReportWrapper/ReportWrapper';

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";

const DreamInterviewGrid = () => {

    const { selectedHousehold } = useStoreState((state) => state.household);

    const reportOptions: IReportOptions = {
        title: 'Dream Interview Grid',
        storyofus: true,
        header: true,
        reportLogo: reportLogo,
      }

    const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Dream-Interview-Grid",
        scale: 1,
        subject: "Dream: Interview Grid",
        author: selectedHousehold.CreatedBy,
        keepTogether: ".keep-together"
      } 

    return (
        <>
        <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true} >
        <ReportWrapper reportTitle={options.subject} ownerId={Number(selectedHousehold.CreatedBy)} householdId={selectedHousehold.HouseholdID} >            
        <Header showHeader={true}
          title="Dream Interview Grid" 
          headerNoRight={true} 
          reportLogo={reportLogo}
          worksheet={false}
          subTitle=""
          familyName=""
          storyofus={true}
          image={reportLogo} />
            <table className="dream-interview-grid-table">
                <tr className="dream-interview-grid-row">
                    <td className="dream-interview-grid-column"></td>
                    <td className="dream-interview-grid-column dream-interview-grid-cell dream-interview-grid-header-cell">
                        <div className="dream-interview-grid-header-text">SELF</div>
                        <div>Determining my Expectations for Living a Well-Lived Life</div>
                    </td>
                    <td className="dream-interview-grid-column dream-interview-grid-cell dream-interview-grid-header-cell">
                        <div className="dream-interview-grid-header-text">FAMILY</div>
                        <div>Determining my Expectations for Living a Well-Lived Family Life</div>
                    </td>
                    <td className="dream-interview-grid-column dream-interview-grid-cell dream-interview-grid-header-cell">
                        <div className="dream-interview-grid-header-text">WORK-LIFE</div>
                        <div>Determining my Expectations Within the Workplace</div>
                    </td>
                    <td className="dream-interview-grid-column dream-interview-grid-cell dream-interview-grid-header-cell">
                        <div className="dream-interview-grid-header-text">COMMUNITY</div>
                        <div>Determining my Expectations as Members of Our Community</div>
                    </td>
                </tr>
                <tr className="dream-interview-grid-row">
                    <td className="dream-interview-grid-cell-left">EXPERIENCE</td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Enjoying Life</div>
                        <div className="dream-interview-grid-cell-text">How do I wish to enjoy life personally? Why</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Family Enjoyment</div>
                        <div className="dream-interview-grid-cell-text">How do we wish to enjoy life as a family? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Supporting the Family</div>
                        <div className="dream-interview-grid-cell-text">What do we enjoy about work-life that gives us satisfaction and fulfillment? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Community Activities</div>
                        <div className="dream-interview-grid-cell-text">What community activities do we want to be involved with that are enjoyable? Why?</div>
                    </td>
                </tr>
                <tr className="dream-interview-grid-row">
                    <td className="dream-interview-grid-cell-left">ACHEIVEMENT</td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Goals/Accomplishments</div>
                        <div className="dream-interview-grid-cell-text">What do I want to accomplish during my lifetime? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Family Goals</div>
                        <div className="dream-interview-grid-cell-text">What do we intend to accomplish as a family? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Work-life Goals</div>
                        <div className="dream-interview-grid-cell-text">What do I/we want to accomplish in our work-life? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Good Citizenry</div>
                        <div className="dream-interview-grid-cell-text">What can we do to be good citizens of our communities? Why?</div>
                    </td>
                </tr>
                <tr className="dream-interview-grid-row">
                    <td className="dream-interview-grid-cell-left">IMPACT</td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Making a Difference</div>
                        <div className="dream-interview-grid-cell-text">What can I do to impact the people I care about? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Family Impact</div>
                        <div className="dream-interview-grid-cell-text">What can our family do to impact present and future generations of our family? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Stakeholder Impact</div>
                        <div className="dream-interview-grid-cell-text">How can our work create real value for those we care about? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Making a Difference</div>
                        <div className="dream-interview-grid-cell-text">What can we do to improve and promote the quality of life of those within our community? Why?</div>
                    </td>
                </tr>
                <tr className="dream-interview-grid-row">
                    <td className="dream-interview-grid-cell-left">LEGACY</td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Sharing My Values</div>
                        <div className="dream-interview-grid-cell-text">What of my accomplishments and values will help others find their own future success? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Family Legacy</div>
                        <div className="dream-interview-grid-cell-text">What of our accomplishments, values, and traditions will the family carry on? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Work-life Legacy</div>
                        <div className="dream-interview-grid-cell-text">What of our career accomplishments and values will be perpetuated in the future? Why?</div>
                    </td>
                    <td className="dream-interview-grid-cell">
                        <div className="dream-interview-grid-cell-title">Heritage of our Community</div>
                        <div className="dream-interview-grid-cell-text">How can we use our resources as a means of sharing our values with our communities? Why?</div>
                    </td>
                </tr>
            </table>
            </ReportWrapper>
            </PDFReportExport>
        </>
    )

}

export default DreamInterviewGrid;







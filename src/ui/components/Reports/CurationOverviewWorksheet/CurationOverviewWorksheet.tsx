import moment from 'moment';
import { ReactElement } from 'react';
import { Household } from '~/types/api/household';
import { Objective } from '~/types/api/models';
import { Person } from '~/types/api/person';
import { getFamilyName, getFamilyPicture, getCouplePicture } from '../StoryOfUsReport/StoryOfUsReport';
import {
  objectiveImportanceCategories,
  objectiveKnowledgeLevels,
  objectivePersonalImpacts,
  objectiveStatuses,
} from '~/ui/constants/objectives';
import { convertStringToDateText } from '~/ui/constants/utils';
import PDFReportExport, { IReportOptions } from '~/ui/components/Reports/PDFReportExport/PDFReportExport';
import { PDFExportProps } from '@progress/kendo-react-pdf';
import Header, { HeaderProps } from '~/ui/components/Reports/Header/Header';
import ReportWrapper from '../ReportWrapper/ReportWrapper';
import { PersonType } from '~/ui/constants/api';
import { Button } from '@material-ui/core';
import router from 'next/router';

export interface CurationWorksheetProps {
  household?: Household;
  persons?: Person[];
  curationPriorities?: Objective[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

const reportLogo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC';

const CurationOverviewWorksheet = ({
  household,
  persons,
  curationPriorities,
  isOpen,
  onClose,
}: CurationWorksheetProps): ReactElement => {
  const reportOptions: IReportOptions = {
    title: 'Curation Overview Worksheet',
    familyName: household?.HouseholdName,
    worksheet: true,
    storyofus: true,
    reportLogo: reportLogo,
    isOpen,
    onClose,
    header: true,
  };

  const options: PDFExportProps = {
    paperSize: 'auto',
    fileName: 'Curation-Overview-Worksheet',
    scale: 1,
    subject: 'Direction: Curation Overview Worksheet',
    author: household?.CreatedBy,
    keepTogether: '.keep-together',
  };

  const headerProps = {
    showHeader: true,
    title: 'Curation Overview Worksheet',
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getCouplePicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: reportLogo,
  };

  const printEmptyTDTimesI = (i: number) => {
    return [...Array(i)].map(e => <td></td>);
  };

  const timeframes = ['Now', 'Later', 'Long term'];

  const firstHalf = curationPriorities?.slice(0, 5);
  const secondHalf = curationPriorities?.slice(5, curationPriorities?.length);
  const firstHalfLeft = firstHalf ? 5 - firstHalf.length : 5;
  const secondHalfLeft = secondHalf ? 5 - secondHalf.length : 5;

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => {
          router.back();
        }}
        style={{ width: '151px', marginLeft: '0px', marginBottom: '15px' }}
      >
        Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
        <ReportWrapper
          reportTitle={options.subject}
          ownerId={Number(household?.CreatedBy)}
          householdId={Number(household?.HouseholdID)}
        >
          <Header
            showHeader={headerProps.showHeader}
            title={headerProps.title}
            subTitle={headerProps.subTitle}
            image={headerProps.image}
            familyName={headerProps.familyName}
            headerNoRight={headerProps.headerNoRight}
            reportLogo={headerProps.reportLogo}
            worksheet={headerProps.worksheet}
            storyofus={headerProps.storyofus}
          />
          <div className="curationworksheet-body-copy">
            <table className="curationworksheet-table keep-together" cellPadding="0" cellSpacing="0">
              <thead>
                <tr>
                  <th></th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PRIORITY:</td>
                  {firstHalf?.map(p => {
                    return <td>{p?.Description}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>DIY OR ADVISOR ASSISTED:</td>
                  {firstHalf?.map(p => {
                    return <td>{p?.DIY ? 'DIY' : p?.AssistanceNeeded ? 'Assisted' : ''}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>CHAMPION:</td>
                  {firstHalf?.map(p => {
                    return <td>{p?.Champion ? persons?.find(c => c?.PersonID === p?.Champion)?.FirstName : ''}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>FAMILY MEMBER STAKEHOLDERS:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                        {p?.Stakeholders && p?.Stakeholders?.length > 0
                          ? p?.Stakeholders.filter(x => x.Person?.PersonTypeID == PersonType.FAMILY)?.map(s => {
                              return `${s?.Person?.FirstName}, `;
                            })
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>EXTERNAL STAKEHOLDERS:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                        {p?.Stakeholders && p?.Stakeholders?.length > 0
                          ? p?.Stakeholders.filter(
                              x =>
                                x.Person?.PersonTypeID == PersonType.PROFESSIONAL ||
                                x.Person?.PersonTypeID == PersonType.OTHER,
                            )?.map(s => {
                              return `${s?.Person?.FirstName}, `;
                            })
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>START DATE:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                        {moment(p?.StartDate).year() != 1
                          ? convertStringToDateText(p?.StartDate, Number(p?.StartDateType))!
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>END DATE:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                        {moment(p?.ProjectedEndDate).year() != 1
                          ? convertStringToDateText(p?.ProjectedEndDate, Number(p?.EndDateType))!
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>TIMING:</td>
                  {firstHalf?.map(p => {
                    return <td>{p?.TimeframeID ? timeframes[p?.TimeframeID - 1] : ''}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>KNOWLEDGE:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>{objectiveKnowledgeLevels?.find(i => i?.value == String(p?.KnowledgeNeeded))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>IMPACT OF PERSONAL EXPERIENCE:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>{objectivePersonalImpacts?.find(i => i?.value == String(p?.PersonalImpactLevel))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>TOTAL FUNDING:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                        {p?.TotalFundingAmount && p?.TotalFundingAmount > 0
                          ? `$${p.TotalFundingAmount.toLocaleString()}`
                          : null}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>FUNDING DETAILS:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>
                          {
                          (p?.InstallmentFrequency && p?.InstallmentFrequency >=1 && p?.InstallmentFrequency <=7)
                          ?
                          `Installments - Amount : $${p?.InstallmentAmount}`
                          :
                          "Single Payment"
                          }
                      </td>)
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                {/* <tr>
                  <td>CONNECTIONS:</td>
                  {firstHalf?.map(p => {
                    return <td>{p?.Connections}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr> */}
                <tr>
                  <td>IMPORTANCE:</td>
                  {firstHalf?.map(p => {
                    return (
                      <td>{objectiveImportanceCategories?.find(i => i?.value == String(p?.Importance))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
                <tr>
                  <td>STATUS:</td>
                  {firstHalf?.map(p => {
                    return <td>{objectiveStatuses?.find(i => i?.value == String(p?.StatusID))?.label}</td>;
                  })}
                  {printEmptyTDTimesI(firstHalfLeft)}
                </tr>
              </tbody>
            </table>
          </div>
        </ReportWrapper>
        <div className="newPage"></div>
        <ReportWrapper
          reportTitle={options.subject}
          ownerId={Number(household?.CreatedBy)}
          householdId={Number(household?.HouseholdID)}
        >
          <Header
            showHeader={headerProps.showHeader}
            title={headerProps.title}
            subTitle={headerProps.subTitle}
            image={headerProps.image}
            familyName={headerProps.familyName}
            headerNoRight={headerProps.headerNoRight}
            reportLogo={headerProps.reportLogo}
            worksheet={headerProps.worksheet}
            storyofus={headerProps.storyofus}
          />
          <div className="curationworksheet-body-copy">
            <table className="curationworksheet-table keep-together">
              <thead>
                <tr>
                  <th></th>
                  <th>6</th>
                  <th>7</th>
                  <th>8</th>
                  <th>9</th>
                  <th>10</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PRIORITY:</td>
                  {secondHalf?.map(p => {
                    return <td>{p?.Description}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>DIY OR ADVISOR ASSISTED:</td>
                  {secondHalf?.map(p => {
                    return <td>{p?.DIY ? 'DIY' : p?.AssistanceNeeded ? 'Assisted' : ''}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>CHAMPION:</td>
                  {secondHalf?.map(p => {
                    return <td>{p?.Champion ? persons?.find(c => c?.PersonID === p?.Champion)?.FirstName : ''}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>FAMILY MEMBER STAKEHOLDERS:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                        {p?.Stakeholders && p?.Stakeholders?.length > 0
                          ? p?.Stakeholders.filter(x => x.Person?.PersonTypeID == PersonType.FAMILY)?.map(s => {
                              return `${s?.Person?.FirstName}, `;
                            })
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>EXTERNAL STAKEHOLDERS:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                        {p?.Stakeholders && p?.Stakeholders?.length > 0
                          ? p?.Stakeholders.filter(
                              x =>
                                x.Person?.PersonTypeID == PersonType.PROFESSIONAL ||
                                x.Person?.PersonTypeID == PersonType.OTHER,
                            )?.map(s => {
                              return `${s?.Person?.FirstName}, `;
                            })
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>START DATE:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                        {moment(p?.StartDate).year() != 1
                          ? convertStringToDateText(p?.StartDate, Number(p?.StartDateType))!
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>END DATE:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                        {moment(p?.ProjectedEndDate).year() != 1
                          ? convertStringToDateText(p?.ProjectedEndDate, Number(p?.EndDateType))!
                          : ''}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                 
                <tr>
                  <td>TIMING:</td>
                  {secondHalf?.map(p => {
                    return <td>{p?.TimeframeID ? timeframes[p?.TimeframeID - 1] : ''}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>KNOWLEDGE:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>{objectiveKnowledgeLevels?.find(i => i?.value == String(p?.KnowledgeNeeded))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>IMPACT OF PERSONAL EXPERIENCE:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>{objectivePersonalImpacts?.find(i => i?.value == String(p?.PersonalImpactLevel))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>TOTAL FUNDING:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                        {p?.TotalFundingAmount && p?.TotalFundingAmount > 0
                          ? `$${p.TotalFundingAmount.toLocaleString()}`
                          : null}
                      </td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                
                <tr>
                  <td>FUNDING DETAILS:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>
                          {
                          (p?.InstallmentFrequency && p?.InstallmentFrequency >=1 && p?.InstallmentFrequency <=7)
                          ?
                          `Installments - Amount : $${p?.InstallmentAmount}`
                          :
                          "Single Payment"
                          }
                      </td>)
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                {/* <tr>
                  <td>CONNECTIONS:</td>
                  {secondHalf?.map(p => {
                    return <td>{p?.Connections}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr> */}
                <tr>
                  <td>IMPORTANCE:</td>
                  {secondHalf?.map(p => {
                    return (
                      <td>{objectiveImportanceCategories?.find(i => i?.value == String(p?.Importance))?.label}</td>
                    );
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
                <tr>
                  <td>STATUS:</td>
                  {secondHalf?.map(p => {
                    return <td>{objectiveStatuses?.find(i => i?.value == String(p?.StatusID))?.label}</td>;
                  })}
                  {printEmptyTDTimesI(secondHalfLeft)}
                </tr>
              </tbody>
            </table>
          </div>
        </ReportWrapper>
      </PDFReportExport>
    </>
  );
};

export default CurationOverviewWorksheet;

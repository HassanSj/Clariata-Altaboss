import React, { ReactElement } from 'react';
import { Person } from '~/types/api/person';
import PDFReportExport, { IReportOptions } from '~/ui/components/Reports/PDFReportExport/PDFReportExport';
import { PDFExportProps } from '@progress/kendo-react-pdf';
import { getFamilyName, getFamilyPicture } from '../StoryOfUsReport/StoryOfUsReport';
import { Household } from '~/types/api/household';
import { isNullOrUndefined } from 'util';
import api from '~/services/api';
import { Objective } from '~/types/api/models';
import person1 from '../WhyReport/images/person1.png';
import person2 from '../WhyReport/images/person2.png';
import both from '../WhyReport/images/both.png';
import PriorityGrid from './PriorityGrid';
import { getCouplePicture } from '../StoryOfUsReport/StoryOfUs';
import ReportWrapper from '../ReportWrapper/ReportWrapper';
import { Button } from '@material-ui/core';
import router from 'next/router';

export interface PriorityGridReportProps {
  household?: Household;
  persons?: Person[];
  objectives?: Objective[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

const reportLogo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC';

export const MonthsByQuarter = [
  ['JAN', 'FEB', 'MAR'],
  ['APR', 'MAY', 'JUN'],
  ['JUL', 'AUG', 'SEP'],
  ['OCT', 'NOV', 'DEC'],
];

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 * @param quarter
 * @param year
 */
export const getPriorityGridReportProps = async (householdId: number, interviewId: number) => {
  // Null check
  if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
  }

  // Fetch data
  const household = await api.household.get(householdId);
  const persons = await api.person.list(householdId);

  const allobjectives = await api.objective.list(householdId, interviewId);

  const objectives = allobjectives?.data.filter(x => x.IsHidden == false);

  return {
    household: household?.data,
    persons: persons?.data,
    objectives: objectives,
  };
};

const PriorityGridReport = ({
  household,
  persons,
  objectives,
  isOpen,
  onClose,
}: PriorityGridReportProps): ReactElement => {
  const reportOptions: IReportOptions = {
    title: 'Priority Grid Report',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getCouplePicture(household) : undefined,
    reportLogo: reportLogo,
    isOpen,
    onClose,
    header: true,
  };

  const options: PDFExportProps = {
    paperSize: ["8.5in", "11in"],
    fileName: 'Priority-Grid-Report',
    scale: 1,
    subject: 'Dream: Priority Grid Report',
    author: household?.CreatedBy,
    keepTogether: '.keep-together',
    landscape: false,
  };

  const metrics = ['Experience', 'Achievement', 'Impact', 'Legacy'];

  const objectivesToShow = objectives?.filter(obj => !obj.IsHidden);
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
        <>
          <ReportWrapper
            reportTitle={options.subject}
            ownerId={Number(household?.CreatedBy)}
            householdId={Number(household?.HouseholdID)}
          >
            <PriorityGrid household={household} persons={persons} objectives={objectives} />
          </ReportWrapper>
        </>
      </PDFReportExport>
    </>
  );
};

export default PriorityGridReport;

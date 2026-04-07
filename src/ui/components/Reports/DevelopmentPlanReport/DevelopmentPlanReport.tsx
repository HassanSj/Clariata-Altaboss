import React, {ReactElement, useState} from "react";
import {Person} from "~/types/api/person";
import { Household } from "~/types/api/household";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import DevelopmentPlan, { DevelopmentPlanCategoryItem } from "./DevelopmentPlan";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import Loader from "../../Loader";
import useMountEvents from "~/ui/hooks/useMountEvents";


interface DeveloplmentPlanReportProps {
  data?: DevelopmentPlanCategoryItem[];
  person?: Person;
  household: Household;
}
export interface DeveloplmentPlanReport {
    developmentData: DevelopmentPlanCategoryItem[];
  }


const DevelopmentPlanReport = ({ data, person, household }: DeveloplmentPlanReportProps): ReactElement => {
  const [pages, setPages] = useState<DeveloplmentPlanReport[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const getPersonName = (person: Person) => {
    const preferredName = person.PreferredName
      ? `${person.PreferredName} `
      : person.FirstName
      ? person.FirstName + ' '
      : '';
    const lastName = person.LastName ? person.LastName + ' ' : '';
    return preferredName + lastName;
  };
  const reportOptions: IReportOptions = {
    title: 'Development Plan',
    storyofus: true,
    familyName: person ? getPersonName(person) : '',
    familyImage: getPhotoUrlOrDefault(person),
    header: true,
  };

  const options: PDFExportProps = {
    paperSize: 'auto',
    fileName: 'Development-Plan-Report',
    scale: 1,
    subject: 'Destiny: Development Plan Report',
    author: household?.CreatedBy,
    keepTogether: '.keep-together',
  };
  const getDevelopmentPlanPages = (data?: DevelopmentPlanCategoryItem[]) => {
    const developmentPages: DeveloplmentPlanReport[] = [];

    const developmentPlanPages = data ? Math.ceil(data.length / 2) : 0;

    if (data) {
      for (let i = 0; i < developmentPlanPages; i++) {
        const begin = i * 2;
        const end = begin + 2;

        if (data) {
          const developmentData: DeveloplmentPlanReport = {
            developmentData: data?.slice(begin, end),
          };

          developmentPages.push(developmentData);
        }
      }
    }
    setPages(developmentPages);
    setLoading(false);
  };

  useMountEvents({
    onMounted: () => {
        getDevelopmentPlanPages(data);
    },
  });

  return (
    <>
      {!isLoading ? (
        <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
          {pages.map((page, counter) => {
            return (
              <>
                <DevelopmentPlan  
                  key={'Development' + counter}
                  data={page.developmentData}
                  household={household}
                  person={person}
                  pageCounter={counter}
                  pagesLength={pages?.length}  />
              </>
            );
          })}
        </PDFReportExport>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DevelopmentPlanReport;

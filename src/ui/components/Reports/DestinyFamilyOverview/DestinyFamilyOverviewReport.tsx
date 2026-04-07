import React, {ReactElement, useEffect, useState} from "react";
import {Person} from "~/types/api/person";
import { Household } from "~/types/api/household";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import DestinyFamilyOverview, { DestinyOverviewSummaryItem } from "./DestinyFamilyOverview";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUs";
import useMountEvents from "~/ui/hooks/useMountEvents";
import Loader from "../../Loader";


interface DestingFamilyOverviewReportProps {
  data?: DestinyOverviewSummaryItem[];
  persons?: Person[];
  household: Household;
}
export interface DestingFamilyOverviewReport {
    destinyData: DestinyOverviewSummaryItem[];
  }


  
const DestingFamilyOverviewReport = ({ data, persons, household }: DestingFamilyOverviewReportProps): ReactElement => {
  const [pages, setPages] = useState<DestingFamilyOverviewReport[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const reportOptions: IReportOptions = {
    title: 'Development Plan',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getFamilyPicture(household) : undefined,
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
  const getDestinyFamilyPages = (data?: DestinyOverviewSummaryItem[]) => {
    const destinyPages: DestingFamilyOverviewReport[] = [];

    const destinyReportPage = data ? Math.ceil(data.length / 2) : 0;

    if (data) {
      for (let i = 0; i < destinyReportPage; i++) {
        const begin = i * 2;
        const end = begin + 2;

        if (data) {
          const destinyData: DestingFamilyOverviewReport = {
            destinyData: data?.slice(begin, end),
          };

          destinyPages.push(destinyData);
        }
      }
    }
    setPages(destinyPages);
    setLoading(false);
  };

  useMountEvents({
    onMounted: () => {
      getDestinyFamilyPages(data);
    },
  });

  
  return (
    <>
      {!isLoading ? (
        <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
          {pages.map((page, counter) => {
            return (
              <>
                <DestinyFamilyOverview
                  key={'Destiny' + counter}
                  data={page.destinyData}
                  household={household}
                  persons={persons}
                  pageCounter={counter}
                  pagesLength={pages?.length}
                />
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


export default DestingFamilyOverviewReport;

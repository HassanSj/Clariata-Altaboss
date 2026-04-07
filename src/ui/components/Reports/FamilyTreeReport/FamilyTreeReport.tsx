import React, { ReactElement } from "react";
import { Person } from "~/types/api/person";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { FamDiagram } from 'basicprimitivesreact';
import { Enabled, GroupByType, NavigationMode, PageFitMode } from 'basicprimitives';
import { getDefaultPhotoSrc } from "~/ui/constants/user";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { Autocomplete } from "@material-ui/lab";
import router from "next/router";
import paths from "~/ui/constants/paths";
import { useStoreActions, useStoreState } from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import FamilyTree from "./FamilyTree";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import { Button } from "@material-ui/core";

export interface FamilyTreeReportProps {
  treeData: any;
  household?: Household;
  persons?: Person[];
  isOpen?: boolean;
  onClose?: () => unknown;
}

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getFamilyTreeReportData = async (householdId: number) => {
  // Null check
  if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
  }


  // Fetch data
  const household = await api.household.get(householdId);
  const persons = await api.person.list(householdId);
  const tree = await api.familytree.get(householdId, true);

  return {
    household: household?.data,
    persons: persons?.data,
    treeData: tree?.data,
  };
}

const FamilyTreeReport = ({ treeData, household, persons, isOpen, onClose }: FamilyTreeReportProps): ReactElement => {
  const { onSelect } = useStoreActions(actions => actions.person);
  const [head, setHead] = React.useState<Person | undefined>();
  const notifications = useNotifications();

  const findPersonById = (id: number) => {
    console.log('id', id)
    return persons?.find(p => String(p.PersonID) === String(id));
  }

  const moveToContacts = async (event: any, data: any) => {
    const person = findPersonById(data?.id);
    if (!person?.PersonID) return;
    setHead(person)
    await onSelect({ head, person });
    await router.push(paths.CONTACTS);
    // await router.push(`${paths.CONTACTS}?person=${person.PersonID}`)
  }

  const reportOptions: IReportOptions = {
    title: 'Legacy Of Five Family Tree Report',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getFamilyPicture(household) : undefined,
    isOpen,
    onClose,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Legacy-Of-Five-Family-Tree",
    scale: 1,
    subject: "Direction: Legacy Of Five Family Tree",
    author: household?.CreatedBy,
    keepTogether: ".keep-together",
    landscape: false,
  }

  return (
    <>
      <Button
      variant="contained"
      size="small"
      color="primary"
      onClick={() => {
      router.back()
      }}
      style={{ width: '151px', marginLeft: '0px', marginBottom: '15px' }}
      >
          Go Back
      </Button>
      <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
        <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
                <FamilyTree treeData={treeData} household={household} persons={persons}/>
        </ReportWrapper>
      </PDFReportExport>
    </>
  )
}


export default FamilyTreeReport;

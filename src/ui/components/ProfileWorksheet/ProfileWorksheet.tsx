import React, { ReactElement, useState } from 'react';
import WorksheetWrapper from './WorksheetWrapper';
import { useRouter } from 'next/router';
import { IPDFReportOptions } from '../Reports/PDFEmbedded/PDFEmbedded';
import useMountEvents from '~/ui/hooks/useMountEvents';
import api from '~/services/api';
import useSWR from 'swr';
import { PhoneNumberItem } from '~/types/api/phoneNumberItem';
import { PersonalRelationship } from '~/types/api/personalRelationship';
import { WorkHistoryItem } from '~/types/api/workHistoryItem';
import { EducationItem } from '~/types/api/educationItem';
import { AddressItem } from '~/types/api/addressItem';
import { PhoneNumberType } from '~/types/api/phoneNumberType';
import { getAccessToken } from '~/services/auth';
import { useStoreState } from 'easy-peasy';
import { fetcher } from '~/types/api/fetcher';
import { Role } from '~/types/api/role';
import { Company } from '~/types/api/company';
import { Person } from '~/types/api/person';
import usePersons from '~/ui/hooks/usePersons';
import { getCouplePicture, getFamilyName, getFamilyPicture } from '../Reports/StoryOfUsReport/StoryOfUs';
import PDFReportExport from '../Reports/PDFReportExport';
import ReportWrapper from '../Reports/ReportWrapper/ReportWrapper';
import { IReportOptions } from '../Reports/PDFReportExport/PDFReportExport';
import { Household } from '~/types/api/household';
import { Button } from '@material-ui/core';
import { Objective } from '~/types/api/models';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import { PDFExportProps } from '@progress/kendo-react-pdf';

export interface ProfileWorksheetProps {
  household?: Household;
  objectives?: Objective[];
  persons?: Person[];
}
export interface ProfileWorksheetPage {
  priorities: Objective[];
}


const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";


const ProfileWorksheet = ({ household }: ProfileWorksheetProps): ReactElement => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { householdId } = useStoreState(state => state.selected);
  const { selectedHousehold } = useStoreState((state) => state.household);
  const [pages, setPages] = useState<ProfileWorksheetPage[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contactId, setContactId] = useState<number>();
  const [person, setPerson] = useState<Person>();
  const { persons } = usePersons();
  const urlPhoneNumbers = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${id}/phonenumber/list`;
  const { data: selectedPhoneNumbers } = useSWR<PhoneNumberItem[]>([urlPhoneNumbers, getAccessToken()], fetcher);
  const urlRelationships = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${id}/personalrelationship/list`;
  const { data: selectedRelationships } = useSWR<PersonalRelationship[]>([urlRelationships, getAccessToken()], fetcher);

  const urlWork = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${id}/workhistory/list`;
  const { data: selectedWorkHistory } = useSWR<WorkHistoryItem[]>([urlWork, getAccessToken()], fetcher);

  const urlEducation = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${id}/education/list`;
  const { data: selectedEducation } = useSWR<EducationItem[]>([urlEducation, getAccessToken()], fetcher);

  const urlAddresses = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${id}/address/list`;
  const { data: selectedAddresses } = useSWR<AddressItem[]>([urlAddresses, getAccessToken()], fetcher);
  const { data: phoneNumberTypes } = useSWR<PhoneNumberType[]>(
    [`${process.env.NEXT_PUBLIC_API_URL}/phonenumbertype/list`, getAccessToken()],
    fetcher,
  );

  const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFUSURBVEhLY/wPBAwDBJig9ICAUcsHBIxcy4nKag++fWHY/fIFw6ufPxje/frFIMnBwaDGy8cgz8XNoM8vCFVFOiBo+faXzxi2v3gG5WGCIGlZBgcRcSiPNIA32D/9+c1w7O0bKA87WPf0McNLYIiAwIffv8GYWIDX54R8jQwUuXkY7n/9AmdbCIkwWAIxPoDX53e+fIayCAOYxSAAYi9//IDhFgH9WC3/9e8fmL5NguXYwKonDxl+Q83CBjCCHWThokf3GT7+/gUVoQyUq2kxSHNyQXmoAMXnL4AJZ/Ldm1SzGAS+//0LZWECFMspDWZsYBLQM803LkN5qABvgqMWeP3zJ8Pe1y+gPARAsVyVhxfKoj749ucPlIUAKJZLsHMw5CqrM/CzskFFqAPEgOY6ikpAeQiAtZABZTVQOY4vsZACcIUoURULrQBdEhwuMFItZ2AAAAdmjqMaOaE7AAAAAElFTkSuQmCC";
  const personData = {
    person: id,
    addresses: selectedAddresses,
    education: selectedEducation,
    work: selectedWorkHistory,
    relationships: selectedRelationships,
    phoneNumbers: selectedPhoneNumbers,
    phoneNumberTypes: phoneNumberTypes,
    roles: roles,
    companies: companies,
  };

  console.log('personData :', personData);
  const downloadRolesAndCompanies = async () => {
    if (id) {
      const rolesData = await api.role.list(householdId, Number(id));
      if (rolesData) {
        setRoles(rolesData.data);
      }
      const companiesData = await api.company.list(householdId, Number(id));
      if (companiesData) {
        setCompanies(companiesData.data);
      }
      const reqPerson = persons?.filter(person => person.PersonID === Number(id));
      if (reqPerson) {
        setPerson(reqPerson![0]);
      }
    }
  };

  useMountEvents({
    onMounted: async () => {
      downloadRolesAndCompanies();
    },
  });
// const options: PDFExportProps = {
//     paperSize: 'auto',
//     fileName: 'Profile-Worksheet-Report',
//     scale: 1,
//     subject: 'Profile Worksheet',
//     author: household?.CreatedBy,
//     keepTogether: '.keep-together',
//     landscape: false,
//   };
const reportOptions: IReportOptions = {
  title: 'Ancestral Timeline',
  storyofus: true,
  familyName: getFamilyName(household, persons),
  familyImage: household ? getCouplePicture(household) : undefined,
  reportLogo: reportLogo,
  header: true,
}
const pdfoptions: PDFExportProps = {
  paperSize: 'auto',
  fileName: 'Profile Worksheet',
  scale: 1,
  subject: 'Direction: Profile Worksheet',
  author: household?.CreatedBy,
  keepTogether: '.keep-together',
  landscape: false,
};
  const options: IPDFReportOptions = {
    title: 'Personal Profile Worksheet',
    storyofus: true,
    familyName: selectedHousehold?.HouseholdName,
    familyImage: selectedHousehold ? getFamilyPicture(selectedHousehold) : undefined,
  };
  return (
    <div style={{ marginLeft: '490px' }}>
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

      <PDFReportExport options={pdfoptions} reportOptions={reportOptions} excludeFooter={true}>
        <div style={{ paddingTop: '30px', alignContent: 'center' }}>
          <WorksheetWrapper
            // key={'profile' + counter}
            options={options}
            personData={personData}
            household={household}
            persons={persons}
            // objectives={page.priorities}
            // page={counter}
          >
            <Page1 personData={personData} />
          </WorksheetWrapper>
          <div className="newPage"></div>
          <WorksheetWrapper
            // key={'profile' + counter}
            options={options}
            personData={personData}
            household={household}
            persons={persons}
            // objectives={page.priorities}
            // page={counter}
          >
            <Page2 personData={personData} />
          </WorksheetWrapper>
          <div className="newPage"></div>
          <WorksheetWrapper
            // key={'profile' + counter}
            options={options}
            personData={personData}
            household={household}
            persons={persons}
            // objectives={page.priorities}
            // page={counter}
          >
            <Page3 personData={personData} />
          </WorksheetWrapper>
        </div>
      </PDFReportExport>
    </div>
  );
};

export default ProfileWorksheet;

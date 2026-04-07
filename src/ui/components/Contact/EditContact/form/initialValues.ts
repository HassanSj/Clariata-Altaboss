import {PersonType} from "~/ui/constants/api";
import {Gender} from "~/ui/constants/person";

interface IInitialValues {
  PersonTypeID: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  PreferredName: string;
  OriginalSurname: string;
  Suffix: string;
  NumberOfChildren: number;
  Company: string;
  Occupation: string;
  Location: string;
  ReligiousAffiliation: string;
  Birthplace: string;
  GenderID: number;
}

const initialValues: IInitialValues = {
  PersonTypeID: PersonType.HOUSEHOLD,
  FirstName: '',
  MiddleName: '',
  LastName: '',
  PreferredName: '',
  OriginalSurname: '',
  Suffix: '',
  NumberOfChildren: 0,
  Company: '',
  Occupation: '',
  Location: '',
  ReligiousAffiliation: '',
  Birthplace: '',
  GenderID: Gender.UNKNOWN
};

export default initialValues;

interface IInitialValues {
  HouseholdName: string;
  ClientEvaluationID: number;
  Spouse1Name: string;
  Spouse2Name: string;
}

const initialValues: IInitialValues = {
  HouseholdName: '',
  ClientEvaluationID: 0,
  Spouse1Name: 'Spouse1',
  Spouse2Name: 'Spouse2'
};

export default initialValues;

interface IInitialValues {
  ClientEvaluationID: string;
  Description: string;
  GoalsDetail: string;
  ConcernsDetail: string;
  NeedsDetail: string;
  ComplexityOfNeedsID: String;
  LegacyDetail: string;
  LegacyInterestID: String;
}

const initialValues: IInitialValues = {
  ClientEvaluationID: '',
  Description: '',
  GoalsDetail: '',
  ConcernsDetail: '',
  NeedsDetail: '',
  ComplexityOfNeedsID: '',
  LegacyDetail: '',
  LegacyInterestID: ''
};

export default initialValues;

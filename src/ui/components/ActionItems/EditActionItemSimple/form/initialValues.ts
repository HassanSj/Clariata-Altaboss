interface IInitialValues {
  Description: string;
  ActionItemStatusID: number,
  StartDate?: Date|null,
  AssistanceNeeded: number
}

const initialValues: IInitialValues = {
  Description: '',
  StartDate: null,
  ActionItemStatusID: 0,
  AssistanceNeeded: 0
};

export default initialValues;

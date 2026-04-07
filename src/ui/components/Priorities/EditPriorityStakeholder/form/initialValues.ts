interface IInitialValues {
  Role: string;
  PersonID: number | undefined;
}

const initialValues: IInitialValues = {
  Role: '',
  PersonID: undefined
};

export default initialValues;

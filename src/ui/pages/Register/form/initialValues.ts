interface IInitialValues {
  Password: string;
  ConfirmPassword: string;
  Agreement: boolean;
}

const initialValues: IInitialValues = {
  Password: '',
  ConfirmPassword: '',
  Agreement: false,
};

export default initialValues;

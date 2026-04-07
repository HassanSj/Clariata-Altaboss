interface IInitialValues {
    Password: string;
    currentPassword:string,
    newPassword:string,
  }
  
  const initialValues: IInitialValues = {
    Password: '',
    currentPassword:"",
    newPassword:"",
  };
  
  export default initialValues;
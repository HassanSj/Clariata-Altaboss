import React, { ReactElement } from 'react';
import { useRouter } from "next/router";
import Button from '~/ui/components/Button';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import { IFormActionProps } from "~/types/forms";
import { Card, CardActions, CardContent, CardHeader, Grid } from "@material-ui/core";
import { useStoreActions, useStoreState } from "~/store/hooks";
import Typography from "@material-ui/core/Typography";
import useNotifications from "~/ui/hooks/useNotifications";
import useEditable from "~/ui/hooks/useEditable";
import { ContactDataType, ContactDataTypes } from "~/ui/constants/contact";
import { OwnerType } from "~/ui/constants/api";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import Avatar from "@material-ui/core/Avatar";
import useUser from '~/ui/hooks/useUser';
import api from '~/services/api';

interface IValues {
  Username: string;
  EmailAddress: string;
  FirstName: string;
  LastName: string;
  Company: string;
  StreetAddress: string;
  PostalCode: string;
  City: string;
  StateRegion: string;
  PhoneNumberHome: string;
  PhoneNumberMobile: string;
  PhoneNumberWork: string;
}

const EditUser = (): ReactElement => {

  const router = useRouter();
  const { user } = useUser();
  //const { user } = useStoreState(state => state.user);
  //const onUpdate = useStoreActions(actions => actions.user.onUpdate);
  const notifications = useNotifications();

  const editable = useEditable(ContactDataTypes);
  const toggleEditModal = (type: ContactDataType, item?: any) => {
    editable.setSelectedAndShow(type, item);
  }

  const update = async (values: IValues, { setErrors }: IFormActionProps) => {
    notifications.toggleLoading(true);
    if (user?.UserID) {
      const { Username, FirstName, LastName, Company, StreetAddress, PostalCode, City, StateRegion, EmailAddress, PhoneNumberHome, PhoneNumberMobile, PhoneNumberWork } = values;
      // onUpdate({
      //   id: user.UserID,
      //   values: { FirstName, LastName, Company, StreetAddress, PostalCode, City, StateRegion, EmailAddress, PhoneNumberHome, PhoneNumberMobile, PhoneNumberWork },
      //   setErrors,
      //   router,
      // });
      user.Username = EmailAddress;
      user.FirstName = FirstName;
      user.LastName = LastName;
      user.Company = Company;
      user.StreetAddress = StreetAddress;
      user.PostalCode = PostalCode;
      user.City = City;
      user.StateRegion = StateRegion;
      user.PhoneNumberHome = PhoneNumberHome;
      user.PhoneNumberMobile = PhoneNumberMobile;
      user.PhoneNumberWork = PhoneNumberWork;
      await api.user.update(user.UserID, user);

      //TODO: DISPLAY SUCCESS NOTIFICATION
    }
    notifications.toggleLoading(false);
  }

  return (
    <>
      {/* <FormWrapper initialValues={user} validationSchema={validate} onSubmit={update}> */}
      <FormWrapper initialValues={user} onSubmit={update}>
        <Card>
          <CardHeader title="Edit User" />
          <CardContent>
            <Grid container spacing={1} className="m-b-10">
              <Grid item xs={12} >
                <div style={{ display: 'inline-block', marginRight: 10 }}>
                  <Avatar
                    style={{ width: 114, height: 114 }}
                    variant="square"
                    alt={user?.Username}
                    src={user?.PhotoURL}
                    className="m-b-10" />
                  <Button
                    variant="contained"
                    color="default"
                    text="Edit Profile Picture"
                    onClick={() => toggleEditModal(ContactDataType.PHOTO, user)} />
                </div>
                <div style={{ display: 'inline-block' }}>
                  <Avatar
                    style={{ width: 114, height: 114 }}
                    variant="square"
                    alt={user?.Username}
                    src={user?.LogoURL}
                    className="m-b-10" />
                  <Button
                    variant="contained"
                    color="default"
                    text="Edit Logo"
                    onClick={() => toggleEditModal(ContactDataType.LOGO, user)} />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              {/* <Grid item xs={6}>
                <InputField type="text" name="Username" component={Input} placeholder="Username" label="Username" required={true} />
              </Grid> */}
              <Grid item xs={6}>
                <InputField type="email" name="EmailAddress" component={Input} placeholder="Email Address" label="Email Address" />
              </Grid>
            </Grid>
            <Typography color="textSecondary" gutterBottom>
              Name
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <InputField type="text" name="FirstName" component={Input} placeholder="First Name" label="First Name" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="text" name="LastName" component={Input} placeholder="Last Name" label="Last Name" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="text" name="Company" component={Input} placeholder="Company" label="Company" />
              </Grid>
            </Grid>
            <Typography color="textSecondary" gutterBottom>
              Address
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputField type="text" name="StreetAddress" component={Input} placeholder="Street Address" label="Street Address" />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <InputField type="text" name="PostalCode" component={Input} placeholder="Postal Code" label="Postal Code" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="text" name="City" component={Input} placeholder="City" label="City" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="text" name="StateRegion" component={Input} placeholder="State" label="State" />
              </Grid>
            </Grid>
            <Typography color="textSecondary" gutterBottom>
              Phone
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <InputField type="tel" name="PhoneNumberHome" component={Input} placeholder="Phone Home" label="Phone Home" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="tel" name="PhoneNumberMobile" component={Input} placeholder="Phone Mobile" label="Phone Mobile" />
              </Grid>
              <Grid item xs={4}>
                <InputField type="tel" name="PhoneNumberWork" component={Input} placeholder="Phone Work" label="Phone Work" />
              </Grid>
            </Grid>


          </CardContent>
          <CardActions>
            <Button
              type="submit"
              text={`Save`}
              size="large"
              color="primary"
            />
          </CardActions>
        </Card>
      </FormWrapper>
      <EditContactModals editable={editable} ownerType={OwnerType.USER} />
    </>
  );
};

export default EditUser;

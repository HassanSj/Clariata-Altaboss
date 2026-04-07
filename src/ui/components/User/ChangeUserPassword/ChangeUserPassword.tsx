import React, { ReactElement } from 'react';
import { useRouter } from "next/router";
import Button from '~/ui/components/Button';
import validate from './form/validate';
import initialValues from './form/initialValues';
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
import { AxiosResponse } from 'axios';
import api from '~/services/api';
import { extractServerError } from '~/services/api/errors';
import useUser from '~/ui/hooks/useUser';

interface IValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangeUserPassword = (): ReactElement => {
    
    const { user } = useUser();
    const notifications = useNotifications();

    //   const editable = useEditable(ContactDataTypes);
    //   const toggleEditModal = (type: ContactDataType, item?: any) => {
    //     editable.setSelectedAndShow(type, item);
    //   }

    const changePassword = async (values: IValues, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        if (user?.UserID) {
            //const { currentPassword, newPassword, confirmPassword } = values;
            try {
                const res: AxiosResponse = await api.user.changePasswordApi(user?.UserID, values.currentPassword, values.newPassword);
                // setErrors({ successMessage: 'Password reset successfully!' });
                // router.replace(LOGIN);
            } catch (err) {
                setErrors({ backError: extractServerError(err) });
            }
        }
        notifications.toggleLoading(false);
    }

    return (
        <>
            {/* validationSchema={validate} */}
            {/* <FormWrapper initialValues={user} onSubmit={update}> */}
            <FormWrapper validationSchema={validate}
                initialValues={initialValues} onSubmit={changePassword} successMessage="Password changed successfully!">
                <Card>
                    <CardHeader title="Change Password" />
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Change Password
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <InputField type="password" name="currentPassword" component={Input} placeholder="Current Password" label="Current Password" />
                            </Grid>
                            <Grid item xs={4}>
                                <InputField type="password" name="newPassword" component={Input} placeholder="New Password" label="New Password" />
                            </Grid>
                            <Grid item xs={4}>
                                <InputField type="password" name="confirmPassword" component={Input} placeholder="Confirm New Password" label="Confirm New Password" />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button
                            type="submit"
                            text={`Save Password`}
                            size="large"
                            color="primary"
                        />
                    </CardActions>
                </Card>
            </FormWrapper>
            {/* <EditContactModals editable={editable} ownerType={OwnerType.USER} /> */}
        </>
    );
};

export default ChangeUserPassword;
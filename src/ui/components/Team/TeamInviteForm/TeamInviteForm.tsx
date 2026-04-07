import React, {ReactElement, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { Invitation } from '~/types/api/invitation';
import { useStoreState } from '~/store/hooks';
import { Firm } from '~/types/api/firm';
import validate from './form/validate';
import { IFormActionProps } from '~/types/forms';
import moment from 'moment';
import useNotifications from '~/ui/hooks/useNotifications';

interface IProps {
    firm?: Firm;
    isOpen: boolean;
    onClose: () => unknown;
}

interface IValues {
    FirstName: string;
    LastName: string;
    Email: string;
  }

const TeamInviteForm = ({ firm, isOpen, onClose }: IProps) => {

    const notifications = useNotifications();
    const { user } = useStoreState(state => state.user);

    const SendInvitation = async (values: IValues, {setErrors}: IFormActionProps) => {

        if(values.Email?.includes("@")) {
            setErrors({ errorMessage: 'Please only enter the username of the email address'});
        }
        else {
            const today = new Date();
            const invitation: Invitation = {
                FirstName: values.FirstName,
                LastName: values.LastName,
                EmailAddress: values.Email + "@" + firm?.Domain,
                FirmId: firm?.FirmID as number,
                InvitedBy: user.UserID as number,
                InvitationTypeID: 2,
                InvitationID: 0,
                InvitationCode: '',
                ExpirationDate: today
            }
            console.log("Invitation")
            console.log(invitation);
            const res = await api.invitation.sendInvitation(invitation);
            if(res.status == 200) {
                notifications.addSuccessNotification("Invitation Sent!");
            }
            else {
                notifications.addErrorNotification("There was a problem sending your Invitation.");
            }
            onClose();
        }
      }


    return (

        <Modal title="Send Invitation" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={SendInvitation} initialValues={initialValues} validationSchema={validate} modelName="Invitation">            
                    <Grid container spacing={1}>
                        <Grid xs={12}>
                            <InputField type="text"
                                    label="First Name"
                                    name="FirstName"
                                    component={Input}
                                    required={true}
                                    />
                        </Grid>
                        <Grid xs={12}>
                            <InputField type="text"
                                        name="LastName"
                                        component={Input}
                                        label="Last Name"
                                        required={true}
                            />
                        </Grid>
                        <Grid xs={4}>
                        <InputField type="text"
                                    name="Email"
                                    component={Input}
                                    label="Email Address"
                                    required={true}
                        />
                        </Grid>
                        <Grid xs={8}>
                            <div style={{verticalAlign: "middle", height: "100%", marginTop: "40px", marginBottom: "40px", fontSize: "18px"}}>
                            @{firm?.Domain}
                            </div>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text="Send Invitation"
                            variant="contained"
                            size="large"
                            color="primary"
                        />
                        <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
                    </DialogActions>   
                    </FormWrapper>             
            </Modal>
    )
}

export default TeamInviteForm;
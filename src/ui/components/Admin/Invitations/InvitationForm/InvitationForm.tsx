import React, {ReactElement, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { Invitation } from '~/types/api/invitation';
import { useStoreState } from '~/store/hooks';
import useSWR from 'swr';
import { getAccessToken } from '~/services/auth';
import { fetcher } from "~/types/api/fetcher";
import { InvitationType } from '~/types/api/invitationType';

interface IProps {
    firmId: number;
    item?: Invitation;
    isOpen: boolean;
    onClose: () => unknown;
}

const InvitationForm = ({ firmId, item, isOpen, onClose }: IProps) => {

    const { data: invitationTypes } = useSWR<InvitationType[]>([`${process.env.NEXT_PUBLIC_API_URL}/invitationtype/list`, getAccessToken()], fetcher);

    const { user } = useStoreState(state => state.user);

    const SendInvitation = async (invitation: Invitation) => {
        invitation.FirmId = firmId;
        invitation.InvitedBy = user.UserID as number;
        console.log(invitation.InvitationTypeID);
         
        const res = await api.invitation.sendInvitation(invitation);
        onClose();
      }

    return (

<Modal title="Send Invitation" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={SendInvitation} initialValues={item ? item : initialValues}>            
                    <div>
                        <InputField type="text"
                                    label="First Name"
                                    name="FirstName"
                                    component={Input}
                                    required={true}
                                    />
                        <InputField type="text"
                                    name="LastName"
                                    component={Input}
                                    label="Last Name"
                                    required={true}
                        />
                        <InputField type="text"
                                    name="EmailAddress"
                                    component={Input}
                                    label="Email Address"
                                    required={true}
                        />
                        <InputField type="select"
                                    name="InvitationTypeID"
                                    component={Input}
                                    label="Invitation Type"
                                    required={true}
                                    items={invitationTypes}
                                    labelField="InvitationType"
                                    valueField="InvitationTypeID"
                                    />
                    </div>
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

export default InvitationForm;
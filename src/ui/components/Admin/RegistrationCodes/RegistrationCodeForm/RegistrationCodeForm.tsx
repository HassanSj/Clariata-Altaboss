import React, {ReactElement, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Button from "~/ui/components/Button";
import { RegistrationCode } from "~/types/api/registrationcode";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';

interface IProps {
    item?: RegistrationCode;
    isOpen: boolean;
    onClose: () => unknown;
}

const RegistrationCodeForm = ({ item, isOpen, onClose }: IProps) => {

    const CreateRegistrationCode = async (registrationCode: RegistrationCode) => {
        const res = await api.registrationcode.createRegistrationCode(registrationCode);
        onClose();
      }


    return (

<Modal title="Create Registration Code" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={CreateRegistrationCode} initialValues={item ? item : initialValues}>            
                    <div>
                        <InputField type="text"
                                    label="Advisor Name"
                                    name="IssuedTo"
                                    component={Input}
                                    required={true}
                                    />
                        <InputField type="email"
                                    name="EmailAddress"
                                    component={Input}
                                    label="Email Address"
                                    required={true}
                        />
                        <InputField type="text"
                                    name="RegistrationCode"
                                    component={Input}
                                    label="Enter a Registration Code"
                                    required={true}
                        />
                    </div>
                    <DialogActions>
                        <Button
                            type="submit"
                            text="Create Registration Code"
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

export default RegistrationCodeForm;
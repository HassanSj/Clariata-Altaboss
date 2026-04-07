import React, {ReactElement, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { Firm } from '~/types/api/firm';

interface IProps {
    item?: Firm;
    isOpen: boolean;
    onClose: () => unknown;
}

const FirmForm = ({ item, isOpen, onClose }: IProps) => {

    const CreateFirm = async (firm: Firm) => {
        if(item?.FirmID) {
            const res = await api.firm.updateFirm(firm);
            onClose();
        }
        else
        {
            console.log(firm);
            const res = await api.firm.createFirm(firm);
            onClose();
        }
      }


    return (

<Modal title="Create Firm" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={CreateFirm} initialValues={item ? item : initialValues}>            
                    <div>
                        <InputField type="text"
                                    label="Firm Name"
                                    name="FirmName"
                                    component={Input}
                                    required={true}
                                    />
                        <InputField type="text"
                                    name="Address"
                                    component={Input}
                                    label="Address"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="Address2"
                                    component={Input}
                                    label="Address 2"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="City"
                                    component={Input}
                                    label="City"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="State"
                                    component={Input}
                                    label="State"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="PostalCode"
                                    component={Input}
                                    label="Postal Code"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="Domain"
                                    component={Input}
                                    label="Domain"
                                    required={true}
                        />
                        <InputField type="text"
                                    name="PrimaryContact"
                                    component={Input}
                                    label="Primary Contact Name"
                                    required={false}
                        />
                        <InputField type="text"
                                    name="PrimaryEmail"
                                    component={Input}
                                    label="Primary Contact Email"
                                    required={false}
                        />
                    </div>
                    <DialogActions>
                        <Button
                            type="submit"
                            text="Create Firm"
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

export default FirmForm;
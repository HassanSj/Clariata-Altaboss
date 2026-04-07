import React, { ReactElement, useEffect, useState } from 'react';
import InputField from '~/ui/components/Forms/InputField';
import Input from "~/ui/components/Forms/Input";
import { DialogActions, FormLabel, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import useNotifications from '~/ui/hooks/useNotifications';
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";
import FormWrapper from '~/ui/components/Forms/FormWrapper';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import api from '~/services/api';
import Button from '~/ui/components/Button';
import initialValues from './initialValue'
import { ErrorMessage } from 'formik';
import { DestinySubcategory } from '~/types/api/destinySubcategory';

interface IFormProps {
    Subcategory?: DestinySubcategory;
    closeForm: () => unknown;
    reload: () => unknown;
}

const SubcategoryForm = ({Subcategory, closeForm, reload}: IFormProps ) => {

    const [actionType, setActionType] = useState<string>("");

    const createSubcategory = async (subcategoryItem: DestinySubcategory) => {       
        
        
        if(Subcategory) {

            Subcategory = subcategoryItem;
            await UpdateDestinySubcategory(subcategoryItem);
        }
        else {

            await CreateDestinySubcategory(subcategoryItem);
            
        }
        reload();
        closeForm();
    }

    const CreateDestinySubcategory = async (destinySubcategory: DestinySubcategory) => {

        const res = await api.destinySubcategory.Subcategory(destinySubcategory);
    }
    
    const UpdateDestinySubcategory = async (destinySubcategory: DestinySubcategory) => {
    
        console.log("Update API");
        console.log(destinySubcategory);
        const res = await api.destinySubcategory.updateSubcategory(destinySubcategory.SubcategoryId, destinySubcategory);
    }

    useEffect(() => {
        if(Subcategory) {            
            setActionType("Update");
        }
        else {
            setActionType("Create")
        }
    }, []);

    return (
        <div>
            <FormWrapper onSubmit={createSubcategory} initialValues={Subcategory ? Subcategory : initialValues} modelName="DestinySubcategory">
                <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="text"
                            label="Subcategory"
                            name="Subcategory"
                            component={Input}
                            required={true}
                            />
                    </Grid>
                </Grid> 
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " Subcategory"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={closeForm} />
            </DialogActions>   
            </FormWrapper> 
        </div>
    )
}

export default SubcategoryForm
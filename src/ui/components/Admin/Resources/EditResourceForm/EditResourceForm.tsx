import React, {useEffect, useState} from 'react';
import {DialogActions} from "@material-ui/core";
import Button from "~/ui/components/Button";
import { Resource } from "~/types/api/resource";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { IDataItemEventConfig } from '~/types/data';
import Categories from "../Shared/Categories";
import { resourceType } from '../Shared/resourceTypes';
import { Checklist } from '~/types/api/checklist';
import useNotifications from "~/ui/hooks/useNotifications";
import {supportedFileTypes} from "../Shared/supportedTypes";
import useMountEvents from '~/ui/hooks/useMountEvents';
import Subcategories from '../Shared/Subcategories';

interface IProps {
    item?: Resource;
    isOpen: boolean;
    onClose: () => unknown;
    eventConfig?: IDataItemEventConfig;
    value: string;
    setValue:any
}

const EditResourceForm = ({ item, onClose, isOpen, eventConfig, value, setValue}: IProps) => {
    const [mappedChecklists, setMapped] = useState<any[] | undefined>();
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [file, setFile] = useState<any>();
    const [fileChanged, setFileChanged] = useState<boolean>(false);
    const notifications = useNotifications();

    const UpdateSpecificResource = async (resource: Resource) => {
        if(item?.ResourceType === "Document"){
            if(fileChanged || ["0","1"].includes(value))
            {
                const delRes = await api.document.deleteResourceFile(item?.ResourceUrl);
            }
        }
        if(value === "0"){
            resource.ResourceType = "URL";
        }
        else if(value === "1") {
            resource.ResourceType = "Checklist";
        }
        else if(value === "2"){
            if(fileChanged){
                resource.ResourceType = "Document";
                let formData = new FormData();
                formData.append('file',file);
                const res = await api.document.uploadResourceFile(formData);
                let mutatedFileName =  file.name.toLowerCase();
                mutatedFileName  = mutatedFileName.replace(/\s/g, '');
                resource.ResourceUrl = mutatedFileName;
            }
            else{
                resource.ResourceUrl = item?.ResourceUrl!;
            }
        }
        const res = await api.resource.updateResource(resource?.ResourceId, resource);
        if (eventConfig?.onDataChange) {
            eventConfig?.onDataChange([res]);
        }
        onClose()
    }

    const handleFileInput = (e:any) => {
        if(e.target.files[0] !== undefined){
          if(supportedFileTypes.includes(e.target?.files[0].type)){
            if(item?.ResourceType === "Document"){
                setFileChanged(true);
            }
            const file = e.target.files[0]
            setFile(file)
          }
          else{
            notifications.addErrorNotification(
              "Supported file types .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
            )
          }
        }
    }

    type ResourceType = "0"|"1"|"2"

    const items = [
        {
            label: resourceType[0],
            value: "0"
        },
        {
            label: resourceType[1],
            value: "1"
        },
        {
            label: resourceType[2],
            value: "2"
        },

    ]

    useMountEvents({
        onMounted: async () => {
            const res  = await api.checklists.getAllChecklists();
            setChecklists(res.data);
        },
    });

    useEffect(() => {

    },[value])

    return (
        <Modal title="Edit Resource" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={UpdateSpecificResource} initialValues={item ? item : initialValues}>            
                    <div>
                        <InputField type="text"
                                    label="Resource Name"
                                    name="ResourceTitle"
                                    component={Input}
                                    required={true}
                                    />
                        <InputField type="text"
                                    name="Description"
                                    component={Input}
                                    label="Description"
                                    required={true}
                        />
                        <Input
                            orientation="horizontal"
                            field={{value:value,name:"URL/Checklist/Document",onChange: async (_e:any,value:ResourceType)=>{
                                setValue(value)
                                if(value === '1') {
                                    let items = checklists.map((item) => {
                                        return { label: item.ChecklistName, value: `Checklist=${item.ChecklistID}` }
                                        }
                                    )
                                    setMapped(items)
                                }
                            }}}
                            type="radio"
                            items={items}/>

                        {
                                value === '0' 
                            
                            ?

                            <InputField
                            type="text"
                            name="ResourceUrl"
                            component={Input}
                            required={true}
                            />
                        
                            : 

                            (
                                value === '1'

                            ?
                            

                            <InputField
                            type="select"
                            items={mappedChecklists}
                            name="ResourceUrl"
                            component={Input}
                            label="Select a Checklist"
                            required={true}
                            />

                            :

                            (
                            
                            item?.ResourceType === "Document"

                            ?
                            
                            <div>
                                <p>
                                A file named
                                <strong> "{item.ResourceUrl}"</strong> is already uploaded.<br/>
                                You can upload a new file to replace the previous one.
                                </p>
                                <Input
                                type="file"
                                field={{name: "ResourceUrl", onChange: handleFileInput}}
                                accept={supportedFileTypes.join(',')}
                                />
                            </div>

                            :

                            <Input
                            type="file"
                            required={true}
                            field={{name: "ResourceUrl", onChange: handleFileInput}}
                            accept={supportedFileTypes.join(',')}
                            />

                            )
   
                        )
                        }
                        <br></br>
                        <InputField type="select" items={Subcategories} name="ResourceCategory" component={Input} label="Select Subcategory" required={true} />
                        <InputField  type="select"
                                    items = {Categories}
                                    name="ResourceModule"
                                    component={Input}
                                    label= "Select Module"
                                    required={true}
                        />
                    </div>
                    <DialogActions>
                        <Button
                            type="submit"
                            text="Update Resource"
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

export default EditResourceForm;
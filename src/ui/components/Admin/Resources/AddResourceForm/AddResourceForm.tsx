import React, { useEffect, useState } from 'react';
import { DialogActions } from '@material-ui/core';
import Button from '~/ui/components/Button';
import Modal from '~/ui/components/Dialogs/Modal';
import FormWrapper from '~/ui/components/Forms/FormWrapper';
import Input from '~/ui/components/Forms/Input';
import InputField from '~/ui/components/Forms/InputField';
import api from '~/services/api';
import initialValues from './form/initialValues';
import { Resource } from '~/types/api/resource';
import Categories from '../Shared/Categories';
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
}

const AddResourceForm = ({ item, isOpen, onClose }: IProps) => {
    const [value, setValue] = useState<ResourceType>("0");
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [mappedChecklists, setMapped] = useState<any[]>([]);
    const [file, setFile] = useState<any>();
    const notifications = useNotifications();

    const CreateResource = async (resource: Resource) => {
        if(value==="0"){
            resource.ResourceType = "URL"
        }
        else if(value==="1") {
            resource.ResourceType = "Checklist" 
        }
        else if(value==="2"){
          resource.ResourceType = "Document"
          let formData = new FormData();
          formData.append('file',file);
          const res = await api.document.uploadResourceFile(formData);
          let mutatedFileName =  file.name.toLowerCase();
          mutatedFileName  = mutatedFileName.replace(/\s/g, '');
          resource.ResourceUrl = mutatedFileName;
        }
        const res = await api.resource.addResource(resource);
        onClose();
    };


    const handleFileInput = (e:any) => {
        if(e.target.files[0] !== undefined){
          if(supportedFileTypes.includes(e.target?.files[0].type)){
            setFile(e.target.files[0])
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
    <Modal title="Add New Resource" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
      <FormWrapper onSubmit={CreateResource} initialValues={item ? item : initialValues}>
        <div>
          <InputField type="text" label="Resource Name" name="ResourceTitle" component={Input} required={true} />
          <InputField type="text" name="Description" component={Input} label="Description" required={true} />

          <Input
            orientation="horizontal"
            field={{value: value, name:"URL/Checklist/Document",onChange: async (_e:any,value:ResourceType)=>{
                setValue(value)
                if(value === '1') {
                    let items = checklists.map((item) => {
                        return {
                            label: item.ChecklistName,
                            value: `Checklist=${item.ChecklistID}`
                        }
                      }
                    )
                    setMapped(items)
                }
            }}}
            type="radio"
            items={items}
        />
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

            <Input
            type="file"
            required={true}
            field={{name: "ResourceUrl", onChange: handleFileInput}}
            accept={supportedFileTypes.join(',')}
            />    
          )
        }
        <InputField type="select" items={Subcategories} name="ResourceCategory" component={Input} label="Select Subcategory" required={true} />
        <InputField
            type="select"
            items={Categories}
            name="ResourceModule"
            component={Input}
            label="Select Module"
            required={true}
          />
        </div>
        <DialogActions>
          <Button type="submit" text="Create Resource" variant="contained" size="large" color="primary" />
          <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
        </DialogActions>
      </FormWrapper>
    </Modal>
  );
};

export default AddResourceForm;

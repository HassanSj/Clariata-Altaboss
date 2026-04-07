import React, { ReactElement, useEffect, useState } from 'react';
import InputField from '~/ui/components/Forms/InputField';
import Input from "~/ui/components/Forms/Input";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import useNotifications from '~/ui/hooks/useNotifications';
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";
import FormWrapper from '~/ui/components/Forms/FormWrapper';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import api from '~/services/api';
import Button from '~/ui/components/Button';
import initialValues from './initialValues';
import { ErrorMessage } from 'formik';
import Modal from '~/ui/components/Dialogs/Modal';
import { DestinyChecklistItem } from '~/types/api/destinyChecklistItem';


const {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    ForeColor,
    BackColor,
    Subscript,
    Superscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml,
    InsertTable,
    AddRowBefore,
    AddRowAfter,
    AddColumnBefore,
    AddColumnAfter,
    DeleteRow,
    DeleteColumn,
    DeleteTable,
    MergeCells,
    SplitCell,
  } = EditorTools;

interface ICategory {
    name: string;
    value: string;
}

const categories: ICategory[] = [
    {
        name: "General Development",
        value: "General Development"
     },
     {
         name: "Governance",
         value: "Governance"
     },
     {
        name: "Governance",
        value: "Governance"
     },
     {
        name: "Family Legacy",
        value: "Family Legacy"
     },
     {
        name: "Next Generation", 
        value: "Next Generation"
     },
     {
        name: "Philanthropy", 
        value: "Philanthropy"
     },
     {
        name: "Succession",
        value: "Succession"
     },
     {
         name: "Other",
         value: "Other"
     }]

interface IFormProps {
    formType?: string;
    item?: DestinyGlobalItem
    closeForm: () => unknown;
    reload: () => unknown;
}

export const Form = ({formType, item, closeForm, reload}: IFormProps ) => {

    const [subcategories, setSubcategories] = useState<ICategory[]>();

    const loadSubcategories = async () =>
    {
        const response = await api.destinySubcategory.getSubcategories();
        const data = await response.data;

        const subcat: ICategory[] = []

        data.map(subcategory => {
            
            let sub: ICategory = {
                name: subcategory.Subcategory,
                value: subcategory.Subcategory
            }

            subcat.push(sub);
            
        })
        console.log(subcat);
        setSubcategories(subcat);
    }

    useEffect(() => {
        loadSubcategories()
      }, []);

    switch(formType) {
        case "Activity":
            return(
                <>
                    <ActivityForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Assessment":
            return(
                <>
                    <AssessmentForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Book":
            return(
                <> 
                    <BookForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Case Study":
            return (
                <>
                    <CaseStudyForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Checklist":
            return (
                <>
                    <ChecklistForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Conference":
            return (
                <>
                    <ConferenceForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Reference (External)":
            return (
                <>
                    <ReferenceExternalForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Reference (Internal)":
            return (
                <>
                    <ReferenceInternalForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Video":
            return (
                <>
                    <VideoForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        case "Podcast":
            return (
                <>
                    <PodcastForm formType={formType} item={item} closeForm={closeForm} reload={reload} subcategories={subcategories}/>
                </>
            )
        default:
            return (
                null
        )
    }
}

const CreateDestinyGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

    const res = await api.destiny.createGlobalItem(destinyGlobalItem);
}

const UpdateDestinyGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

    console.log("Update API");
    console.log(destinyGlobalItem);
    const res = await api.destiny.updateGlobalItem(destinyGlobalItem.ItemId, destinyGlobalItem);
}

interface IBookProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories?: ICategory[];
}

export const BookForm = ({formType, item, closeForm, reload, subcategories}: IBookProps) => {

    const editor = React.createRef<Editor>();
    const [image, setImage] = useState<string | undefined>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<any>(item?.Content);
    const maxSizeInMb = 2;
    const notifications = useNotifications();
    const [actionType, setActionType] = useState<string>("");

    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    }, []);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        console.log(category);
        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        
        
        if(item) {
            console.log("Update");
            console.log(destinyGlobalItem);
            item = destinyGlobalItem;
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            console.log("Insert");
            await CreateDestinyGlobalItem(destinyGlobalItem);
            
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    /**
   * On image change event.
   * @param e
   */
  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files && files[0] && files[0].size/1024/1024 > maxSizeInMb) {
      notifications.addErrorNotification(`File is larger than the max file size of ${maxSizeInMb}mb.`)
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

    return (
        <>
            <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues} modelName="DestinyGlobalItem">
                <Grid container spacing={2}>
                    <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                    <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="text"
                            label="Title"
                            name="Title"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Author"
                        name="Author"
                        component={Input}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Length"
                        name="Duration"
                        component={Input}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Purchase URL"
                        name="PurchaseUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={12} item>
                    <InputField type="textarea"
                            label="Description"
                            name="Description"
                            component={Input}
                            required={true}
                            />
                    
                </Grid>
                <Grid xs={12} item>
                <InputLabel>Content (Objective, Materials Needed, Group Size, Time Required, Procedures):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    value={content}                    
                    ref={editor}
                    
                    />
                </Grid>
            </Grid> 
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 

        
        </>
    )
}

interface IReferenceExternalProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}
export const ReferenceExternalForm = ({formType, item, closeForm, reload, subcategories}: IReferenceExternalProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");

    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    }, []);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;
        
        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }

        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
            <Grid container spacing={2}>
                <Grid xs={4} item >
                <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                    <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
            <Grid container spacing={2}>
                <Grid xs={6} item >
                    <InputField type="text"
                            label="Title"
                            name="Title"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                        label="Source"
                        name="Author"
                        component={Input}
                        required={false}
                        />
                </Grid>                
                <Grid xs={3} item>
                    <InputField type="text"
                            label="Length"
                            name="Length"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        required={false}
                        />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                            label="Link to Reference"
                            name="Url"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={12} item>
                    <InputField type="textarea"
                            label="Summary"
                            name="Description"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={12} item>
                <InputLabel>Content (Objective, Materials Needed, Group Size, Time Required, Procedures):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}
                    
                    />
                </Grid>
            </Grid> 
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface IReferenceInternalProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const ReferenceInternalForm = ({formType, item, closeForm, reload, subcategories}: IReferenceInternalProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>();
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<any>();
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };
    useEffect(() => {


        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            }   
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
        
        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;

        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
            <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                        <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
            <Grid container spacing={2}>
                <Grid xs={6} item >
                    <InputField type="text"
                            label="Title"
                            name="Title"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                        label="Source"
                        name="Author"
                        component={Input}
                        required={false}
                        />
                </Grid> 
                <Grid xs={3} item>
                    <InputField type="text"
                            label="Page Length"
                            name="Duration"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        required={false}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={12} item>
                    <InputField type="textarea"
                            label="Summary"
                            name="Description"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={12} item>
                    <InputLabel>Content:</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}             
                    />
                </Grid>
            </Grid> 
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface IChecklistProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const ChecklistForm = ({formType, item, closeForm, reload, subcategories}: IChecklistProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>();
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<any>();
    const [actionType, setActionType] = useState<string>("");
    const [checklistItems, setChecklistItems] = useState<DestinyChecklistItem[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [checklistName, setChecklistName] = useState<string>("");
    const [referenceUrl, setReferenceUrl] = useState<string>("");
    const [orderNumber, setOrderNumber] = useState<number>(0);
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);
            loadChecklistItems(item.ItemId);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const loadChecklistItems = async (id: number) => {
        const res = await api.destinyChecklist.getChecklistItem(id);
        const checklist = await res.data;

        setChecklistItems(checklist);
    }

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
        
        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }
        
        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;

        if(item) {
            await UpdateDestinyGlobalItem(destinyGlobalItem);

            const res = await api.destiny.updateGlobalItem(item.ItemId, destinyGlobalItem);
            const globalItem : DestinyGlobalItem = await res.data;

            checklistItems.forEach(async (item) => {
                console.log(item);
                if(item.ChecklistItemID > 0) 
                {
                    await api.destinyChecklist.updateChecklistItem(item.ChecklistItemID, item);
                }
                else {
                    item.DestinyGlobalItemID = globalItem.ItemId;
                    await api.destinyChecklist.createChecklistItem(item);
                }
            })
        }
        else {
            const res = await api.destiny.createGlobalItem(destinyGlobalItem);
            const globalItem : DestinyGlobalItem = await res.data;

            checklistItems.forEach(async (item) => {
                console.log(item);
                if(item.ChecklistItemID > 0) 
                {
                    await api.destinyChecklist.updateChecklistItem(item.ChecklistItemID, item);
                }
                else {
                    item.DestinyGlobalItemID = globalItem.ItemId;
                    await api.destinyChecklist.createChecklistItem(item);
                }
            })
            
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    const AddChecklistItem = () => {
        
        let items = checklistItems;

        let checklistItem : DestinyChecklistItem = {
            ChecklistItemID: 0,
            ChecklistItemName: checklistName,
            ReferenceUrl: referenceUrl,
            OrderNumber: orderNumber,
            DestinyGlobalItemID: 0
        }
        
        items.push(checklistItem);        
        setChecklistItems(items);
        setModalOpen(false);
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
            <Grid container spacing={2}>
                    <Grid xs={4} item >
                        <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                        <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={8} item>
                        <InputField type="text"
                        label="Title"
                        name="Title"
                        component={Input}
                        required={true}
                        />
                    </Grid>
                    <Grid xs={8} item>
                        <InputField type="textarea"
                        label="Description"
                        name="Description"
                        component={Input}
                        required={true}
                        />
                    </Grid>
                    <Grid xs={8} item>
                        <Button type="button" text="Add Item" size="large" variant="contained" color="primary" onClick={() => setModalOpen(true)} />
                        <table style={{border: "thin solid #000000", borderCollapse: "collapse", width: "100%" , marginTop: "20px"}}>
                            <tbody>
                            {checklistItems.map((item, i) => {
                                return(
                                    <tr>
                                        <td style={{borderTop: "thin solid #000000", borderBottom: "thin solid #000000", borderLeft: "thin solid #000000", padding: "10px", width: "80%"}} key={i}>
                                            {item.ChecklistItemName}
                                        </td>
                                        <td style={{borderTop: "thin solid #000000", borderBottom: "thin solid #000000", width: "10%"}}><Button variant="text" size="small" text="Edit"/></td>
                                        <td style={{borderTop: "thin solid #000000", borderBottom: "thin solid #000000", borderRight: "thin solid #000000", width: "10%"}}><Button variant="text" size="small" text="Delete"/></td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        
                    </Grid>
                </Grid>
                        <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper>
            <Modal
                title="Add Checklist Item"
                isOpen={modalOpen}
                handleClose={() => setModalOpen(false)}
                width="md"
                submitText="Add"
            >
                <div>
                <InputLabel>Name</InputLabel>
                <TextField type="text" name="checklistName" variant="outlined" onChange={(e) => setChecklistName(e.target.value)} required></TextField>
                </div>
                <div style={{marginTop: "20px"}}>
                <InputLabel>Reference</InputLabel>
                <TextField type="text" name="referenceUrl" variant="outlined" onChange={(e) => setReferenceUrl(e.target.value)} required></TextField>
                </div>
                <DialogActions>
                        <Button
                            type="submit"
                            text="Add"
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={AddChecklistItem}
                        />
                        <Button type="button" text="Cancel" size="large" variant="contained" color="default" />
                    </DialogActions>  
            </Modal>
        </>
    )
}

interface IConferenceProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const ConferenceForm = ({formType, item, closeForm, reload, subcategories}: IConferenceProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);
    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;
        
        if(item) {
            await UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
                <Grid xs={4} item >
                        <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                        <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
            <Grid container spacing={2}>
                <Grid xs={6} item >
                    <InputField type="text"
                            label="Class/Conference Title"
                            name="Title"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={6} item >
                    <InputField type="text"
                            label="Date"
                            name="StartDate"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                        label="Organizer"
                        name="Author"
                        component={Input}
                        required={true}
                        />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                            label="Location"
                            name="Location"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                            label="Length"
                            name="Duration"
                            component={Input}
                            required={false}
                            />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                            label="Link"
                            name="Url"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={12} item>
                    <InputField type="textarea"
                            label="Description"
                            name="Description"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={12} item>
                <InputLabel>Content: (Who Should Attend, Enrollment Requirements)</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}                  
                    />
                </Grid>
            </Grid>  
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface IActivityProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const ActivityForm = ({formType, item, closeForm, reload, subcategories}: IActivityProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;

        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                        <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
            <Grid container spacing={2}>
                <Grid xs={6} item >
                    <InputField type="text"
                            label="Title"
                            name="Title"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={6} item>
                    <InputField type="text"
                        label="Source"
                        name="Author"
                        component={Input}
                        required={false}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        required={false}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Length"
                        name="Duration"
                        component={Input}
                        required={false}
                        />
                </Grid>
                <Grid xs={3} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
                <Grid xs={12} item>
                    <InputField type="textarea"
                            label="Description"
                            name="Description"
                            component={Input}
                            required={true}
                            />
                </Grid>
                <Grid xs={12} item>
                <InputLabel>Content (Objective, Materials Needed, Group Size, Time Required, Procedures):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}
                    
                    />
                </Grid>
            </Grid> 
            <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface IVideoProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}
export const VideoForm = ({formType, item, closeForm, reload, subcategories}: IVideoProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        
        if(item) {
            console.log("Update Start");
            console.log(destinyGlobalItem);
            console.log("Update End");
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
            </Grid>
        <Grid container spacing={2}>
            <Grid xs={6} item >
                <InputField type="text"
                        label="Title"
                        name="Title"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Duration"
                        name="Duration"
                        component={Input}
                        />
            </Grid>
            <Grid xs={6} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        />
                </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                    label="Producer"
                    name="Author"
                    component={Input}
                    />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Link"
                        name="Url"
                        component={Input}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputField type="textarea"
                        label="Description"
                        name="Description"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputLabel>Content (Objective, Materials Needed, Group Size, Time Required, Procedures):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}
                    
                    />
                </Grid>
        </Grid> 
        <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface IPodcastProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}
export const PodcastForm = ({formType, item, closeForm, reload, subcategories}: IPodcastProps) => {

    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;
        
        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
                <Grid xs={4} item >
                <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
            </Grid>
        <Grid container spacing={2}>
            <Grid xs={6} item >
                <InputField type="text"
                        label="Title"
                        name="Title"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Duration"
                        name="Duration"
                        component={Input}
                        />
            </Grid>
            <Grid xs={6} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        />
                </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                    label="Producer"
                    name="Author"
                    component={Input}
                    />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Link"
                        name="Url"
                        component={Input}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputField type="textarea"
                        label="Description"
                        name="Description"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputLabel>Content (Objective, Materials Needed, Group Size, Time Required, Procedures):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}
                    
                    />
                </Grid>
        </Grid> 
        <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}

interface ICaseStudyProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const CaseStudyForm = ({formType, item, closeForm, reload, subcategories}: ICaseStudyProps) => {
    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;
        
        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
            <Grid xs={4} item >
                <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                    <Grid xs={4} item >
                    <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                    </Grid>
                </Grid>
            <Grid container spacing={2}>
            <Grid xs={6} item >
                <InputField type="text"
                        label="Title"
                        name="Title"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={3} item>
                    <InputField type="text"
                        label="Date"
                        name="StartDate"
                        component={Input}
                        required={false}
                        />
                </Grid>
            <Grid xs={3} item>
                <InputField type="text"
                        label="Page Length"
                        name="Duration"
                        component={Input}
                        required={false}
                        />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                    label="Source"
                    name="Author"
                    component={Input}
                    required={false}
                    />
            </Grid>
            <Grid xs={6} item>
                <InputField type="text"
                        label="Case Study Link"
                        name="Url"
                        component={Input}
                        required={false}
                        />
            </Grid>
            <Grid xs={6} item>
                    <InputField type="text"
                        label="Image URL"
                        name="ImageUrl"
                        component={Input}
                        />
                </Grid>
            <Grid xs={12} item>
                <InputField type="textarea"
                        label="Description"
                        name="Description"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={12} item>
                {item?.Content}
                </Grid>
            <Grid xs={12} item>
                <InputLabel>Content (Objective, Questions, Case Study Information):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"  
                    defaultContent={content}      
                    ref={editor}        
                    />
            </Grid>
        </Grid>     
        <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper>         
        </>
    )
}

interface IAssessmentProps {
    formType: string;
    item?: DestinyGlobalItem;
    closeForm: () => unknown;
    reload: () => unknown;
    subcategories: ICategory[] | undefined;
}

export const AssessmentForm = ({formType, item, closeForm, reload, subcategories}: IAssessmentProps) => {
    const editor = React.createRef<Editor>();
    const [category, setCategory] = useState<any>(item?.Category);
    const [subcategory, setSubcategory] = useState<any>(item?.Subcategory);
    const [content, setContent] = useState<string | undefined>(item?.Content)
    const [actionType, setActionType] = useState<string>("");
    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        console.log("Category: " + value)
        setCategory(value);
      };

    useEffect(() => {
        if(item) {
            setCategory(item.Category);
            setContent(item.Content);
            setActionType("Update");
            setSubcategory(item.Subcategory);

            if(editor) {
                const view = editor?.current?.view; 
                if(view) {             
                    EditorUtils.setHtml(view, item.Content);
                }
            } 
        }
        else {
            setActionType("Create")
        }
    },[]);

    const createGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {

        let info: string = ""

        if (editor.current) {
            const view = editor.current.view;
            if (view) {              
                info = EditorUtils.getHtml(view.state);
            }
        }

        destinyGlobalItem.ItemType = formType;
        //destinyGlobalItem.Category = category;
        destinyGlobalItem.Content = info;
        //destinyGlobalItem.Subcategory = subcategory;
        
        if(item) {
            UpdateDestinyGlobalItem(destinyGlobalItem);
        }
        else {
            await CreateDestinyGlobalItem(destinyGlobalItem);
        }
        reload();
        closeForm();
    }

    const onClose = () => {
        closeForm();
    }

    return (
        <>
        <FormWrapper onSubmit={createGlobalItem} initialValues={item ? item : initialValues}>
        <Grid container spacing={2}>
                <Grid xs={4} item >
                    <InputField type="select"
                              name="Category"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Category"
                              label="Category"
                              items={categories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
                <Grid xs={4} item >
                <InputField type="select"
                              name="Subcategory"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Subcategory"
                              label="Subcategory"
                              items={subcategories}
                              labelField="name"
                              valueField="value"
                              required={true}/>
                </Grid>
            </Grid>
        <Grid container spacing={2}>
            <Grid xs={6} item>
                <InputField type="text"
                    label="Source"
                    name="Author"
                    component={Input}
                    />
            </Grid>
            <Grid xs={6} item >
                <InputField type="text"
                        label="Title"
                        name="Title"
                        component={Input}
                        required={true}
                        />
            </Grid>            
            <Grid xs={6} item>
                <InputField type="text"
                        label="Link"
                        name="Url"
                        component={Input}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputField type="textarea"
                        label="Description"
                        name="Description"
                        component={Input}
                        required={true}
                        />
            </Grid>
            <Grid xs={12} item>
                <InputLabel>Content (Other Information):</InputLabel> 
                    <Editor
                    tools={[
                        [Bold, Italic, Underline, Strikethrough],
                        [ForeColor, BackColor],
                        [FormatBlock],
                        [Subscript, Superscript],
                        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                        [Indent, Outdent],
                        [OrderedList, UnorderedList],
                        [Undo, Redo],
                        [Link, Unlink, InsertImage, ViewHtml],
                        [InsertTable],
                        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
                        [DeleteRow, DeleteColumn, DeleteTable],
                        [MergeCells, SplitCell],
                    ]}
                    contentStyle={{ height: 300 }}
                    defaultEditMode="div"
                    defaultContent={content} 
                    ref={editor}
                    
                    />
                </Grid>
        </Grid> 
        <DialogActions>
                <Button
                    type="submit"
                    text={actionType + " " + formType + " Item"}
                    variant="contained"
                    size="large"
                    color="primary"
                />
                <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
            </DialogActions>   
            </FormWrapper> 
        </>
    )
}
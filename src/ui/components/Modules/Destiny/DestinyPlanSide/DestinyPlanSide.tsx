import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, DialogActions, Grid, Icon, IconButton, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import Modal from "~/ui/components/Dialogs/Modal";
import { Person } from '~/types/api/person';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import DestinyPlanItem from '../DestinyPlanItem/DestinyPlanItem';
import api from '~/services/api';
import FormWrapper from '~/ui/components/Forms/FormWrapper';
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import Button from "~/ui/components/Button";
import { DevelopmentPlan } from '~/types/api/developmentPlan';
import { useStoreState } from '~/store/hooks';
import initialValues from './form/initialvalues';
import useDataPagination from '~/ui/hooks/useDataPagination';
import { CategoryItem, SubcategoryItem } from '~/ui/pages/Destiny/Destiny';
import { SortDirection } from '~/ui/constants/data';
import SelectDate from '~/ui/components/Forms/SelectDate';
import useUserInput from '~/ui/hooks/useUserInput';
import DestinyItem from '../DestinyItem';

interface DestinyPlanSideProps {
    IsModalOpen: boolean;
    OpenModal: any;
    CloseModal: any;
    CreatePlan: any;
    OnChange: any;
    DevelopmentPlans?: DevelopmentPlan[];
    AddItemToFamilyMember: any;
    GlobalItems: CategoryItem[];
}

const AddItem = (itemId: number) => {
    // Call API to Add Item to Selected Family Member
}

const DestinyPlanSide = ({IsModalOpen, OpenModal, CloseModal, CreatePlan, OnChange, DevelopmentPlans, AddItemToFamilyMember, GlobalItems} : DestinyPlanSideProps) => {
    const [categories, setCategories] = useState<CategoryItem[]>([]); 
    const [filtered, setFiltered] = useState<CategoryItem[]>([]); 
    const {selectedHousehold} = useStoreState((state) => state.household);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<DestinyGlobalItem>();
    const dateRangeStartValue = useUserInput(null);
    const dateRangeEndValue = useUserInput(null);
    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(GlobalItems, 8, 'Title');
    

    const ViewItem = (item?: DestinyGlobalItem) => {
        console.log(item);
        setSelectedItem(item);
        setDetailsDialogOpen(true);
    }

    const CloseItem = () => {
        setDetailsDialogOpen(false);
    }

    const handleSearch = (event: any) => {
        // let value = event.target.value.toLowerCase();
        // let result: DestinyGlobalItem[] = [];
        // GlobalItems.forEach(category => {
        //     category.subcategories.filter((data: SubcategoryItem) => {
        //         if(data.subcategories.toLowerCase().search(value) != -1) {
        //             result.push(data);
        //         }
        //     })
        // });
    }

    const AddItem = (id: number) => {

        AddItemToFamilyMember(id);
    }

    return (
        <>
            <div style={{marginBottom: "15px", display: "flex"}}>
                <div style={{marginRight: "15px"}}>
                <Button type="button" text="Create Plan" size="large" variant="contained" color="primary" onClick={OpenModal}/>
                <Modal title="Create Development Plan" isOpen={IsModalOpen} handleClose={CloseModal} width="xs" hideFooter={true}>
                        <FormWrapper onSubmit={CreatePlan} initialValues={initialValues}>        
                                <div>
                                    <InputField type="text"
                                        label="Plan Name"
                                        name="PlanName"
                                        component={Input}
                                        required={true}
                                    />
                                    <InputField type="date"
                                        name="PlanStartDate"
                                        component={SelectDate}
                                        placeholder="Start Date"
                                        label="Start Date"
                                        value="0"
                                    />
                                    <InputField type="date"
                                        name="PlanEndDate"
                                        component={SelectDate}
                                        placeholder="End Date"
                                        label="End Date"
                                        value="0"
                                    />
                                </div>
                                <DialogActions>
                                    <Button
                                        type="submit"
                                        text="Create"
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                    />
                                    <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={CloseModal} />
                                </DialogActions>   
                                </FormWrapper>             
                </Modal>
                </div>
                <div>
                <Select onChange={event => OnChange(event.target.value)} style={{width: "150px", padding: "5px 10px", borderRadius: "2px"}} >
                <option value="0">Select a Plan</option>
                    {DevelopmentPlans?.map(plan => {
                        console.log(plan);
                        return (
                            <MenuItem value={plan.DevelopmentPlanId} key={plan.DevelopmentPlanId}>{plan.PlanName}</MenuItem>
                        )}  
                    )}                                        
                </Select>
                </div>
            </div>
            <div>
                {GlobalItems.map(cat => {
                    return (
                            <Accordion key={cat.category + cat.category.length}>
                                <AccordionSummary style={{backgroundColor: "#EEF8F7"}}>
                                    <h4>{cat.category}</h4>
                                </AccordionSummary>
                                <AccordionDetails style={{display: "block", padding: "0px 0px"}}>
                                    {cat?.subcategories?.map(subcat => {
                                        return (
                                            <>
                                            <SubcategoryAccordion subcat={subcat} ViewItem={ViewItem} AddItem={AddItem} />
                                            <br/> 
                                            </>                                           
                                        )})}
                                </AccordionDetails>
                                
                            </Accordion>
                        );
                    })
                }
            </div>
            { selectedItem ?
            <Modal
                isOpen={detailsDialogOpen}
                handleClose={CloseItem}
                closeText="Close"
                width="md" title={undefined}>
                <DestinyItem item={selectedItem} />
            </Modal>
            : null }
            </>
            
    )
}

export default DestinyPlanSide;

interface SubcategoryAccordionProps {
    subcat: SubcategoryItem;
    ViewItem: any;
    AddItem: any
}

const SubcategoryAccordion = ({subcat, ViewItem, AddItem}: SubcategoryAccordionProps) => {

    return (
        <Accordion key={subcat.subcategory}>                                                
                                                <AccordionSummary style={{paddingLeft: "25px"}}>
                                                    <h4>{subcat.subcategory}</h4>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        {subcat?.items?.map(item => {
                                                                return(
                                                                    <>
                                                                        <Grid item xs={8} style={{fontSize: "12px", marginBottom: "5px"}}>
                                                                            <div>
                                                                                <Tooltip title={item.Description} placement="right-start">                                                            
                                                                                    <div style={{fontSize: "16px", textDecoration: "underline"}}>{item.Title}</div>
                                                                                </Tooltip>
                                                                                <div>{item.ItemType}</div>
                                                                            </div>
                                                                        </Grid>
                                                                        <Grid item xs={2} style={{marginBottom: "5px"}}>
                                                                            <Button key={item.ItemId} type="button" text="View" size="small" variant="contained" color="primary" onClick={() => {
                                                                                ViewItem(item);
                                                                            }}/>
                                                                        </Grid>
                                                                        <Grid item xs={2} style={{marginBottom: "5px"}}>
                                                                            <Button key={item.ItemId} type="button" text="Add" size="small" variant="contained" color="warning" onClick={() => {
                                                                                AddItem(item.ItemId);
                                                                            }}/>
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
    )
}

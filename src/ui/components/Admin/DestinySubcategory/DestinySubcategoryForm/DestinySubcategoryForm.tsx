import { Card, CardHeader, DialogActions, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DestinySubcategory } from "~/types/api/destinySubcategory";
import { AdminNavigationTab } from "~/ui/constants/navigations";
import useMountEvents from "~/ui/hooks/useMountEvents";
import AdminWrapper from "../../AdminWrapper";
import SubcategoryForm from "./form/SubcategoryForm";

interface IProps {
    subcategoryItem?: DestinySubcategory;
    onClose: () => unknown;
    reload: () => unknown;
}

const DestinySubcategoryForm = ({ subcategoryItem, onClose, reload }: IProps) => {
    
    return (
        <>
        <AdminWrapper tab={AdminNavigationTab.SUBCATEGORIES}>
                <Card>
                <CardHeader
                    title="Destiny Subcategories"
                    action={
                    <>
                    <div>
                    </div>
                    </>
                    }
                />        
                <div>
                    
                </div>
                <SubcategoryForm Subcategory={subcategoryItem} closeForm={onClose} reload={reload} />                  
            </Card>
            </AdminWrapper>          
        </>
    )
}

export default DestinySubcategoryForm;
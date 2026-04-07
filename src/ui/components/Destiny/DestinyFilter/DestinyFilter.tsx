import { Grid, Icon, IconButton, TextField, Tooltip } from "@material-ui/core";
import styles from './DestinyFilter.module.scss';
import { CategoryItem, SubcategoryItem } from "~/ui/pages/Destiny/Destiny";
import MultiSelectFilterDestiny from "../../Data/MultiSelectFilter/MultiSelectFilterDestiny";
import useUserInput from '~/ui/hooks/useUserInput';
import useSearchable from '~/ui/hooks/useSearchable';
import useDestinySubcategorySearchables from '~/ui/hooks/useDestinySubcategorySearchables';
import useSearchables from '~/ui/hooks/useSearchables';
import { DestinyGlobalItem } from "~/types/api/destinyGlobalItem";
import { getObjectiveGroupingMap } from "~/ui/constants/tasks";
import useGroupables from '~/ui/hooks/useGroupables';
import { isNullOrUndefined } from 'util';
import {
    MultiSelect,
    MultiSelectChangeEvent,
  } from "@progress/kendo-react-dropdowns"
import { useState } from "react";

interface IDestinyFilterProps {
    categories: string[];
    subcategories: string[];
    itemTypes: string[];
    // selectedCategories: string[];
    // selectedSubcategories: string[];
    // selectedItemTypes: string[];
    onCategorySelected: any;
    onSubcategorySelected: any;
    onItemTypeSelected: any;
    filterVisible: boolean
    showFilter: any;

}

const DestinyFilter = ({categories, subcategories, itemTypes, onCategorySelected, onSubcategorySelected, onItemTypeSelected, filterVisible, showFilter} : IDestinyFilterProps) => {

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);

  const onCategoryChange = (event: MultiSelectChangeEvent) => {
    setSelectedCategories(event.value)
    onCategorySelected(event.value);
  }

  const onSubcategoryChange = (event: MultiSelectChangeEvent) => {
    setSelectedSubcategories(event.value);
    onSubcategorySelected(event.value);
  }

  const onItemTypeChange = (event: MultiSelectChangeEvent) => {
    setSelectedItemTypes(event.value);
    onItemTypeSelected(event.value);
  }

    return (
        <div style={{ marginBottom: "25px", marginLeft: "40px"}}>
            <div>
            <Tooltip title="Enable/Disable Filters">
              <IconButton style={{color: filterVisible ? '#f25a2a' : '#737373'}} 
              className={styles.filter}
                          onClick={async () => {
                              await showFilter();
                          }}>
                  <Icon>filter_alt</Icon>
              </IconButton>
            </Tooltip>
            </div>
            <div style={{display: filterVisible ? "block" : "none"}}>
              <div style={{display: "flex", flexDirection: "row", marginBottom: "20px"}}>                  
                    <h5 className={styles.filterLabel}>Categories</h5>
                    <MultiSelect
                    data={categories}
                    onChange={onCategoryChange}
                    value={selectedCategories}
                  
                    placeholder="Filter Categories"
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", marginBottom: "20px"}}>    
                  <h5 className={styles.filterLabel}>Subcategories</h5>                  
                  <MultiSelect
                    data={subcategories}
                    onChange={onSubcategoryChange}
                    value={selectedSubcategories}
                    className={styles.clariataMultiselect}
                    placeholder="Filter SubCategories"
                    />                    
                </div>
                <div style={{display: "flex", flexDirection: "row", marginBottom: "20px"}}>    
                  <h5 className={styles.filterLabel}>Item Type</h5>
                  <MultiSelect
                    data={itemTypes}
                    onChange={onItemTypeChange}
                    value={selectedItemTypes}
                    className={styles.clariataMultiselect}
                    placeholder="Filter Item Types"
                    />
                </div> 
            </div>               
        </div>
    );
}

export default DestinyFilter;
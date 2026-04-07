import { Card, CardHeader, DialogActions, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DestinyGlobalItem } from "~/types/api/destinyGlobalItem";
import { AdminNavigationTab } from "~/ui/constants/navigations";
import useMountEvents from "~/ui/hooks/useMountEvents";
import AdminWrapper from "../../AdminWrapper";
import { Form } from "./form/formTypes";

interface IProps {
    item?: DestinyGlobalItem;
    onClose: () => unknown;
    reload: () => unknown;
}

const DestinyForm = ({ item, onClose, reload }: IProps) => {
    const [formType, setFormType] = useState(item?.ItemType);
    const [formTypes, setFormTypes] = useState<string[]>([]);

    
    // const CreateDestinyGlobalItem = async (destinyGlobalItem: DestinyGlobalItem) => {
    //     console.log(destinyGlobalItem);
    //     destinyGlobalItem.Category = category;
    //     destinyGlobalItem.ItemType = formType;
    //     if(formType == "Reference (Internal)") {
    //         destinyGlobalItem.
    //     }
    //     const res = await api.destiny.createGlobalItem(destinyGlobalItem);
    //     onClose();
    //   }

    const loadData = () => {
        const types: string[] = ["Activity", "Assessment", "Book", "Case Study", "Checklist",  "Conference", "Podcast", "Reference (External)", "Reference (Internal)", "Video", "Presentation"];
        setFormTypes(types);
    }
    
    const changeFormType = (type: any) => {
        setFormType(type);
        console.log("FormType:" + type);
    }
    
    useMountEvents({
        onMounted: async () => {
          loadData();
        },
      });

    return (
        <>
        <AdminWrapper tab={AdminNavigationTab.GLOBAL_ITEMS}>
                <Card>
                <CardHeader
                    title="Destiny Global Items"
                    action={
                    <>
                    <div>
                    </div>
                    </>
                    }
                />        
                <div>
                    <InputLabel style={{marginLeft: "15px", marginBottom: "10px"}}>Item Type:</InputLabel> 
                    <Select style={{width: "200px", marginBottom: "25px", marginLeft: "15px", padding: "10px"}} value={item?.ItemType} onChange={event => {changeFormType(event.target.value)}} required={true} >
                        {formTypes.map((type) => (
                            <MenuItem
                                key={type}
                                value={type}
                                >{type}</MenuItem>
                        )
                        )}
                    </Select>
                </div>
                <Form formType={formType} item={item} closeForm={onClose} reload={reload} />                  
            </Card>
            </AdminWrapper>          
        </>
    )
}

export default DestinyForm;
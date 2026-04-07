import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import {Checkbox} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";

const CompletedItem = ({props}: any) => {
    const [checked, setChecked] = React.useState<boolean>(props?.checklistItem?.IsComplete as boolean);
    const notifications = useNotifications();
    
    const handleChange = async () => {

        notifications.toggleLoading(true);
        if (checked) {
            setChecked(false);
            try {
                props.checklistItem.IsComplete = false;
                const res = await api.householdChecklist.updateHouseholdChecklistItem(props.checklistItem.HouseholdChecklistItemID, props.checklistItem);
            } catch (err) {
                processServerError(err, 'household.populateHouseholdDirectionTaskProgress');
            }
        } else {
            setChecked(true);
            try {
                props.checklistItem.IsComplete = true;
                const res = await api.householdChecklist.updateHouseholdChecklistItem(props.checklistItem.HouseholdChecklistItemID, props.checklistItem);
            } catch (err) {
                processServerError(err, 'household.populateHouseholdDirectionTaskProgress');
            }
        }
        notifications.toggleLoading(false);
    }

    return (
        <>
            <DataTableCell>
                <div style={{marginLeft: "auto", marginRight: "auto"}}>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{'aria-label': 'primary checkbox'}}
                />
                </div>
            </DataTableCell>
        </>
    )
}

export default CompletedItem;

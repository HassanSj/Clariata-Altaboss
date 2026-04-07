import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import {Checkbox} from "@material-ui/core";
import {useStoreState} from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {populateHouseholdDirectionTaskProgress} from "~/ui/constants/household";
import {processServerError} from "~/services/api/errors";
import household from "~/store/household";

const CompletedTaskTemplate = ({props}: IPriorityItemCellTemplateConfig) => {

    const {selectedHousehold,households} = useStoreState(state => state.household);
    const [checked, setChecked] = React.useState<boolean>(props?.directionTask?.Completed as boolean);
    const notifications = useNotifications();
    
    const handleChange = async () => {

        notifications.toggleLoading(true);
        if (checked) {
            setChecked(false);
            try {
                await api.directionprogress.remove(
                    selectedHousehold?.HouseholdID,
                    props?.directionTask?.TaskID as number);

                await populateHouseholdDirectionTaskProgress(selectedHousehold);
            } catch (err) {
                processServerError(err, 'household.populateHouseholdDirectionTaskProgress');
            }
        } else {
            setChecked(true);
            try {
                await api.directionprogress.complete(
                    selectedHousehold?.HouseholdID,
                    props?.directionTask?.TaskID as number);

                await populateHouseholdDirectionTaskProgress(selectedHousehold);
            } catch (err) {
                processServerError(err, 'household.populateHouseholdDirectionTaskProgress');
            }
        }
        notifications.toggleLoading(false);
    }

    return (
        <>
            {/* <DataTableCell inputProps={{
        type: 'text',
        label: 'Complete',
        field: {
          name: 'Completed',
          value: props?.directionTask?.Completed
        }
      }}> */}
            <DataTableCell>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{'aria-label': 'primary checkbox'}}
                />
            </DataTableCell>
        </>
    )
}

export default CompletedTaskTemplate;

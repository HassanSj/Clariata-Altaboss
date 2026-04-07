import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {ListItem, ListItemText} from "@material-ui/core";
import React from "react";

const AssistanceNeededTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: [
            {label: 'Yes, assistance is needed', value: true },
            {label: 'No, assistance is not needed', value: false }
          ],
          label: 'Is assistance needed to fulfill this priority?',
          field: {
            name:'AssistanceNeeded',
            value: props?.objective?.AssistanceNeeded
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        {!isNullOrUndefined(props?.objective?.AssistanceNeeded) ?
          <ListItem>
            <ListItemText primary={props?.objective?.AssistanceNeeded ? 'Yes' : 'No'}/>
          </ListItem>
          : null}
      </DataTableCell>
    </>
  )
}

export default AssistanceNeededTemplate;

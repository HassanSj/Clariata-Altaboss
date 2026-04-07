import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {ListItem, ListItemText} from "@material-ui/core";
import React from "react";

const AssistanceNeededTemplate = ({ props }: IActionItemCellTemplateConfig) => {
    const isAssisted = props?.item?.AssistanceNeeded === 1
    const isDIY = props?.item?.AssistanceNeeded === 2
    return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: [
              {label: "", value: 0},
            {label: 'Yes, assistance is needed', value: 1 },
            {label: 'No, assistance is not needed', value: 2 }
          ],
          label: 'Is assistance needed to fulfill this task?',
          field: {
            name:'AssistanceNeeded',
            value: props?.item?.AssistanceNeeded
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        {!isNullOrUndefined(props?.item?.AssistanceNeeded) ?
          <ListItem>
              {isAssisted ? <ListItemText primary={'Assisted'}/> : null}
              {isDIY ? <ListItemText primary={'DIY'}/> : null}
          </ListItem>
          : null}
      </DataTableCell>
    </>
  )
}

export default AssistanceNeededTemplate;

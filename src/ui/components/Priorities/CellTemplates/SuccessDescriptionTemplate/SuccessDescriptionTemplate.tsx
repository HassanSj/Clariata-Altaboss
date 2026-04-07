import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import {MAX_CELL_STR_LENGTH} from "~/ui/components/Priorities/PriorityItem/PriorityItem";

const SuccessDescriptionTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'textarea',
          label: 'How will you know you are successful?',
          field: {
            name:'SuccessDescription',
            value:props?.objective?.SuccessDescription
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <StringValue value={props?.objective?.SuccessDescription} maxLength={MAX_CELL_STR_LENGTH}/>
      </DataTableCell>
    </>
  )
}

export default SuccessDescriptionTemplate;
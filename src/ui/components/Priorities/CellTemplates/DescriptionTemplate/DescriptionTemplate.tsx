import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";

const DescriptionTemplate = ({props}: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell inputProps={{
        type: 'text',
        label: 'Description',
        field: {
          name: 'Description',
          value: props?.objective?.Description
        }
      }}
                     onSave={(e) => {
                      props?.onSelect(); 
                      props?.onUpdateFields(e);
                     }}>
        <StringValue value={props?.objective?.Description} maxLength={5000} wrap={"normal"}/>
      </DataTableCell>
    </>
  )
}

export default DescriptionTemplate;

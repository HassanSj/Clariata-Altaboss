import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";

const DescriptionTemplate = ({ props }: IActionItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'text',
          label: 'Description',
          field: {
            name:'Description',
            value:props?.item?.Description
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        {props?.item?.Description}
      </DataTableCell>
    </>
  )
}

export default DescriptionTemplate;

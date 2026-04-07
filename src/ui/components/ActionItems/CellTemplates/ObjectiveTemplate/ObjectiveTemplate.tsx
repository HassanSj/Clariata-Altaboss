import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {isNullOrUndefined} from "~/ui/constants/utils";
import React from "react";

const ObjectiveTemplate = ({ props }: IActionItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell isLoading={props?.objective?.ObjectiveID ? isNullOrUndefined(props?.objective) : false}
                     inputProps={{
                       type: 'select',
                       labelField: 'Description',
                       valueField: 'ObjectiveID',
                       items: props?.objectives,
                       label: 'Objective',
                       field: {
                         name:'ObjectiveID',
                         value:props?.item?.ObjectiveID
                       }
                     }}
                     onSave={(e) => props?.onUpdateFields(e)}>
        {props?.objective?.Description}
      </DataTableCell>
    </>
  )
}

export default ObjectiveTemplate;
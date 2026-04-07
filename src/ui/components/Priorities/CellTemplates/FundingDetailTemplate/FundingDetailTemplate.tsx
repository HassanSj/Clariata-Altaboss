import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import {MAX_CELL_STR_LENGTH} from "~/ui/components/Priorities/PriorityItem/PriorityItem";

const FundingDetailTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'textarea',
          label: 'Additional funding information',
          field: {
            name:'FundingDetail',
            value:props?.objective?.FundingDetail
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <StringValue value={props?.objective?.FundingDetail} maxLength={MAX_CELL_STR_LENGTH}/>
      </DataTableCell>
    </>
  )
}

export default FundingDetailTemplate;
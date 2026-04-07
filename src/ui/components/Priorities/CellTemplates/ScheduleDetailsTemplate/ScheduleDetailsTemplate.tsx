import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import {MAX_CELL_STR_LENGTH} from "~/ui/components/Priorities/PriorityItem/PriorityItem";

const ScheduleDetailsTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'textarea',
          label: 'Schedule detail (e.g. 8:00 AM, Wednesdays, First Monday of the month, Annually on Dec 1st)',
          field: {
            name:'ScheduleDetail',
            value:props?.objective?.ScheduleDetail
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <StringValue value={props?.objective?.ScheduleDetail} maxLength={MAX_CELL_STR_LENGTH}/>
      </DataTableCell>
    </>
  )
}

export default ScheduleDetailsTemplate;
import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";

const TaskTemplate = ({props}: IPriorityItemCellTemplateConfig) => {

  return (
    <>
      {/* <DataTableCell inputProps={{
        type: 'text',
        label: 'Task Name',
        field: {
          name: 'TaskName',
          value: props?.directionTask?.TaskName
        }
      }}> */}
      <DataTableCell>
        <StringValue value={props?.directionTask?.TaskName} maxLength={100} />
      </DataTableCell>
    </>
  )
}

export default TaskTemplate;

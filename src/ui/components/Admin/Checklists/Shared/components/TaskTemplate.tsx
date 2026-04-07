import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import { IChecklistItemCellTemplateConfig } from "~/types/checklist/checklistItem";

const TaskTemplate = ({props}:IChecklistItemCellTemplateConfig) => {
    return (
      <>
        <DataTableCell
          inputProps={{
            type: 'text',
            label: 'Task',
            field: {
              name: 'Task',
              value: props?.checklistitem?.ChecklistItemTask,
            },
          }}
          editable={false}
        >
          <StringValue value={`${props?.checklistitem?.ChecklistItemTask ?? 0}`} maxLength={50} />
        </DataTableCell>
      </>
    );
}

export default TaskTemplate;
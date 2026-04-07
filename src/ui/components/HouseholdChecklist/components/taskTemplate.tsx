import DataTableCell from '~/ui/components/Data/DataTableCell';
import React from 'react';
import StringValue from '~/ui/components/Data/Formatters/StringValue';

const TaskTemplate = ({ props }: any) => {
  return (
    <>
      <DataTableCell>
        {' '}
        <p
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'initial',
            width: '734px',
          }}
        >
          {props?.checklistItem?.ChecklistItemTask}
          {/* <StringValue value={props?.checklistItem?.ChecklistItemTask} maxLength={100} /> */}
        </p>
      </DataTableCell>
    </>
  );
};

export default TaskTemplate;

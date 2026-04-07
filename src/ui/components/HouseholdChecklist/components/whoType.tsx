import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";

const whoType = ({props}: any) => {
  
  return (
    <>
      <DataTableCell>
        <StringValue value={props?.checklistItem?.ChecklistItemWho} maxLength={50} />
      </DataTableCell>
    </>
  )
}

export default whoType;

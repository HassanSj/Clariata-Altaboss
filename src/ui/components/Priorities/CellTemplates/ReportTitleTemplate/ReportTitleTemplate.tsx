import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";

const ReportTitleTemplate = ({props}: IPriorityItemCellTemplateConfig) => {

  return (
    <>
      {/* <DataTableCell inputProps={{
        type: 'text',
        label: 'Report Title',
        field: {
          name: 'TaskTitle',
          value: props?.directionTask?.TaskTitle
        }
      }}> */}
      <DataTableCell>
        <StringValue value={props?.directionTask?.TaskTitle} maxLength={100} />
      </DataTableCell>
    </>
  )
}

export default ReportTitleTemplate;

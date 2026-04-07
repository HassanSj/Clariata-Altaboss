import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";
import { IChecklistItemCellTemplateConfig } from "~/types/checklist/checklistItem";

const OrderTemplate = ({props}:IChecklistItemCellTemplateConfig) => {
    return (
      <>
        <DataTableCell
          inputProps={{
            type: 'text',
            label: 'Order',
            field: {
              name: 'Order',
              value: props?.checklistitem?.OrderNumber,
            },
          }}
          editable={false}
        >
          <StringValue value={`${props?.checklistitem?.OrderNumber ?? 0}`} maxLength={50} />
        </DataTableCell>
      </>
    );
}

export default OrderTemplate;
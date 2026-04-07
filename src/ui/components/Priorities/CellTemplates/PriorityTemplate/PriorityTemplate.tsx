import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {ListItem, ListItemText} from "@material-ui/core";
import DateValue from "~/ui/components/Data/Formatters/DateValue";
import {DateFormatType} from "~/ui/components/Data/Formatters/DateValue/DateValue";
import React from "react";
import {isValidDate} from "~/ui/constants/utils";

const PriorityTemplate = ({ props }: IPriorityItemCellTemplateConfig) => {
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'select',
          labelField: 'label',
          valueField: 'value',
          items: [
            {label: 'Now', value: true },
            {label: 'Later', value: false }
          ],
          label: 'Prioritize now or later?',
          field: {
            name:'PriorityNow',
            value:props?.objective?.PriorityNow
          }
        }}
        onSave={(e) => props?.onUpdateFields(e)}>
        <ListItem>
          <ListItemText primary={props?.objective?.PriorityNow ? 'Now' : 'Later'}
                        secondary={
                          <>
                            <DateValue dateString={isValidDate(props?.objective?.StartDate) ? props?.objective?.StartDate?.toString() : undefined}
                                       format={DateFormatType.DATE_SHORT}/>
                            <DateValue dateString={isValidDate(props?.objective?.ProjectedEndDate) ? props?.objective?.ProjectedEndDate?.toString() : undefined}
                                       format={DateFormatType.DATE_SHORT}/>
                          </>
                        }/>
        </ListItem>
      </DataTableCell>
    </>
  )
}

export default PriorityTemplate;

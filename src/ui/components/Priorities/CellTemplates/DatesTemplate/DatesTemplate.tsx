import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import DateValue from "~/ui/components/Data/Formatters/DateValue";
import {convertStringToDate, convertStringToDateText, defaultDate, getDateType, isValidDate, validateDateText} from "~/ui/constants/utils";
import {DateFormatType} from "~/ui/components/Data/Formatters/DateValue/DateValue";
import Input from "~/ui/components/Forms/Input";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import { MAX_CELL_STR_LENGTH } from "../../PriorityItem/PriorityItem";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

let message = ""

const DatesTemplate = ({props}: IPriorityItemCellTemplateConfig) => {
  const [invalidDate, setInvalidDate] = React.useState<boolean>(false);

  const handleErrorClose = () => {
    setInvalidDate(false);
  }
  
  return (
    <>
      <DataTableCell
        inputProps={{
          type: 'datetext',
          label: 'Start Date',
          field: {
            name: 'StartDate',
            value: props?.objective?.StartDate && new Date(props?.objective?.StartDate).getTime() != defaultDate?.getTime() ? convertStringToDateText(props?.objective?.StartDate, props?.objective?.StartDateType) : undefined
          },
        }}
        
        onSave={(e) => {
          props?.onSelect(); 
          const dateValue = e.find(v => v.field === 'StartDate')?.value;
          if(validateDateText(dateValue)){
             let updatedFields = [];
             updatedFields.push({field: 'StartDate', value: convertStringToDate(dateValue, getDateType(dateValue))}) 
             updatedFields.push({field: 'StartDateType', value: getDateType(dateValue)}) 
             props?.onUpdateFields(updatedFields);
          }
          else {
            setInvalidDate(true);
          }
        }}>
        <StringValue value={props?.objective?.StartDate && new Date(props?.objective?.StartDate).getTime() != defaultDate?.getTime() ? convertStringToDateText(props?.objective?.StartDate, props?.objective?.StartDateType) : undefined} maxLength={MAX_CELL_STR_LENGTH}/>
      </DataTableCell>
      <Snackbar open={invalidDate} autoHideDuration={1000} onClose={handleErrorClose}>
        <Alert severity="error" onClose={handleErrorClose}>
          Invalid Date Format
        </Alert>
      </Snackbar>
    </>
  )
}

export default DatesTemplate;

import Input from "~/ui/components/Forms/Input";
import React from "react";
import {IFormInputFormikProps, IFormInputValue} from "~/types/forms";

interface IProps {
  inputProps: IFormInputFormikProps;
  onUpdate: (update: IFormInputValue) => any;
  onSave?: () => any;
  autoSave?: boolean;
}

const DataTableCellInput = ({
                              inputProps,
                              onUpdate,
                              onSave,
                              autoSave = false
                            }: IProps) => {
  const [initialValue, setInitialValue] = React.useState(inputProps?.field?.value);

  return (
    <>
      {!inputProps?.component ?
        <Input {...inputProps}
               size="small"
               autoFocus={true}
               label={inputProps?.label}
               component={inputProps?.component}
               field={{
                 name: inputProps?.field?.name,
                 value: initialValue,
                 onKeyPress: async (event: any) => {
                   if (event?.keyCode === 13) {
                     setInitialValue(event?.target?.value);
                     await onUpdate({
                       field: inputProps?.field?.name,
                       value: event?.target?.value
                     });
                     if (onSave) onSave();
                   }
                 },
                 onChange: async (event: any) => {
                   setInitialValue(event?.target?.value);
                   await onUpdate({
                     field: inputProps?.field?.name,
                     value: event?.target?.value
                   });
                   if (autoSave && onSave) onSave();
                 }
               }}/>
        :
        <>
          {React.createElement(
            inputProps?.component,
            {
              ...inputProps
            },
          )}
        </>
      }
    </>
  )
}

export default DataTableCellInput;

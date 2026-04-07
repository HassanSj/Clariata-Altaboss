import React from "react";

import {RadioGroup as MaterialInput} from "@material-ui/core";
import Radio from "~/ui/components/Forms/Radio";
import {get} from 'lodash';

interface IProps {
  field: any;
  name: any;
  options: any;
  onChange?: any;

  labelField: string | undefined;
  valueField: string | undefined;
}

const RadioGroup = ({
                      field,
                      name,
                      options,
                      onChange,
                      labelField,
                      valueField,
                      ...props
                    }: IProps) => {
  const fieldName = name || field.name;

  return (
    <React.Fragment>
      <MaterialInput {...field} {...props} name={fieldName}>
        {options.map((option: any, index: number) => (
          <Radio
            key={index}
            value={get(option,valueField)}
            checked={field.value === get(option,valueField)}
            onChange={field.onChange}
            label={get(option,labelField)}
            id={fieldName}
          />
        ))}
      </MaterialInput>
    </React.Fragment>
  );
};

export default RadioGroup;
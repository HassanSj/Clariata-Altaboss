import React from "react";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {get} from 'lodash';

interface IProps {
  value: any | undefined;
  options: any[];
  labelField: string;
  valueField: string;
}

const EnumValue = ({ value, options, labelField, valueField }: IProps) => {
  const item = options?.find((o) => String(get(o, valueField)) === String(value));
  const label = (isNullOrUndefined(item) || isNullOrUndefined(get(item, labelField))) ? '' : get(item, labelField);

  return <span>{label}</span>;
}

export default EnumValue;
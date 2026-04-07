import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import React from "react";

interface IProps {
  label: string;
  groupingValue: any;
  groupingOptions: any;
}

const SelectGroupBy = ({ label, groupingValue, groupingOptions }: IProps) => {

  return (
    <>
      <FormControl fullWidth={true}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select labelId="demo-simple-select-label"
                fullWidth={true}
                value={groupingValue}
                {...groupingValue}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}>
          {Object.keys(groupingOptions).map((grouping: any, index: number) => {
            const option = groupingOptions[grouping];
            return (
              <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default SelectGroupBy;
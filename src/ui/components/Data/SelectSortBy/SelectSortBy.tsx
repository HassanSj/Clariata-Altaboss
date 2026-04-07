import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import React from "react";

interface IProps {
  label: string;
  value: any;
  options: any;
}

const SelectSortBy = ({ label, value, options }: IProps) => {

  return (
    <>
      <FormControl fullWidth={true}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select labelId="demo-simple-select-label"
                fullWidth={true}
                value={value}
                {...value}
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
          {Object.keys(options).map((grouping: any, index: number) => {
            const option = options[grouping];
            return (
              <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default SelectSortBy;

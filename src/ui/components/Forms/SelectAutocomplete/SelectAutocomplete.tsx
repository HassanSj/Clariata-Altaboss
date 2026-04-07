import {Autocomplete} from "@material-ui/lab";
import {Chip, FormHelperText, TextField} from "@material-ui/core";
import styles from "~/ui/components/Forms/Input/Input.module.scss";
import classnames from 'classnames';
import React from "react";
import {get} from "lodash";
import {isNullOrUndefined, logSimple} from "~/ui/constants/utils";


const SelectAutocomplete = (props: any) => {
  const getValue = () => {
    return !isNullOrUndefined(props?.field?.value) ? props?.field?.value : props?.valuee;
  }

  const onSelectChange = (event: any, values: any) => {
    if (props?.onCustomChange) {
      props?.onCustomChange({ field: props?.name, value: values });
    }
    if (props?.onChange) {
      // event.target.name = name;
      // event.target.value = get(values, valueField);
      // onChange(event);
    }
    if (props?.form) {
      props?.form.setFieldValue(name, values);
    }
  }

  const onHandleChange = (event: any, values: any) => {
    if (props?.onCustomChange) {
      props?.onCustomChange({ field: props?.field.name, value: values });
    }
    if (props?.onChange) {
      event.target.name = props?.field.name;
      event.target.value = get(values, props?.valueField);
      props?.onChange(event);
    }
    if (props?.form && props?.form.setFieldValue) {
      if (!props?.isMultiselect) {
        const val = get(values, props?.valueField);
        props?.form.setFieldValue(props?.field.name, val);
      } else {
        props?.form.setFieldValue(props?.field.name, values);
      }
    }
  }

  return (
    <>
      <Autocomplete
        fullWidth
        disabled={props.disabled}
        freeSolo={props?.freeSolo}
        id={props?.name}
        autoHighlight
        onChange={(e, v) => onHandleChange(e, v)}
        multiple={props?.isMultiselect}
        disableClearable={props?.disableClearable}
        options={props?.items ? props?.items : []}
        getOptionLabel={(option) => get(option, props?.labelField)}
        getOptionSelected={(option, ovalue) => (Number(get(ovalue, props?.valueField)) === Number(get(option, props?.valueField)))}
        renderOption={isNullOrUndefined(props?.templateComponent) ? (option: any) => (
          <React.Fragment>
            {get(option, props?.labelField)}
          </React.Fragment>
        ) : props?.templateComponent}
        renderTags={(tvalue, getTagProps) =>
          tvalue.map((option, index) => (
            <Chip variant="outlined" label={get(option, props?.labelField)} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => {
          const val = getValue();
          if (!isNullOrUndefined(val)) {
            const selected = props?.items?.find((e: any) => {
              // logSimple(`${e?.PersonID}, ${props?.valueField}, ${get(e, props?.valueField)} === ${val}`, null);
              return Number(get(e, props?.valueField)) === Number(val);
            });
            // @ts-ignore
            params.inputProps.value = get(selected, props?.labelField);
          }
          return (
            <TextField
              {...params}
              className={classnames(styles.input, styles.white, {[styles.input_error_outline] : props?.border })}
              type={props?.type}
              name={props?.name}
              value={val}
              label={props?.label}
              onKeyPress={props?.onKeyPress}
              onBlur={props?.onBlur}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        }}
      />
      {props?.required ?
        <FormHelperText className={styles.required}>Required</FormHelperText>
        : null}
    </>
  )
}

export default SelectAutocomplete;

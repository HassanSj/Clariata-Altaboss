import React, {ReactElement} from 'react';
import styles from './InputField.module.scss';
import {ErrorMessage, Field, getIn} from "formik";
import Input from "~/ui/components/Forms/Input";
import {logSimple} from "~/ui/constants/utils";
import {IFormInputProps} from "~/types/forms";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectDate from "~/ui/components/Forms/SelectDate";
import classnames from 'classnames';
import { processServerError } from '~/services/api/errors';

const InputField = (props: IFormInputProps): ReactElement => {

  const [redBorder, setRedBorder] = React.useState<boolean>(false);

  // Set defaults
  if (!props.type) props.type = 'text';

  if(props.type === "select"){
    if(!props.items?.some((v) => v[props.valueField ?? "value"] === "")){
      const v:any = {};
      v[props.valueField ?? "value"] = props.emptyOptionValue ?? ""
      v[props.labelField ?? "label"] = props.label ?? ""

      props.items?.splice(0, 0, v)
    }
  }

  const validateCustom = (value: any) =>  {
    if(props.required) {
      if (value === '') {
        setRedBorder(true);
      } else {
        setRedBorder(false);
      }
    }
  }

  // Check if it's a text input
  const nonTextInputTypes = ['checkbox', 'radio', 'range', 'button_group', 'autocomplete'];
  const isBaseInput = !nonTextInputTypes.includes(props.type);
  const isAutocomplete = (props.type === 'autocomplete');
  const isSelect = (props.type === 'select');
  const isSwitch = (props.type === 'checkbox');
  const isRadio = (props.type === 'radio');
  const isRange = (props.type === 'range');
  const isDate = (props.type === 'date' || props.type === 'datetime' || props.type === 'time' || props.type === 'month_year' || props.type === 'month' || props.type === 'year');
  const isDateText = (props.type === 'datetext');
  const isDateSeparated = (props.type === 'month_year');
  const isDateTime = (props.type === 'datetime');
  const isButtonGroup = (props.type === 'button_group');

  // Select types
  const booleanTypes = [
    {label: 'Yes', value: true},
    {label: 'No', value: false}
  ]

  // Check box
  const [checkboxState, setCheckboxState] = React.useState(props.value === 'true');
  const handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxState(event.target.checked);
  };

  // Process change event
  const onChangeEvent = (event: any, values: any) => {
    // onChange({ field: name, value: values });
    // TODO - implement this for all input types
    logSimple('InputField.onChangeEvent', {event, values});
  }
  return (
    <>
    
      {/* <span className={classnames(styles.input_container, {[styles.input_error_outline]: redBorder })}> */}
      <span className={styles.input_container}>
        {isBaseInput ?
        <div className={classnames({[styles.input_error_outline] : redBorder })}>
          <Field {...props}
                 as={props.type}
                 type={props.type}
                 name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 disablePast={props?.disablePast ?? false}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 hint={props.hint}
                 onChange={props.onChange}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                //  validate={validateCustom}
                 onCustomChange={props.onCustomChange}
                 accept = {props.accept} />
        </div>  : null}
        {!isBaseInput && isAutocomplete ?
          <Field as={props.type}
                 type={props.type}
                 name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                 disableClearable={props.disableClearable}
                 onChange={onChangeEvent}
                //  validate={validateCustom}
                 render={(fieldProps: any) => {
                   return (
                     <props.component {...props}
                                         {...fieldProps}
                                         freeSolo={props.freeSolo}
                                         onCustomChange={props.onCustomChange}
                                         type={props.type}
                                         templateComponent={props.templateComponent}
                                         isMultiselect={props.isMultiselect}
                                         placeholder={props.placeholder}
                                         label={props.label}
                                         items={props.items}
                                         labelField={props.labelField}
                                         valueField={props.valueField}
                                         value={props.value}
                                         border={redBorder}
                                         hint={props.hint}/>
                   )
                 }}
          />
         : null}
        {!isBaseInput && isSwitch ?
          <Field as={'checkbox'}
                 type={'checkbox'}
                 name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 onChange={props.onChange}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                 render={(field: any, form: any) => {
                   return (
                     <Input {...props}
                            {...field}
                            {...form}
                            onChange={props.onChange}
                            type={'checkbox'}
                            placeholder={props.placeholder}
                            label={props.label}
                            items={booleanTypes}
                            labelField={props.labelField}
                            valueField={props.valueField}
                            hint={props.hint}/>
                   )
                 }}/>
          : null}
        {!isBaseInput && isRadio ?
          <Field as={'radio'}
                 type={'radio'}
                 name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 onChange={props.onChange}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                 render={(field: any, form: any) => {
                   return (
                     <Input {...props}
                            {...field}
                            {...form}
                            type={'radio'}
                            placeholder={props.placeholder}
                            label={props.label}
                            items={props.items}
                            labelField={props.labelField}
                            valueField={props.valueField}
                            hint={props.hint}
                            orientation={props.orientation}/>
                   )
                 }}/>
          : null}
        {!isBaseInput && isButtonGroup ?
          <Field name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 onChange={props.onChange}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                 render={(field: any, form: any) => {
                   return (
                     <Input {...props}
                            {...field}
                            {...form}
                            type={'button_group'}
                            placeholder={props.placeholder}
                            label={props.label}
                            items={props.items}
                            labelField={props.labelField}
                            valueField={props.valueField}
                            hint={props.hint}
                            orientation={props.orientation}/>
                   )
                 }}/>
          : null}
        {!isBaseInput && isDateSeparated ?
          <Field as={props.type}
                 type={props.type}
                 name={props.name}
                 component={props.component}
                 placeholder={props.placeholder}
                 label={props.label}
                 value={props.value}
                 defaultValue={props.defaultValue}
                 onBlur={props.onBlur}
                 onKeyPress={props.onKeyPress}
                 onChange={props.onChange}
                 render={(field: any, form: any) => {
                   return (
                       <>
                     <SelectDate {...props}
                                 {...field}
                                 {...form}
                                 onCustomChange={props.onCustomChange}
                                 type={props.type}
                                 templateComponent={props.templateComponent}
                                 isMultiselect={props.isMultiselect}
                                 placeholder={props.placeholder}
                                 label={props.label}
                                 items={props.items}
                                 labelField={props.labelField}
                                 valueField={props.valueField}
                                 hint={props.hint}
                                 freeSolo={props.freeSolo}/>
                       </>
                   )
                 }}/>
          : null}
        {!isBaseInput && isDateText ?
              <Field {...props}
              as={props.type}
              type={props.type}
              name={props.name}
              component={props.component}
              placeholder={props.placeholder}
              disablePast={props?.disablePast ?? false}
              label={props.label}
              value={props.value}
              defaultValue={props.defaultValue}
              hint={props.hint}
              onChange={props.onChange}
              onBlur={props.onBlur}
              onKeyPress={props.onKeyPress}
              onCustomChange={props.onCustomChange}
              validate={props.validate}/>
          : null}
        <div className={styles.input_error}>
          <ErrorMessage name={props.name}/>
        </div>
      </span>
    </>
  )
};

export default InputField;

import React, {ReactElement} from 'react';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextareaAutosize,
    TextField as MaterialInput
} from '@material-ui/core';
import styles from './Input.module.scss';
import classnames from 'classnames';
import {get} from 'lodash';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {IFormInputFormikProps} from "~/types/forms";
import NumberFormatInput from '../NumberFormatInput';

const Input = ({
                   field: {
                       name,
                       value,
                       defaultValue,
                       onChange,
                       onBlur,
                       onKeyPress,
                   },
                   checked,
                   disabled,
                   type = 'text',
                   label,
                   placeholder,
                   labelField = 'label',
                   valueField = 'value',
                   items,
                   orientation,
                   hint,
                   onCustomChange,
                   format,
                   classes,
                   ivariant = 'outlined',
                   size = 'medium',
                   autoFocus,
                   required,
                   accept,
               }: IFormInputFormikProps): ReactElement => {
    // Check if it's a text input
    const nonTextInputTypes = ['select', 'checkbox', 'radio', 'range', 'textarea', 'number_format', 'button_group', 'datetext'];
    const isBaseInput = !nonTextInputTypes.includes(type);
    const isCheckbox = (type === 'checkbox');
    const isTextarea = (type === 'textarea');
    const isRadio = (type === 'radio');
    const isSelect = (type === 'select');
    const isNumberFormat = (type === 'number_format')
    const isButtonGroup = (type === 'button_group');
    const isDateText = (type === 'datetext');
    

    // Build options list of select inputs
    const options: any[] = [];
    if (type === 'select' && items) {
        items.forEach((item: any) => options.push({
            label: get(item, `${labelField}`),
            value: get(item, `${valueField}`)
        }));
    }

    // @ts-ignore
    return (
        <>
            <FormControl className={styles.control}>
                {isBaseInput ?
                    <>
                        <MaterialInput
                            disabled={disabled}
                            fullWidth
                            id={name}
                            className={classnames(styles.input, classes)}
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            label={label}
                            onChange={onChange}
                            onKeyDown={onKeyPress}
                            onBlur={onBlur}
                            value={value}
                            defaultValue={defaultValue}
                            multiline={isTextarea}
                            rows={isTextarea ? 4 : 0}
                            variant="outlined"
                            size={size}
                            autoFocus={autoFocus}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                accept: accept
                            }}
                        />
                    </>
                    : null}
                {(isNumberFormat) ?
                    <>
                        <MaterialInput
                            label={label}
                            value={value}
                            onChange={onChange}
                            name={name}
                            id={name}
                            InputProps={{
                                inputComponent: NumberFormatInput as any,
                            }}
                            variant="outlined"
                        />

                    </> : null}
                {(isTextarea) ?
                    <>
                        {!isNullOrUndefined(label) ?
                            <InputLabel shrink className={styles.textarea_label}>{label}</InputLabel>
                            : null}
                        <TextareaAutosize rowsMin={1}
                                          id={name}
                                          className={classnames(styles.textarea, classes)}
                                          name={name}
                                          onChange={onChange}
                                          onKeyPress={onKeyPress}
                                          onBlur={onBlur}
                                          value={value}
                                          required={required}
                                          defaultValue={defaultValue}/>
                    </>
                    : null}
                {(isDateText) ?
                    <>
                        <MaterialInput
                            fullWidth
                            id={name}
                            className={classnames(styles.input, classes)}
                            type={type}
                            name={name}
                            placeholder={placeholder}
                            label={label}
                            onChange={onChange}
                            onKeyDown={onKeyPress}
                            onBlur={onBlur}
                            value={value}
                            defaultValue={defaultValue}
                            variant="outlined"
                            size={size}
                            autoFocus={autoFocus}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                    : null}
                {(isSelect) ?
                    <>
                        {!isNullOrUndefined(label) ?
                            <InputLabel className={styles.select_label}
                                        shrink={true}
                                        variant="outlined">{label}</InputLabel>
                            : null}
                        <Select
                            disabled={disabled}
                            fullWidth
                            id={name}
                            className={classnames(classes)}
                            type={type}
                            name={name}
                            label={label}
                            onChange={onChange}
                            onKeyDown={onKeyPress}
                            onBlur={onBlur}
                            displayEmpty={true}
                            value={value}
                            defaultValue={defaultValue}
                            variant={ivariant}
                            required={required}
                            autoFocus={autoFocus}
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
                            }}
                        >
                            {items ? items.map((opt: any, index: number) => {
                                const lbl = get(opt, labelField)
                                return (
                                    <MenuItem value={get(opt, valueField)}
                                              key={index}>
                                        <span style={lbl === "" ? {height: "24px"} : undefined}>{lbl}</span>
                                    </MenuItem>
                                )
                            }) : null}
                        </Select>
                    </>
                    : null}
                {(isRadio) ?
                    <>
                        {!isNullOrUndefined(label) ?
                            <FormLabel>{label}</FormLabel>
                            : null}
                        <RadioGroup row={orientation === 'horizontal'}
                                    id={name}
                                    className={classnames(styles.radio, styles.classes)}
                                    name={name}
                                    onChange={onChange}
                                    onKeyPress={onKeyPress}
                                    onBlur={onBlur}
                                    value={value}
                                    defaultValue={defaultValue}>
                            {items ? items.map((opt: any) => {
                                return (
                                    <FormControlLabel label={`${get(opt, labelField)}`}
                                                      value={get(opt, valueField)}
                                                      control={<Radio/>}
                                                      key={`${get(opt, labelField)}`}/>
                                )
                            }) : null}
                        </RadioGroup>
                    </>
                    : null}
                {(isButtonGroup) ?
                    <>
                        {!isNullOrUndefined(label) ?
                            <FormLabel>{label}</FormLabel>
                            : null}
                        <RadioGroup row={orientation === 'horizontal'}
                                    id={name}
                                    className={classnames(styles.radio, classes)}
                                    name={name}
                                    onChange={onChange}
                                    onKeyPress={onKeyPress}
                                    onBlur={onBlur}
                                    value={value}
                                    defaultValue={defaultValue}>
                            {items ? items.map((opt: any, index: number) => {
                                return (
                                    <FormControlLabel label={`${get(opt, labelField)}`}
                                                      value={get(opt, valueField)}
                                                      control={<Radio/>}
                                                      key={`${get(opt, labelField)}`}/>
                                )
                            }) : null}
                        </RadioGroup>
                    </>
                    : null}
                {(isCheckbox) ?
                    <>
                        {isNullOrUndefined(label) ?
                            <Checkbox id={name}
                                      onChange={onChange}
                                      value={value}
                                      checked={value}/>
                            :

                            <FormControlLabel
                                control={
                                    <Checkbox id={name}
                                              onChange={onChange}
                                              value={value}
                                              checked={value}/>
                                }
                                label={label}
                            />
                        }
                    </>
                    : null}
                {required ?
                    <FormHelperText className={styles.required}>Required</FormHelperText>
                    : null}
                {hint ?
                    <FormHelperText>{hint}</FormHelperText>
                    : null}
            </FormControl>
        </>

    )
};

export default Input;

/*
         <FormControlLabel label={`${get(opt,labelField)}: ${get(opt,valueField)}`}
                                    value={get(opt,valueField)}
                                    control={<Radio />}
                                    key={get(opt,valueField)} />
 */

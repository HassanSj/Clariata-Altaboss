import styles from './SelectDate.module.scss';
import {FormHelperText, Grid} from "@material-ui/core";
import React from "react";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {
  DatePickerView,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {fromJsDate, isValidDate} from "~/ui/constants/utils";
import {DateTime} from "luxon";
import {formatDate} from "@telerik/kendo-intl";

export enum PickerType {
  DATE,
  TIME,
  DATETIME,
  MONTH_YEAR
}

const SelectDate = (props: any) => {
  // If true, value will be kept in state otherwise the component will not keep track of the value
  const shouldUseState = props.shouldUseState ?? true
  // Local state
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(props?.field?.value ? new Date(props?.field?.value) : null);
  const [pickerType, setPickerType] = React.useState<PickerType | undefined>();
  const [views, setViews] = React.useState<DatePickerView[] | undefined>();
  const [timeViews, setTimeViews] = React.useState<("hours" | "minutes" | "seconds")[] | undefined>();
  const [format, setFormat] = React.useState<string | undefined>();


  const parseAndSetDate = () => {
    if (!props?.field?.value) return;
    const isValid = isValidDate(props?.field?.value);
    if (isValid) {
      const date = new Date(props?.field?.value);
      const parsedDate = parseDate(date, date, date);
      handleMonthYearChange(parsedDate, parsedDate, parsedDate);
    }
  }

  const checkAndSetState = () => {
    setPickerType(getPickerType());
    setFormat(getFormat());
    const v = getViews();
    if (pickerType === PickerType.TIME) {
      setTimeViews(["hours", "minutes"]);
    } else {
      setViews(v);
    }
    if (props?.field?.value) {
      const date = new Date(props?.field?.value);
      handleMonthYearChange(date, date, date);
    }
  }

  const getPickerType = () => {
    let result;
    switch (props.type) {
      case 'date':
        result = PickerType.DATE;
        break;
      case 'time':
        result = PickerType.TIME;
        break;
      case 'datetime':
        result = PickerType.DATETIME;
        break;
      case 'month':
        result = PickerType.DATE;
        break;
      case 'year':
        result = PickerType.DATE;
        break;
      case 'month_year':
        result = PickerType.MONTH_YEAR;
        break;
    }

    return result;
  }

  const getFormat = () => {
    let result;
    switch (props.type) {
      case 'date':
        result = 'MM/dd/yyyy';
        break;
      case 'time':
        result = 'HH:mm';
        break;
      case 'datetime':
        result = 'MM/dd/yyyy HH:mm';
        break;
      case 'month':
        result = 'MM';
        break;
      case 'year':
        result = 'yyyy';
        break;
      case 'month_year':
        result = 'yyyy/MM';
        break;
    }

    return result;
  }

  const getViews = () => {
    let result;
    switch (props.type) {
      case 'date':
        result = ["date"];
        break;
      case 'time':
        result = ["hours", "minutes"];
        break;
      case 'datetime':
        result = ["date", "year", "month", "hours", "minutes"];
        break;
      case 'month':
        result = ["month"];
        break;
      case 'year':
        result = ["year"];
        break;
      case 'month_year':
        result = ["year", "month"];
        break;
    }

    return result as DatePickerView[];
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    if (props?.onCustomChange) {
      props?.onCustomChange({field: props?.field?.name, value: date});
    }
    if (props?.onChange) {
      props?.onChange({
        target: {
          name: props?.field?.name,
          value: date // get(date, props?.valueField)
        }
      });
    }
    if (props?.form) {
      props?.form.setFieldValue(props?.field?.name, date);
    }
  };

  const handleMonthChange = (date: Date | undefined | null) => {
    setMonth(date ? date : undefined);
    handleMonthYearChange(date, year);
  };

  const handleYearChange = (date: Date | undefined | null) => {
    setYear(date ? date : undefined);
    handleMonthYearChange(month, date);
  };

  const handleMonthYearChange = (selectedMonth: Date | null | undefined, selectedYear: Date | null | undefined, selectedDay?: Date) => {
    const date = parseDate(selectedMonth, selectedYear, selectedDay);
    if(date)
      handleDateChange(date);
  }

  const getValueMonth = () => {
    if (!props?.field?.value) return undefined;
    try {
      const date = new Date(props?.field?.value);
      const parsedDate = parseDate(date, date);
      if(parsedDate) {
        const dt = fromJsDate(parsedDate);

        return dt.get('month');
      }else{
        return undefined
      }
    } catch (e) {
      return undefined;
    }
  }

  const getValueYear = () => {
    if (!props?.field?.value) return undefined;
    try {
      const date = new Date(props?.field?.value);
      const parsedDate = parseDate(date, date);
      if(parsedDate) {
        const dt = fromJsDate(parsedDate);

        return dt.get('year');
      }else{
        return undefined
      }
    } catch (e) {
      return undefined;
    }
  }

  const validDate = (date: Date|null|undefined) => {
    if(typeof date === "string" || typeof date === "number")
      return true;
    return date && !isNaN(date.getTime())
  }

  const parseDate = (selectedMonth: Date | null | undefined, selectedYear: Date | null | undefined, selectedDay?: Date) => {
    if(!validDate(selectedMonth) && !validDate(selectedYear) && !validDate(selectedDay))
      return

    const current = new Date();
    let yearStr = current.getFullYear();

    if (validDate(selectedYear)) {
      const y = fromJsDate(selectedYear!);
      if(y) {
        yearStr = y.get('year');
      }
    }

    let monthStr = current.getMonth();
    if (validDate(selectedMonth)) {
      const m = fromJsDate(selectedMonth!);
      if(m) {
        monthStr = m.get('month');
      }
    }
    if(monthStr < 10){
      // @ts-ignore
      monthStr = `0${monthStr}`
    }

    let dayStr = current.getDate();
    if(validDate(selectedDay)){
      const d = fromJsDate(selectedDay!)
      if(d) {
        dayStr = d.get("day");
      }
    }
    if(dayStr < 10){
      // @ts-ignore
      dayStr = `0${dayStr}`
    }

    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    return new Date(dateStr)
  }

  // Addition state values
  const [month, setMonth] = React.useState<Date | undefined>(getValueMonth());
  const [year, setYear] = React.useState<Date | undefined>(getValueYear());

  useMountEvents({
    onMounted: async () => {
      parseAndSetDate();
      checkAndSetState();
    },
  });

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="space-around">
          { pickerType === PickerType.DATE ?
            <KeyboardDatePicker
              className={styles.input}
              disableToolbar
              inputVariant="outlined"
              format={format}
              views={views}
              margin="normal"
              id={props?.field?.name}
              name={props?.field?.name}
              label={props?.label}
              placeholder={props?.placeholder}
              disablePast={props?.disablePast ?? false}
              value={shouldUseState ? selectedDate : props.field.value}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
          : null }
          { pickerType === PickerType.TIME ?
            <KeyboardTimePicker
              className={styles.input}
              disableToolbar
              ampm={true}
              mask="__:__ _M"
              inputVariant="outlined"
              format={format}
              views={timeViews}
              margin="normal"
              id={props?.field?.name}
              name={props?.field?.name}
              label={props?.label}
              placeholder={props?.placeholder}
              value={shouldUseState ? selectedDate : props.field.value}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
            : null }
          { pickerType === PickerType.DATETIME ?
            <KeyboardDateTimePicker
              className={styles.input}
              disableToolbar
              ampm={true}
              inputVariant="outlined"
              format={format}
              views={views}
              disablePast={props?.disablePast ?? false}
              margin="normal"
              id={props?.field?.name}
              name={props?.field?.name}
              label={props?.label}
              placeholder={props?.placeholder}
              value={shouldUseState ? selectedDate : props.field.value}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
            : null }
          { pickerType === PickerType.MONTH_YEAR ?
            <>
              <Grid item xs={6}>
                <div className={styles.input_left}>
                  <KeyboardDatePicker
                    className={styles.input}
                    disableToolbar
                    inputVariant="outlined"
                    format="MM"
                    views={["month"]}
                    margin="normal"
                    disablePast={props?.disablePast ?? false}
                    id={props?.field?.name + '_month'}
                    label={props?.label ? `${props.label} - Month` : 'Month'}
                    placeholder="Month"
                    value={shouldUseState ? selectedDate : null}
                    onChange={handleMonthChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={styles.input_right}>
                  <KeyboardDatePicker
                    className={styles.input}
                    disableToolbar
                    inputVariant="outlined"
                    format="yyyy"
                    views={["year"]}
                    margin="normal"
                    disablePast={props?.disablePast ?? false}
                    id={props?.field?.name + '_year'}
                    label={props?.label ? `${props.label} - Year` : 'Year'}
                    placeholder="Year"
                    value={shouldUseState ? selectedDate : props.field.value}
                    onChange={handleYearChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </Grid>
            </>
            : null }
        </Grid>
        {props.required ?
            <FormHelperText className={styles.required}>Required</FormHelperText>
            : null}
      </MuiPickersUtilsProvider>
    </>
  )
}

export default SelectDate;

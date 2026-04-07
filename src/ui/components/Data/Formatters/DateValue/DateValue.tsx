import React from "react";
import {
  toDate,
  toDateFull,
  toDateTime,
  toDateTimeShort,
  toDay,
  toDuration,
  toMonth,
  toMonthYear,
  toTime,
  toTimeSince,
  toYear
} from "~/ui/constants/utils";

export enum DateFormatType {
  DATE_FULL,
  DATE_SHORT,
  TIME_FULL,
  TIME_SHORT,
  DATETIME_FULL,
  DATETIME_SHORT,
  SINCE,
  DURATION,
  DAY,
  MONTH,
  YEAR,
  YEAR_FULL,
  MONTH_YEAR
}

interface IProps {
  dateString: string | undefined;
  format: DateFormatType;
  dateString2?: string | undefined;
}

const DateValue = ({ dateString, format, dateString2  }: IProps) => {
  switch (format) {
    case DateFormatType.DATE_FULL:
      return toDateFull(dateString);
      break;
    case DateFormatType.DATE_SHORT:
      return toDate(dateString);
      break;
    case DateFormatType.TIME_FULL:
      return toTime(dateString);
      break;
    case DateFormatType.TIME_SHORT:
      return toTime(dateString);
      break;
    case DateFormatType.DATETIME_FULL:
      return toDateTime(dateString);
      break;
    case DateFormatType.DATETIME_SHORT:
      return toDateTimeShort(dateString);
      break;
    case DateFormatType.SINCE:
      return toTimeSince(dateString);
      break;
    case DateFormatType.DURATION:
      return toDuration(dateString, dateString2, true);
      break;
    case DateFormatType.DAY:
      return toDay(dateString);
      break;
    case DateFormatType.MONTH:
      return toMonth(dateString);
      break;
    case DateFormatType.YEAR:
      return toYear(dateString);
      break;
    case DateFormatType.YEAR_FULL:
      return toYear(dateString, 'yyyy');
      break;
    case DateFormatType.MONTH_YEAR:
      return toMonthYear(dateString);
      break;
  }
}

export default DateValue;
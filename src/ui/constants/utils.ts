import {capitalize, isNumber, truncate} from 'lodash';
import {DateTime} from 'luxon';
import axios from "axios";
import {User} from "~/types/api/user";
import LogRocket from "logrocket";
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import Dinero from "dinero.js";
import {DEFAULT_CURRENCY} from "~/ui/constants/data";
import moment from 'moment';
import {Person} from "~/types/api/person";


export const isDev = () => process.env.NODE_ENV !== 'production';

export const defaultDate = new Date('0001-01-01T00:00:00');

/**
 * 
 * @param firstDate
 * @param secondDate 
 * @returns 
 */
export const compareStringDates = (firstDate: string, secondDate: string) => {
  const a = new Date(firstDate);
  const b = new Date(secondDate);

  return a < b;
}

/**
 * Format birth date of a person
 * @param person
 */
export function personBirthdate(person?:Person){
  if(person){
    return convertStringToDateText(person.DateOfBirth, Number(person.DateOfBirthString))
  }

  return null
}


/**
 * Format date to string
 * @param value
 * @param datetype
 * @returns
 */
export const convertStringToDateText = (value: Date|string|undefined|null, datetype: number|undefined) => {
  if(value === undefined || value === null || value === "")
    return "";
  switch (datetype) {
    case 1: 
      return moment(value).format('MM/DD/YYYY').toString();
    case 2:
      return moment(value).format('MM/YYYY').toString();
    case 3:
      return moment(value).format('YYYY').toString();
    default:
      return moment(value).format('MM/DD/YYYY').toString();
  }
}

/**
 * Format date to string
 * @param value 
 * @returns 
 */
 export const convertStringToDate = (value: string, datetype: number|undefined) => {
  switch (datetype) {
    case 1: 
      return moment(value,'MM/DD/YYYY').toDate();
    case 2:
      return moment(value,'MM/YYYY').toDate();
    case 3:
      return moment(value,'YYYY').toDate();
    default:
      return moment(value,'MM/DD/YYYY').toDate();
  }
}

/**
 * Is a given date string valid.
 * Dates can be either year only, month/year or day/month/year
 * @param date
 */
export const isCustomDateValid = (date: string): boolean => /^\d{4}|\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{4}$/.test(date)

/**
 * Validate date format with moment
 * @param value 
 * @returns 
 */
export const validateDateText = (value: any) => {
  if ((moment(value, 'MM/DD/YYYY', true).isValid()) ||
      (moment(value, 'M/D/YYYY', true).isValid()) ||
      (moment(value, 'MM/YYYY', true).isValid()) ||
      (moment(value, 'M/YYYY', true).isValid()) ||
      (moment(value, 'YYYY', true).isValid())) {
      return true;
  }

  return false;
}

/**
 * Get date type
 * @param value
 */
export const getDateType = (value: string|undefined) => {
  const res = value ? (value.length < 5 ? 3 : (value.length < 8 ? 2 : 1)): 1
  return res
}

/**
 * LOGGING
 */

export const setupLogging = (user?: User) => {
  if (process.env.NEXT_PUBLIC_LOGROCKET_APP && typeof window !== 'undefined' && !isDev) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP);
    // plugins should also only be initialized when in the browser
    // setupLogRocketReact(LogRocket);
    // set user
    if (user) {
      LogRocket.identify(`${user.UserID}`, {
        name: `${user.FirstName} ${user.LastName}`,
        email: `${user.EmailAddress}`,
        username: `${user.Username}`,
      });
    }
  }
  checkErrorLoggingSetup(user);
}

export const logSimple = (name: string, payload: any) => {
  if (isDev()) {
    // tslint:disable-next-line:no-console
    console.log(`${name}: %o`, payload);
  }
};

export const logAction = (name: string, state: any, payload: any) => {
  if (isDev()) {
    // tslint:disable-next-line:no-console
    console.log(`${name}: %o`, {
      state,
      payload,
    });
  }
};

export const logTodo = (message: string) => {
  if (isDev()) {
    // tslint:disable-next-line:no-console
    alert(`${message}`);
  }
};

export const checkErrorLoggingSetup = (user?: User) => {
  if (process.env.NEXT_PUBLIC_BUGSNAG_API_KEY && isNullOrUndefined(Bugsnag.getContext()) && !isDev) {
    Bugsnag.start({
      apiKey: String(process.env.NEXT_PUBLIC_BUGSNAG_API_KEY),
      plugins: [new BugsnagPluginReact()],
      onError: (event) => {
        if (user) {
          event.setUser(String(user.UserID), user.EmailAddress, `${user.FirstName} ${user.LastName}`);
        }
      }
    });
  }
}

export const logStringError = (error: string, module?: string) => {
  checkErrorLoggingSetup();
  Bugsnag.notify(error);
}

export const logError = (error: Error, module?: string) => {
  checkErrorLoggingSetup();
  Bugsnag.notify(error);
}

/**
 * GENERAL/STRINGS
 */

export const trimString = (str: string | undefined, maxLength: number) => {
  if (!str){
    return str;
  }
  return truncate(str, { length: maxLength, omission: '...'});
};

export const createEditHeaderText = (obj: any) => {
  return obj ? 'Curate' : 'Add';
};

export const addEditHeaderText = (obj: any) => {
  return obj ? 'Edit' : 'Add';
};

export const createEditHeaderSubmitText = (obj: any) => {
  return obj ? 'Save' : 'Create';
};

export const createEditMessageText = (obj: any) => {
  return obj ? 'updated' : 'created';
};

export const addEditMessageText = (obj: any) => {
  return obj ? 'updated' : 'added';
};

export const hasItems = (arr: any[] | null | undefined) => {
  if (!arr) return false;
  return arr.length > 0;
};

export const isNullOrUndefined = (obj: any | undefined | null) => {
  return (obj === undefined
    || obj === 'undefined'
    || obj === null
    || (isNumber(obj) && isNaN(obj))
    || (isString(obj) && obj?.trim()===''));
};

export const isString = (obj: any | undefined | null) => {
  return typeof obj === 'string' || obj instanceof String
}

export const toFirstUppercase = (str: string | undefined) => {
  if (!str) {
    return undefined;
  }

  return capitalize(str);
}

/**
 * DATES
 */

// NOTE: these are luxon time formats
export const DATE_FORMAT = DateTime.DATE_SHORT;
export const DATE_DISPLAY_FORMAT = DateTime.DATE_FULL;
export const DATETIME_FORMAT = '';
export const DATETIME_DISPLAY_FORMAT = DateTime.DATETIME_SHORT;
export const DATE_WEEK_FORMAT = 'W';
export const DATE_WEEK_DISPLAY_FORMAT = 'W';
export const DATE_MONTH_FORMAT = 'L';
export const DATE_MONTH_DISPLAY_FORMAT = 'LLL';
export const DATE_YEAR_FORMAT = 'yyyy';
export const DATE_YEAR_DISPLAY_FORMAT = 'yyyy';
export const DATE_MONTH_YEAR_FORMAT = '';
export const DATE_MONTH_YEAR_DISPLAY_FORMAT = 'L/yyyy';
export const TIME_FORMAT = DateTime.TIME_SIMPLE;

export const isValidDate = (date: Date | undefined) => {
  if (!date) return false;
  try {
    const invalidDateStr = '0001-01-01T00:00:00';
    if (invalidDateStr === date?.toString()) {
      return false;
    }
  } catch (err) {
    //logError(err, 'Utils.isValidDate');
  }

  return true;
}

export const toDate = (str: string | undefined, format: string|undefined = undefined, fromFormat: string | undefined = undefined) => {
  if (!str || str === undefined) return '';
  try {
    console.log(str)
    const dt = fromFormat ? DateTime.fromFormat(str, fromFormat) : DateTime.fromISO(str);
    return dt.toFormat(format ?? "MM/dd/yyyy")
  } catch (err){
    return '';
  }
};

export const toDateFull = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    return dt.toLocaleString(DateTime.DATE_FULL);
  } catch (err){
    return '';
  }
};

export const toDateTime = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    return dt.toLocaleString(DateTime.DATETIME_SHORT);
  } catch (err){
    return '';
  }
};

export const toDateTimeShort = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    return dt.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  } catch (err){
    return '';
  }
};

export const toDay = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    // return dt.toFormat('EEE');
    return dt.toFormat('E');
  } catch (err){
    return '';
  }
};

export const getMonth = (str: string | undefined) => {
  if (!str || str === undefined) return undefined;
  try {
    const dt = DateTime.fromISO(str);
    // return dt.toFormat('MMM');
    return String(dt.get('month') + 1);
  } catch (err){
    return undefined;
  }
};

export const toMonth = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    // return dt.toFormat('MMM');
    return dt.toFormat('MMMM');
  } catch (err){
    return '';
  }
};

export const toYear = (str: string | undefined, format?: string ) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    // return dt.toFormat('y');
    return dt.toFormat(format ?? 'yy');
  } catch (err){
    return '';
  }
};

export const toMonthYear = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    // return dt.toFormat('y');
    return dt.toFormat('MMMM/yyyy');
  } catch (err){
    return '';
  }
};

export const toTime = (str: string | undefined) => {
  if (!str || str === undefined) return '';
  try {
    const dt = DateTime.fromISO(str);
    return dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
  } catch (err){
    return '';
  }
};

export const toTimeShort = (str: string | undefined) => {
  if (!str) return '';
  try {
    const dt = DateTime.fromISO(str);
    return dt.toLocaleString(DateTime.TIME_SIMPLE);
  } catch (err){
    return '';
  }
};

export const toTimeSince = (str: string | undefined, timeZone: string = "utc") => {
  if (!str) return '';
  try {
    const dt = DateTime.fromISO(str,{zone: timeZone})
    return dt.toRelative();
  } catch (err){
    return '';
  }
};

export const getDuration = (str: string | undefined, str2: string | undefined) => {
  if (!str || !str2 || str2 === undefined) return undefined;
  try {
    const date1 = DateTime.fromISO(str);
    const date2 = DateTime.fromISO(str2);
    const diff = date1.diff(date2, ["years", "months", "days", "hours"])
    return diff.toObject();
  } catch (err){
    return undefined;
  }
};

export const toDuration = (str: string | undefined, str2: string | undefined, includeTime: boolean) => {
  if (!str || str === undefined || !str2 || str2 === undefined) return '';
  try {
    const d = getDuration(str, str2);
    let result = ``;
    if (includeTime) {
      if (d?.minutes > 0) {
        result += `${d.minutes} minutes`
      }
      if (d?.hours > 0) {
        result += `${d.hours} hours`
      }
    }
    if (d?.days > 0) {
      result += `${d.days} days`
    }
    if (d?.weeks > 0) {
      result += `${d.weeks} weeks`
    }
    if (d?.months > 0) {
      result += `${d.months} months`
    }
    if (d?.years > 0) {
      result += `${d.years} years`
    }

    return result;
  } catch (err){
    return '';
  }
};

export const fromJsDate = (date: Date) => {
  if(date){
    try{
      return DateTime.fromISO(date.toISOString())
    }catch (e){
      return undefined
    }
  }else{
    return undefined
  }
}

export const toJsDate = (date: any) => {
  return date ? new Date(date.toISO()) : undefined;
}

export const addMinutes = (date: Date | undefined, count: number) => {
  if (!date) return date;
  return toJsDate(DateTime.fromJSDate(date).plus({ minutes: count }));
}

export const addHours = (date: Date | undefined, count: number) => {
  if (!date) return date;
  return toJsDate(DateTime.fromJSDate(date).plus({ hours: count }));
}

export const addDays = (date: Date | undefined, count: number) => {
  if (!date) return date;
  return toJsDate(DateTime.fromJSDate(date).plus({ days: count }));
}

export const addMonths = (date: Date | undefined, count: number) => {
  if (!date) return date;
  return toJsDate(DateTime.fromJSDate(date).plus({ months: count }));
}

export const getDateUnitsBetween = (start: Date, end: Date, unit: string) => {
  const result = [];
  let activeDate = DateTime.fromJSDate(start).startOf(unit);
  const startDate = DateTime.fromJSDate(start);
  const endDate = DateTime.fromJSDate(end).endOf(unit);
  while (activeDate <= endDate) {
    activeDate = activeDate.plus({ months: 1 }).startOf(unit);
    result.push(toJsDate(activeDate));
  }

  return result;
}

export const getDaysBetween = (start: Date, end: Date) => {
  return getDateUnitsBetween(start, end, 'day');
}

export const getWeeksBetween = (start: Date, end: Date) => {
  return getDateUnitsBetween(start, end, 'week');
}

export const getMonthsBetween = (start: Date, end: Date) => {
  return getDateUnitsBetween(start, end, 'month');
}

export const isBeforeDaysFromNow = (dateStr: string, daysAway: number) => {
  logSimple('date.isBeforeDaysFromNow', dateStr);
  if (dateStr) {
    const start = new Date();
    const end = addDays(start, daysAway);
    const date = new Date(dateStr);
    return (DateTime.fromJSDate(date) <= DateTime.fromJSDate(end));
  }

  return false;
}

export const isAfter = (isAfterDate: Date | undefined, dateStr: Date | undefined) => {
  if (!isAfterDate || !dateStr) return false;
  return DateTime.fromJSDate(isAfterDate) <= DateTime.fromJSDate(dateStr)
}

export const isBefore = (isBeforeDate: Date | undefined, dateStr: Date | undefined) => {
  if (!isBeforeDate || !dateStr) return false;
  return DateTime.fromJSDate(isBeforeDate) >= DateTime.fromJSDate(dateStr)
}

/**
 * NUMBERS
 */

export const toPercentage = (top: number | undefined | null, bottom: number | undefined | null) => {
  let result = 0;
  if (!isNullOrUndefined(top) && !isNullOrUndefined(bottom) && bottom!==0){
    // @ts-ignore
    result = (top / bottom) * 100;
  }

  return result;
};

export const toDollars = (amount: number | undefined, decimalPlaces: number | undefined) => {
  const adjAmount = (amount ? amount : 0);
  return Dinero({ adjAmount, DEFAULT_CURRENCY }).toFormat('$0,0.00');
}


export const convertImgUrlToFile = async (url: string) => {
  const fileName = 'tempfilename';
  return await axios.get(url, { responseType: 'blob' }).then(response => {
    return new File([response.data], fileName);
  });
}

export const convertImgToBase64ServerSide = async (url: string) => {
  const resp = await fetch(url)
  const buff = await resp.arrayBuffer()
  const realBuff = Buffer.from(buff)
  return realBuff.toString('base64')
  // await new Promise((resolve, reject) => {
  //   fetch(url)
  //       .then((response) => response.buffer())
  //       .then((buffer) => {
  //         const b64 = buffer.toString('base64');
  //         resolve(b64);
  //       })
  //       .catch(reject);
  // })
}

export const convertImgToBase64URL = async (url: string) => {
  const file = await convertImgUrlToFile(url);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const getBase64FromUrl = async (url: string) => {
  const blob = await axios.get(url, { responseType: 'blob' }).then((response) => {return response.data as Blob});
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    // reader.onload = () => {
    //   const elem = document.createElement('canvas');
    //   const scaleFactor = width / img.width;
    //   elem.width = width;
    //   elem.height = img.height * scaleFactor;

    //   const ctx = elem.getContext('2d');
    //   ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);

    //   ctx.canvas.toBlob((blob) => {
    //     resolve(new File([blob], fileName, {
    //       type: 'image/jpeg',
    //       lastModified: Date.now()
    //     }));
    //   }, 'image/jpeg', 1);
    // };
    reader.onloadend = () => {
      const base64data = reader.result;   
      resolve(base64data);
    }
  });
}

export const buildUrlWithParams = (url: string, params: any) => {
  let result = url;
  if (params) {
    const total = Object.entries(params).length;
    result += "?";
    Object.entries(params).forEach(([key , value], index) => {
      result += `${key}=${value}`;
      if(index < (total - 1)){
        result += "&";
      }
    });
  }

  return result;
}


export type StringKeyedObject = {[key:string]:any}

export const serializeObject = (obj : any,  prefix?: any) => {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serializeObject(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }

  const result: string = str.join("&");
  return result;
}

export const convertStringArrayToNumberArray = (array?: string[] | string) => {
  if(array) {
    let result: number[] = [];

    if(Array.isArray(array)) {
      array?.forEach(a => result.push(+a));
    }
    else {
      result.push(+array);
    }
    
    return result;
  }

  return [] as number[];
}

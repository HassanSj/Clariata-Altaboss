import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {Person} from "~/types/api/person";
import {Objective} from "~/types/api/objective";
import {uniqBy} from 'lodash';
import {getFullName} from "~/ui/constants/user";
import {ActionItem} from "~/types/api/actionItem";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {Timeframe} from "~/types/api/timeframe";

export const DEFAULT_ALL_FILTER = -1;
export const DEFAULT_NO_GROUPING = 'NONE';

export const actionItemStatuses = [
  {
    Description: "",
    ActionItemStatusID: 0
  },
  {
    Description: "Not started",
    ActionItemStatusID: 1
  },
  {
    Description: "In progress",
    ActionItemStatusID: 2
  },
  {
    Description: "On hold",
    ActionItemStatusID: 3
  },
  {
    Description: "Needs Attention",
    ActionItemStatusID: 4
  },
  {
    Description: "Canceled",
    ActionItemStatusID: 5
  },
  {
    Description: "Complete",
    ActionItemStatusID: 6
  },
  // {
  //   Description: "Archived",
  //   ActionItemStatusID: 7
  // },
]

export const getAllFilter = () => {
  return {
    label: 'All',
    value: -1
  }
}

export const getDimensionsOfSuccessFilters = (dimensionsOfLife: DimensionOfLife[]) => {
  const filters: any = [];
  // filters.push(getAllFilter());
  dimensionsOfLife?.forEach((d: DimensionOfLife) => {
    filters.push({
      label: d.DimensionOfLife,
      value: d.DimensionOfLifeID
    });
  });
  return filters;
}

export const getDimensionsOfSuccessGroupings = (dimensionsOfLife: DimensionOfLife[]) => {
  const groupings: any = {};
  dimensionsOfLife?.forEach((d: DimensionOfLife) => {
    groupings[d.DimensionOfLifeID] = {
      label: d.DimensionOfLife,
      value: d.DimensionOfLifeID,
    };
  });
  return groupings;
}

export const getMetricsOfSuccessFilters = (dimensionsOfLife: MetricOfSuccess[]) => {
  const filters: any = [];
  // filters.push(getAllFilter());
  dimensionsOfLife?.forEach((d: MetricOfSuccess) => {
    filters.push({
      label: d.MetricOfSuccess,
      value: d.MetricOfSuccessID
    })
  });
  return filters;
}

export const getMetricsOfSuccessGroupings = (dimensionsOfLife: MetricOfSuccess[]) => {
  const groupings: any = {};
  dimensionsOfLife?.forEach((d: MetricOfSuccess) => {
    groupings[d.MetricOfSuccessID] = {
      label: d.MetricOfSuccess,
      value: d.MetricOfSuccessID,
    };
  });
  return groupings;
}

export const getTimeframeFilters = (items: Timeframe[]) => {
  const filters: any = [];
  // filters.push(getAllFilter());
  items?.forEach((d: Timeframe) => {
    filters.push({
      label: d.Description,
      value: d.TimeframeID
    })
  });
  console.log("Timing Values :", filters)
  return filters;
}

export const getAssistanceFilters = () => {
  return [{label:"DIY",value:2},{label:"Assistance",value:3}]
}

export const getTimeframeGroupings = (items: Timeframe[]) => {
  const groupings: any = {};
  items?.forEach((d: Timeframe) => {
    groupings[d.TimeframeID] = {
      label: d.Description,
      value: d.TimeframeID
    };
  });
  return groupings;
}

export const getObjectivePersonFilters = (items: Objective[], persons: Person[]) => {
  const uniqueAssignees = uniqBy(items, 'PersonID');
  let result: any[] = [];
  // result.push(getAllFilter());
  uniqueAssignees?.forEach((o: Objective) => {
    const person = persons?.find((p: Person) => p.PersonID === o.PersonID);
    if (person){
      result.push({
        label: getFullName(person),
        value: o.PersonID
      });
    }
  })
  result.push({
    label: "Both",
    value: 0
  })
  console.log("Unique Assignees :", result)
  return result;
}

export const getObjectiveGroupingOptions = (persons?: Person[],
                                            dimensionsOfLife?: DimensionOfLife[],
                                            metricsOfSuccess?: MetricOfSuccess[],
                                            timeframes?: Timeframe[]) => {
  return [
    {
      label: 'No grouping',
      value: DEFAULT_NO_GROUPING
    },
    {
      label: 'Person',
      value: 'PersonID',
      labelField: 'FullName',
      labels: persons
    },
    {
      label: 'Dimension',
      value: 'DimensionOfLifeID',
      labelField: 'DimensionOfLife',
      labels: dimensionsOfLife
    },
    {
      label: 'Metric',
      value: 'MetricOfSuccessID',
      labelField: 'MetricOfSuccess',
      labels: metricsOfSuccess
    },
    {
      label: 'Timeframes',
      value: 'TimeframeID',
      labelField: 'Description',
      labels: timeframes
    },
  ]
}

export const getObjectiveGroupingMap = (persons?: Person[],
                                        dimensionsOfLife?: DimensionOfLife[],
                                        metricsOfSuccess?: MetricOfSuccess[],
                                        timeframes?: Timeframe[]) => {
  const result: any = {};
  const options = getObjectiveGroupingOptions(persons, dimensionsOfLife, metricsOfSuccess, timeframes);
  options?.forEach((o: any) => {
    result[o.value] = {
      label: o.label,
      value: o.value,
      labelField: o.labelField,
      labels: o.labels
    }
  })
  return result;
}

export const getActionItemPersonFilters = (items: ActionItem[], persons: Person[]) => {
  const uniqueItems = uniqBy(items, 'LeadPerson');
  const result: any[] = [];
  // result.push(getAllFilter());
  uniqueItems?.forEach((o: ActionItem) => {
    const person = persons?.find((p: Person) => p.PersonID === o.LeadPerson);
    if (person){
      result.push({
        label: getFullName(person),
        value: o.LeadPerson
      });
    }
  })

  return result;
}

export const getActionItemObjectiveFilters = (items: ActionItem[], objectives: Objective[]) => {
  const uniqueItems = uniqBy(items, 'ObjectiveID');
  const result: any[] = [];
  // result.push(getAllFilter());
  uniqueItems?.forEach((o: ActionItem) => {
    const person = objectives?.find((p: Objective) => p.ObjectiveID === o.ObjectiveID);
    if (person){
      result.push({
        label: o.Description,
        value: o.ObjectiveID
      });
    }
  })

  return result;
}

export const getActionItemStatuses = () => {
  return [
    {
      label: 'None',
      value: 0
    },
    {
      label: 'Not started',
      value: 1
    },
    {
      label: 'In Progress',
      value: 2
    },
    {
      label: "On hold",
      value: 3
    },
    {
      label: "Under review",
      value: 4
    },
    {
      label: "Canceled",
      value: 5
    },
    {
      label: 'Complete',
      value: 6
    }
  ]
}

export const getActionItemStatus = (item: ActionItem | undefined) => {
  return item?.ActionItemStatusID ?? 0
}

export const getActionItemGroupingOptions = (persons?: Person[],
                                             objectives?: Objective[]) => {
  return [
    {
      label: 'No grouping',
      value: DEFAULT_NO_GROUPING
    },
    {
      label: 'Person',
      value: 'LeadPerson',
      labelField: 'FullName',
      labels: persons
    },
    {
      label: 'Objective',
      value: 'ObjectiveID',
      labelField: 'Description',
      labels: objectives
    },
    {
      label: "Year",
      value: "StartDate",
      labelField: "StartDate",
      labels: objectives
    }
  ]
}

export const getActionItemGroupingMap = (persons?: Person[],
                                         objectives?: Objective[]) => {
  const result: any = {};
  const options = getActionItemGroupingOptions(persons, objectives);
  options?.forEach((o: any) => {
    result[o.value] = {
      label: o.label,
      value: o.value,
      labelField: o.labelField,
      labels: o.labels
    }
  })
  return result;
}

export enum RecurrenceFrequencyType {
  ONCE = 1,
  DAILY = 2,
  WEEKLY = 3,
  BI_WEEKLY = 4,
  MONTHLY = 5,
  QUARTERLY = 6
}

export const actionItemTimingFrequency = [
  {
    label: 'Once',
    value: RecurrenceFrequencyType.ONCE,
    singular: 'once',
    plural: 'once'
  },
  {
    label: 'Daily',
    value: RecurrenceFrequencyType.DAILY,
    singular: 'day',
    plural: 'days'
  },
  {
    label: 'Weekly',
    value: RecurrenceFrequencyType.WEEKLY,
    singular: 'week',
    plural: 'weeks'
  },
  {
    label: 'Bi-Weekly',
    value: RecurrenceFrequencyType.BI_WEEKLY,
    singular: '2 weeks',
    plural: '2 weeks'
  },
  {
    label: 'Monthly',
    value: RecurrenceFrequencyType.MONTHLY,
    singular: 'month',
    plural: 'months'
  },
  {
    label: 'Quarterly',
    value: RecurrenceFrequencyType.QUARTERLY,
    singular: 'quarter',
    plural: 'quarters'
  }
];

export const getRecurrenceFrequencyType = (type: RecurrenceFrequencyType) => {
  return actionItemTimingFrequency?.find(i => i.value === type);
}

export enum MonthType {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2,
  APRIL = 3,
  MAY = 4,
  JUNE = 5,
  JULY = 6,
  AUGUST = 7,
  SEPTEMBER = 8,
  OCTOBER = 9,
  NOVEMBER = 10,
  DECEMBER = 11
}

export const monthTypes = [
  {
    label: 'January',
    value: MonthType.JANUARY,
  },
  {
    label: 'February',
    value: MonthType.FEBRUARY,
  },
  {
    label: 'March',
    value: MonthType.MARCH,
  },
  {
    label: 'April',
    value: MonthType.APRIL,
  },
  {
    label: 'May',
    value: MonthType.MAY,
  },
  {
    label: 'June',
    value: MonthType.JUNE,
  },
  {
    label: 'July',
    value: MonthType.JULY,
  },
  {
    label: 'August',
    value: MonthType.AUGUST,
  },
  {
    label: 'September',
    value: MonthType.SEPTEMBER,
  },
  {
    label: 'October',
    value: MonthType.OCTOBER,
  },
  {
    label: 'December',
    value: MonthType.DECEMBER,
  },
];

export const getMonthType = (type: MonthType) => {
  return monthTypes?.find(i => i.value === type);
}

import * as React from 'react';

import {guid} from '@progress/kendo-react-common';
import {timezoneNames} from '@progress/kendo-date-math';
import {IntlProvider, load, LocalizationProvider} from '@progress/kendo-react-intl';
import {AgendaView, DayView, MonthView, Scheduler, TimelineView, WeekView} from '@progress/kendo-react-scheduler';

import weekData from 'cldr-core/supplemental/weekData.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';

import numbers from 'cldr-numbers-full/main/es/numbers.json';
import dateFields from 'cldr-dates-full/main/es/dateFields.json';
import currencies from 'cldr-numbers-full/main/es/currencies.json';
import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';

import '@progress/kendo-date-math/tz/Etc/UTC';
import '@progress/kendo-date-math/tz/Europe/Sofia';
import '@progress/kendo-date-math/tz/Europe/Madrid';
import '@progress/kendo-date-math/tz/Asia/Dubai';
import '@progress/kendo-date-math/tz/Asia/Tokyo';
import '@progress/kendo-date-math/tz/America/New_York';
import '@progress/kendo-date-math/tz/America/Los_Angeles';
import {useStoreActions, useStoreState} from "~/store/hooks";
import {schedulerFields, toSchedulerEvents} from "~/ui/components/ActionItems/ActionItemScheduler/utils";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {ActionItem} from "~/types/api/actionItem";
import api from "~/services/api";
import EditActionItem from "~/ui/components/ActionItems/EditActionItem";
import {hasItems} from "~/ui/constants/utils";
import {Alert} from "@material-ui/lab";
import {IObjectiveDataType} from "~/types/objective/store";
import {Box} from "@material-ui/core";

load(
    likelySubtags, currencyData, weekData, numbers,
    currencies, caGregorian, dateFields, timeZoneNames
);

export const ActionItemSchedulerEditor = (props: any) => {
    const [showEditDialog, setShowEditDialog] = React.useState(true);

    const handleClose = () => {
        setShowEditDialog(false);
        props.onClose();
    }

    return (
      <EditActionItem item={props.dataItem}
                      isOpen={showEditDialog}
                      onClose={handleClose}></EditActionItem>
    );
};

interface IProps {
    actionItems: any[] | undefined;
}

const ActionItemScheduler = ({ actionItems }: IProps) => {
    const { selectedHousehold } = useStoreState((state) => state.household);
    const { dreamInterviewId } = useStoreState((state) => state.interview);
    const { objectives } = useStoreState((state) => state.objective);
    const {onPopulate, onSelect, onCreate, onUpdate, onRemove} = useStoreActions(actions => actions.objective);

    const timezones = React.useMemo(() => timezoneNames(), []);
    const locales = [{ language: 'en-US', locale: 'en' }, { language: 'es-ES', locale: 'es' }]

    const [view, setView] = React.useState('month');
    const [date, setDate] = React.useState(new Date());
    const [locale, setLocale] = React.useState(locales[0])
    const [timezone, setTimezone] = React.useState('Etc/UTC');
    const [orientation, setOrientation] = React.useState('horizontal');
    const [data, setData] = React.useState<any>([]);
    const [invalidData, setInvalidData] = React.useState<any>([]);
    const [showInvalidData, setShowInvalidData] = React.useState(false);

    const handleViewChange = React.useCallback(
        (event) => { setView(event.value) },
        [setView]
    )

    const handleDateChange = React.useCallback(
        (event) => { setDate(event.value) },
        [setDate]
    )

    const handleDataChange = React.useCallback(
        ({ created, updated, deleted }) => {
            // Update via API
            created?.forEach((d: ActionItem) => api.actionitem.create(selectedHousehold?.HouseholdID, dreamInterviewId, d));
            created?.forEach((d: ActionItem) => api.actionitem.update(selectedHousehold?.HouseholdID, dreamInterviewId, d?.ActionItemID!, d));

            // Updated
            updated?.forEach((d: ActionItem) => {
                onUpdate({
                    type: IObjectiveDataType.ACTION_ITEM,
                    objectiveId: d.ObjectiveID,
                    actionItemId: d.ActionItemID,
                    actionItem: d
                });
            });
            // Delete
            deleted?.forEach((d: ActionItem) => {
                onRemove({
                    type: IObjectiveDataType.ACTION_ITEM,
                    objectiveId: d.ObjectiveID,
                    actionItemId: d.ActionItemID,
                    actionItem: d
                });
            });
            // Update state
            setData((old: any) => old
                .filter((item: ActionItem) => deleted.find((current: any) => current.TaskID === item.ActionItemID) === undefined)
                .map((item: ActionItem) => updated.find((current: any) => current.TaskID === item.ActionItemID) || item)
                .concat(created.map((item: any) => Object.assign({}, item, { TaskID: guid() }))));
        },
        [setData]
    );

    const refreshData = () => {
        const items = toSchedulerEvents(actionItems);
        setData(items.valid);
        setInvalidData(items.invalid);
    }

    useMountEvents({
        onMounted: async () => {
            refreshData();
        },
        onChange: async () => {
            refreshData();
        },
        watchItems: [actionItems]
    });

    return (
        <div>
            { hasItems(invalidData) ?
              <Alert severity="error" className="alert_empty_data">
                There are <b>{invalidData?.length}</b> out of <b>{actionItems?.length}</b> tasks without dates that are not included in the scheduler. <a href="javascript:void (0)" onClick={() => setShowInvalidData(!showInvalidData)}>{showInvalidData ? 'hide' : 'view'} invalid tasks</a>
                  { showInvalidData ?
                    <>
                        {invalidData?.map((item: any, index: number) => {
                            return (
                              <Box key={index} mr={1} mt={1}>
                                  {item?.Description}
                              </Box>
                            )
                        })}
                    </>
                    : null }
              </Alert>
            : null }
            <LocalizationProvider language={locale.language}>
                <IntlProvider locale={locale.locale} >
                    <Scheduler
                        data={data}
                        onDataChange={handleDataChange}
                        view={view}
                        onViewChange={handleViewChange}
                        date={date}
                        onDateChange={handleDateChange}
                        editable={true}
                        form={ActionItemSchedulerEditor}
                        timezone={timezone}
                        modelFields={schedulerFields}>
                        <TimelineView />
                        <DayView />
                        <WeekView />
                        <MonthView />
                        <AgendaView />
                    </Scheduler>
                </IntlProvider>
            </LocalizationProvider>
        </div>
    )
}

export default ActionItemScheduler;

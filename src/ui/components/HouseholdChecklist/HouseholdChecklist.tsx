import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { processServerError } from '~/services/api/errors';
import useMountEvents from '~/ui/hooks/useMountEvents';
import { Button, Card, CardContent, CardHeader, Grid } from "@material-ui/core";
import DataTableHeaders from "~/ui/components/Data/DataTableHeaders";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import {useStoreState} from "~/store/hooks";
import usePagination from "~/ui/hooks/usePagination";
import useDataViews from "~/ui/hooks/useDataViews";
import { checklistView } from './checklistView';
import checklistTemplate from './checklistTemplate';
import useSortableDataTableHeaders from "~/ui/hooks/useSortableDataTableHeaders";
import {SortDirection} from "~/ui/constants/data";
import {checklistItem, HouseholdChecklist} from "~/types/api/householdChecklist";
import { Checklist } from '~/types/api/checklist';

interface IProps {
    module: string | string[] | undefined,
    checklistData: Checklist;
}

const HouseholdChecklistTable = ({checklistData}:IProps) => {
    const [checklist,setChecklist] = useState<HouseholdChecklist>();
    const {selectedHousehold} = useStoreState((state) => state.household);
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC);

    const loadChecklist = async () => {
        try{
            if(checklistData?.ChecklistID !== undefined){
                const res = await api.householdChecklist.getHouseholdChecklist(selectedHousehold.HouseholdID,checklistData.ChecklistID);
                setChecklist(res.data);
            }
        } 
        catch (err) {
            processServerError(err, 'HouseholdChecklist.loadChecklist');
        } 
    }

    const views = useDataViews(
        checklistView,
        'checklist',
        'Checklist');

    const sortableTasks = useSortableDataTableHeaders(
        checklist?.householdChecklistItems!,
        'household_checklistitems',
        sortDirection,
        'OrderNumber',
        views?.selectedView
    );
    
    const paginatorChecklistItems = usePagination(sortableTasks, 20);

    const clearAllCheckBoxes = async () => {
        try{
            const promises:any = [];
            checklist?.householdChecklistItems.forEach( async (item:checklistItem) => {
            item.IsComplete = false;
            promises.push(api.householdChecklist.updateHouseholdChecklistItem(item?.HouseholdChecklistItemID, item))
            })
            await Promise.all(promises).then((values) => {
            console.log(values);
            });
        }
        catch (err) {
            processServerError(err, 'HouseholdChecklist.clearAllCheckBoxes');
        }
        window.location.reload();
    }

    useMountEvents({
        onMounted: async () => {
            loadChecklist();
        },
    });

    return (        
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title={`${checklistData?.ChecklistName}`}
                    />
                    <CardContent>
                        <div>
                            <Grid container spacing={1}>
                                <Grid item xs={10}></Grid>
                                <Grid item xs={2}>
                                    <Button onClick={()=>{clearAllCheckBoxes()}} variant="outlined" >Clear all checkboxes</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <DataTableHeaders dragEnabled={false} headers={views.getCurrentHeaders()}
                                                    collapse={true} sortEnabled={false}
                                                    tableId="household_checklistItems"/>
                                <DataWrapper isGrouped={false}
                                                paginator={paginatorChecklistItems}
                                                keyLabel="householdchecklist"
                                                propLabel="checklistItem"
                                                component={checklistTemplate}
                                                views={views}/>
                            </Grid>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default HouseholdChecklistTable;
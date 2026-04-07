import React, { useEffect, useState } from 'react';
import { Grid, ListItem, ListItemText, Select } from '@material-ui/core';
import { Person } from '~/types/api/person';
import { DestinyGlobalItem, PlanMember } from '~/types/api/destinyGlobalItem';
import api from '~/services/api';
import Button from "~/ui/components/Button";
import Modal from '~/ui/components/Dialogs/Modal';
import { IDataItemEventConfig } from '~/types/data';
import { PlanMemberCategoryItem } from '~/ui/pages/Destiny/Destiny';
import DestinyPlanItem from '../DestinyPlanItem/DestinyPlanItem';
import InterviewItem from '~/ui/components/Interviews/InterviewItem';
import { NumberUnitLength } from 'luxon';
import DestinyPlanMemberItem from '../PlanMemberItem/PlanMemberItem';
import { PlanMemberItem } from '~/types/api/planMemberItem';

interface DestinyPlanDetailsProps {
    familyMember?: PlanMember;
    planMemberItems?: PlanMemberCategoryItem[];
    person?: Person;
    planId?: number;
    eventConfig?: IDataItemEventConfig;

}

const DestinyPlanDetails = ({familyMember, planMemberItems, person, planId, eventConfig}: DestinyPlanDetailsProps) => {
    const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [selectedDestinyId, setSelectedDestinyId] = useState<number>(0);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<PlanMemberItem>();

    //console.log(planMemberItems);

    const ViewItem = async (itemId: number) => {
        const response = await api.planmember.getDevelopmentPlanItem(itemId);
        //console.log(response.data);
        const planMemberItem = await response.data;
        setSelectedItem(planMemberItem);
        setDetailsDialogOpen(true);
    }

    const CloseItem = () => {
        setDetailsDialogOpen(false);
    }
    
    const ConfirmRemoveItem = async (planMemberItemId: number, destinyItemId: number) => {
        setSelectedId(planMemberItemId);
        setSelectedDestinyId(destinyItemId);
        setShowRemoveDialog(true);
    }

    const onClose = () => {
        setShowRemoveDialog(false);
      };

    const handleRemoval = async () => {
        if(selectedId != 0) {
            const res = await api.planmember.removePlanItems(selectedId);
        }
        else {
            const res2 = await api.planmember.removeAllFamilyPlanItem(selectedDestinyId, planId as number);
        }
        if (eventConfig?.onRemove) {
            eventConfig?.onRemove();
        }
        setShowRemoveDialog(false);

    };

    return (
        <>
            {person ? 
            <>
                <div style={{width: "100%", textAlign: "left", padding: "20px", backgroundColor: "#304256", color: "#ffffff", fontSize: "18px"}}>{person?.FirstName} {person?.LastName}</div>
            </>
            : null }
            { planMemberItems? 
            <>
                <Grid container spacing={2} style={{marginTop: "0px"}}>
                { planMemberItems?.map(cat => {
                    return (
                        <>
                            <Grid key={cat.category} item xs={12} style={{fontSize: "16px", marginLeft: "10px", backgroundColor: "#eef8f7", color: "#000"}}>
                                {cat.category}
                            </Grid>                        
                            {cat.items?.map(item => {
                                return (
                                    <>
                                        <Grid item xs={2} style={{marginLeft: "25px"}}>
                                            {item.Title}
                                        </Grid>
                                        <Grid item xs={5} style={{marginLeft: "25px"}}>
                                            {item.Description}
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button key={item.PlanMemberItemID} type="button" text="View" size="small" variant="contained" color="primary" onClick={() => {
                                                                ViewItem(item.PlanMemberItemID);
                                                            }} />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button key={item.PlanMemberItemID} type="button" text={item.PlanMemberItemID == 0 ? "Remove All" : "Remove"} size="small" variant="contained" color="default" 
                                            onClick={() => {
                                                ConfirmRemoveItem(item.PlanMemberItemID, item.DestinyItemID)}}/>
                                        </Grid>
                                    </>
                                )
                            })}
                        </>
                    )}
                    )
                }
                </Grid>
                <Modal title="Remove"
                isOpen={showRemoveDialog}
                handleClose={onClose}
                closeText="Cancel"
                width="sm"
                handleSubmit={handleRemoval}
                submitText="Yes"
              >
                Are you sure you want to remove?</Modal>
            <Modal
                isOpen={detailsDialogOpen}
                handleClose={CloseItem}
                closeText="Close"
                width="lg" title={undefined}>
                <DestinyPlanMemberItem planMemberItem={selectedItem} />
            </Modal>
            </>
            :
            <div>
                No Items
            </div>
            }
        </>
    )
}

export default DestinyPlanDetails;
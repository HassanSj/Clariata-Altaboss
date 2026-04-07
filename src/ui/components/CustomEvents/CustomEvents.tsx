import { Button, Grid, Icon } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import api from '~/services/api';
import { Person } from '~/types/api/person';
import { TimelineItem } from '~/types/api/timelineItem';
import useMountEvents from '~/ui/hooks/useMountEvents';
import EmptyContainer from '../Containers/EmptyContainer';
import Modal from '../Dialogs/Modal';
import TimelineDialog from '../Dialogs/TimelineDialog';
import EventTypes from '../Dialogs/TimelineDialog/shared/EventTypes';
import style from "./CustomEvents.module.scss"
import classnames from "classnames";
export const CustomEvents = (): ReactElement => {
  const [isLoading, setLoading] =  useState<boolean>(false);
  const [events, setEvents] = useState<any>();
  const [ value , setValue] = useState<any>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddItem, setShowAddItem] = React.useState(false);
  const [selectedTimelineItem, setSelectedItem] = useState<TimelineItem>();
  const { selectedHousehold } = useStoreState(state => state.household);
  const {persons} = useStoreState(state => state.person)
  console.log("Persons",persons);
  
  const matchPerson = (personID : any) => 
  {
    if(personID === 0){
      return "Both"
    }
    let personName = ""
    persons.map((person : Person)=>{
      if(person?.PersonID === personID && person?.FirstName)
      {
        personName =  person?.FirstName
      }
      
    })
    return personName;
  }
  const fetchCustomEvents = async () => {
    setLoading(true);
    const customItems = await api.timelineItem.list(selectedHousehold?.HouseholdID, -1);
    const sortedCustomEvents = customItems?.data?.sort(function (left, right) {
      return moment.utc(left?.EventDate).diff(moment.utc(right?.EventDate));
    });    
    setEvents(sortedCustomEvents);
    setLoading(false);
  };
  const AddEditTimelineItem = async () => {
    setSelectedItem(undefined);
    setShowAddItem(false);
    await fetchCustomEvents();
  };

  const deleteTimelineItem  : any= async () => {
    if (value) {
      const res = await api.timelineItem.remove(
        selectedHousehold?.HouseholdID,
        '',
        String(value?.TimelineItemID),
      );
      setSelectedItem(undefined);
      await fetchCustomEvents();
      setShowDeleteDialog(false);
    }
  };
  const onClose = () => {
    setShowDeleteDialog(false);
  };
  const CloseAddItem = () => {
    setSelectedItem(undefined);
    setShowAddItem(false);
  };
  
  const matchCustomType = (typeID:any) => {
    let eventType = "";
    EventTypes?.map((event:any)=>{
      if(event?.value == typeID){
         eventType = event?.label
      }
    })
    return eventType;
  }

  useMountEvents({
    onMounted: async () => {
      await fetchCustomEvents();
    },
  });

  return (
    <>
      {!isLoading ? (
        <>
          <h1 style={{marginLeft:"50px"}}>CUSTOM EVENTS</h1>
          <Grid container spacing={1}>
            <Grid item xs={11}></Grid>
            <Grid item xs={1}>
              <Button
              style={{marginTop: "-108px",
                marginLeft: "-167px"}}
                size="medium"
            
                variant="contained"
                color="primary"
                startIcon={<Icon>add</Icon>}
                onClick={() => setShowAddItem(true)}
              >
                Add Event
              </Button>
            </Grid>
          </Grid>
      
          <div className={classnames(style.container)}>
            <table className={classnames(style.customeventTable)}>
              <thead className={classnames(style.tableHead)}>
              <tr className={classnames(style.tableRow)}>
                <th className={classnames(style.tableHeader)}></th>
                <th className={classnames(style.tableHeader)}>Event Name</th>
                <th className={classnames(style.tableHeader)}>Description</th>
                <th className={classnames(style.tableHeader)}>Event Type</th>
                <th className={classnames(style.tableHeader)}>Client</th>
                <th className={classnames(style.tableHeader)}>Date</th>
                <th className={classnames(style.tableHeader)}>Options</th>
              </tr>
              </thead>
              <tbody className={ classnames(style.tableBody)}>
              {(events?.length  < 1) ?
              <EmptyContainer text="No Data"/> 
              :
                events?.map((value: any, index: any) => {
                  return (
                   
                        <tr key={index}>
                        <td className={classnames (style.tableData)}>{index + 1}</td>
                        <td className={classnames (style.tableData)} style={{textTransform: "capitalize"}}>{value?.EventName}</td>
                        <td className={classnames (style.tableData)} style={{textTransform: "capitalize"}}>{value?.Description}</td>
                        <td className={classnames (style.tableData)} style={{textTransform: "capitalize"}}>{matchCustomType(value?.EventTypeId)}</td>
                        <td className={classnames (style.tableData)} style={{textTransform: "capitalize"}}>{matchPerson(value?.PersonId)}</td>
                        <td className={classnames (style.tableData)}>{moment(value?.EventDate).format('Do MMMM YYYY')}</td>
                        <td className={classnames (style.tableData)} style={{textAlign: "center"}}>
                          <Button
                          style={{marginRight:" 5rem",
                            fontSize:" 12px",
                            borderRadius:" 23px",}}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSelectedItem(value);
                              setShowAddItem(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                           style={{
                            marginLeft: "-64px",
                           fontSize:" 12px",
                           borderRadius:" 23px",}}
                          className="buttonData"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              // setSelectedItem(value);
                              setSelectedItem(value?.EventName)
                              setValue(value)
                              setShowDeleteDialog(true);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                
                   
                  );
                })
              }
            </tbody>
            </table>
          </div>
          <Modal
            title="Delete Item"
            isOpen={showDeleteDialog}
            handleClose={onClose}
            closeText="Cancel"
            width="sm"
            handleSubmit={deleteTimelineItem}
            submitText="Yes"
          >
            Are you sure you want to delete {selectedTimelineItem}?
          </Modal>
        </>
      ) : null}
      {showAddItem ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TimelineDialog
            item={selectedTimelineItem ? selectedTimelineItem : undefined}
            isOpen={showAddItem}
            onClose={CloseAddItem}
            onSave={AddEditTimelineItem}
          />
        </div>
      ) : null}
    </>
  );
};

export default CustomEvents;

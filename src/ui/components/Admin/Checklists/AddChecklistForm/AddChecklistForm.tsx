import React, { useState, useEffect , useLayoutEffect } from 'react';
import { DialogActions, Card, CardHeader, ListItemText, OutlinedInput, Chip } from "@material-ui/core";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { ChecklistItem } from "~/types/api/checklistItem";
import { Grid, InputLabel, TextField, Select, MenuItem, Checkbox } from '@material-ui/core';
import { Checklist } from '~/types/api/checklist';
import modules from '../Shared/Modules';
import useMountEvents from '~/ui/hooks/useMountEvents';
import { Resource } from '~/types/api/resource';
import arrayMove from '../Shared/arrayMove';
import { ReportTypes } from '~/ui/constants/reports';
import DataTableHeaders from '~/ui/components/Data/DataTableHeaders';
import DataWrapper from '~/ui/components/Data/DataWrapper';
import Loader from '~/ui/components/Loader';
import useChecklistDraggables from '~/ui/hooks/useChecklistDraggables';
import { checklistItemViews } from '~/ui/constants/checklistsItems';
import useDataViews from '~/ui/hooks/useDataViews';
import useNotifications from '~/ui/hooks/useNotifications';
import ChecklistItemTemplate from '../Shared/components/ChecklistItemTemplate';
import { IDataItemEventConfig } from '~/types/data';

interface IChecklistProps {
    onClose: () => unknown;
    reload: () => unknown;
}

export const AddChecklistForm = ({ onClose, reload}: IChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [itemTask, setItemTask] = useState<string>('');
  const [itemWho, setItemWho] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResources, setSelectedResources] = useState<number[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [checklistID, setChecklistID] = useState<number>();
  const notifications = useNotifications();
  const [deleteItem, setDeleteItem] = useState<ChecklistItem>();
  const onOrderUpdate = (items: ChecklistItem[]) => {
    items?.forEach((ci: ChecklistItem, index: number) => {
      ci.OrderNumber = index + 1;
    });
  };

  const createChecklist = async (checklist: Checklist) => {
    checklist.ChecklistID = checklistID;
    const res = await api.checklists.updateChecklist(checklistID, checklist);
    if (checklistItems?.length > 0) {
      checklistItems.forEach(async item => {
        const resChecklistItem = await api.checklists.updateChecklistItem(checklistID, item);
      });
    }
    reload();
    onClose();
  };

  const AddChecklistItem = async () => {
    let items = checklistItems || [];

    let checklistItem: ChecklistItem = {
      ChecklistID: checklistID,
      ChecklistItemTask: itemTask,
      ChecklistItemWho: itemWho,
      ChecklistItemResource: selectedResources?.map(resource => String(resource)).join(','),
      ChecklistItemReport: selectedReports?.map(report => String(report)).join(','),
      OrderNumber: draggedItems ? draggedItems?.length + 1 : 1,
    };

    const res = await api.checklists.addChecklistItem(checklistItem);

    items?.push(res?.data);
    setChecklistItems(items);
    setSelectedReports([]);
    setSelectedResources([]);
    clearFields();
    setModalOpen(false);
  };

  const clearFields = () => {
    setItemTask('');
    setItemWho('');
  };
  

  const handleAddResourceChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setSelectedResources(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAddReportChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setSelectedReports(typeof value === 'string' ? value.split(',') : value);
  };

  const cancel = async () => {
    const res = await api.checklists.deleteChecklist(checklistID);
    onClose();
  };


  const views = useDataViews(checklistItemViews, 'checklistItem', 'Checklist Items');

  const isDragEnables = () => true;

  const onDropUpdate = async (items: ChecklistItem[]) => {
    notifications.toggleLoading(true);
    onOrderUpdate(items);
    notifications.toggleLoading(false);
    notifications.addSuccessNotification('Checklist Items Updated!');
  };
  const { draggedItems, handleDropEvent, lastDragEvent, handleDragEvent, handleDragEnd } = useChecklistDraggables(
    checklistItems,
    'ChecklistItemID',
    true,
    onDropUpdate,
    true,
  );

  const loadChecklistItems = async (checklistID: number) => {
    const res = await api.checklists.getChecklistItems(checklistID);
    const checklistData = res?.data;
    setChecklistItems(checklistData);
    console.log('Mounted :', checklistItems);
  };

  const eventConfig: IDataItemEventConfig = {
    onItemDragEvent: handleDragEvent,
    onItemDragEndEvent: handleDragEnd,
    onItemDropEvent: handleDropEvent,
    lastDragEvent,
    // onChange: loadChecklistItems(checklistID ? checklistID : 0),
    onRemove: onOrderUpdate(draggedItems),
  };

  const setOnDelete = async () => {
    await loadChecklistItems(checklistID!);
  }
  
  useMountEvents({
    onMounted: async () => {
      const res = await api.resource.getAllResources();
      setResources(res?.data);
      const checklist = await api.checklists.addNewChecklist({ ChecklistName: '', ChecklistType: '' });
      setChecklistID(checklist?.data?.ChecklistID);
      setChecklistItems(draggedItems)
    },
  });

  return (
    <>
      <Card>
        <CardHeader
          title="Add A Checklist"
          action={
            <>
              <div></div>
            </>
          }
        />
        <FormWrapper onSubmit={createChecklist} initialValues={initialValues}>
          <Grid container spacing={2}>
            <Grid xs={4} item>
              <InputField
                type="text"
                name="ChecklistName"
                placeholder="Name"
                component={Input}
                label="Name"
                required={true}
              />
            </Grid>
            <Grid xs={4} item>
              <InputField
                type="select"
                name="ChecklistType"
                component={Input}
                label="Select Module"
                items={modules}
                required={true}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid xs={2} item>
              <Button
                type="button"
                text="Add Item"
                size="large"
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ paddingTop: '2rem' }}>
            <Grid xs={12} item style={{ backgroundColor: '#E7EBF0', width: '100%' }}>
              <DataTableHeaders
                dragEnabled={isDragEnables()}
                headers={views?.getCurrentHeaders()}
                collapse={!isDragEnables()}
                sortEnabled={!isDragEnables()}
                tableId="direction_tasks"
              />
              <DataWrapper
                isGrouped={false}
                data={draggedItems}
                keyLabel="ChecklistItemID"
                propLabel="checklistitem"
                views={views}
                component={ChecklistItemTemplate}
                componentProps={{onDelete: setOnDelete}}
                eventConfig={eventConfig}
                isDragging={isDragEnables()}
              />
            </Grid>
          </Grid>

          <DialogActions style={{ paddingTop: '2rem' }}>
            <Button type="submit" text={'Create Checklist'} variant="contained" size="large" color="primary" />
            <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={cancel} />
          </DialogActions>
        </FormWrapper>
        <Modal
          title="Add Checklist Item"
          isOpen={modalOpen}
          handleClose={() => setModalOpen(false)}
          width="md"
          submitText="Add"
        >
          <div>
            <InputLabel>Task</InputLabel>
            <TextField
              type="text"
              name="ChecklistItemTask"
              variant="outlined"
              onChange={e => setItemTask(e.target.value)}
              required
            ></TextField>
          </div>
          <div style={{ marginTop: '20px' }}>
            <InputLabel>Who</InputLabel>
            <Select
              fullWidth={true}
              style={{ height: '60px' }}
              labelId="selectWho"
              label="Select Who"
              onChange={e => setItemWho(String(e.target.value))}
              displayEmpty
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem value={'Advisor'}>Advisor</MenuItem>
              <MenuItem value={'Client'}>Client</MenuItem>
              <MenuItem value={'Advisor/Client'}>Advisor/Client</MenuItem>
            </Select>
          </div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ marginTop: '20px' }}>
              <InputLabel>Resources</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                fullWidth={true}
                style={{ height: '60px' }}
                label="Select Who"
                onChange={handleAddResourceChange}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                }}
                value={selectedResources}
                name="ChecklistItemResource"
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected: any) => {
                  return `${selected?.length} resource(s) selected`;
                }}
              >
                {resources?.map(resource => {
                  return (
                    <MenuItem key={resource?.ResourceId} value={resource?.ResourceId}>
                      <Checkbox checked={selectedResources.indexOf(resource?.ResourceId) > -1} />
                      <ListItemText primary={resource?.ResourceTitle} />
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div style={{ marginTop: '20px' }}>
              <InputLabel>Reports</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                fullWidth={true}
                style={{ height: '60px' }}
                label="Select Who"
                onChange={handleAddReportChange}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                }}
                value={selectedReports}
                name="ChecklistItemReport"
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected: any) => {
                  return `${selected?.length} report(s) selected`;
                }}
              >
                {Object.keys(ReportTypes)?.map(key => {
                  return (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={selectedReports?.indexOf(key) > -1} />
                      <ListItemText primary={key} />
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <DialogActions>
            <Button
              type="submit"
              text="Add"
              variant="contained"
              size="large"
              color="primary"
              onClick={() => {
                AddChecklistItem();
              }}
            />
            <Button
              type="button"
              text="Cancel"
              size="large"
              variant="contained"
              color="default"
              onClick={() => setModalOpen(false)}
            />
          </DialogActions>
        </Modal>
      </Card>
    </>
  );
};

export default AddChecklistForm;
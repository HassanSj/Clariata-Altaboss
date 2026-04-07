import React, {ReactElement, useState} from 'react';
import classnames from 'classnames';
import {Checkbox, DialogActions, Divider, Grid, Icon, InputLabel, ListItemText, Menu, MenuItem, OutlinedInput, Select, TextField,} from "@material-ui/core";
import useNotifications from "~/ui/hooks/useNotifications";
import {Objective} from "~/types/api/objective";
import useMountEvents from "~/ui/hooks/useMountEvents";
import IconButton from "@material-ui/core/IconButton";
import Button from "~/ui/components/Button";
import {useDrag, useDrop} from "react-dnd";
import {DragAndDropItem, IDataItemEventConfig, IDataTableHeader, IDataTableView} from "~/types/data";
import {CrudActionType} from "~/ui/constants/data";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {isNullOrUndefined} from "~/ui/constants/utils";
import Modal from '~/ui/components/Dialogs/Modal';
import { Resource } from '~/types/api/resource';
import api from '~/services/api';
import { ReportTypes } from '~/ui/constants/reports';
import { ChecklistItem } from '~/types/api/checklistItem';
import { IChecklistItemCellTemplateProps } from '~/types/checklist/checklistItem';

interface ITemplateProps extends IChecklistItemCellTemplateProps {
  view: IDataTableView,
  i: IDataTableHeader,
  item: Objective,
  iIndex: number,
}

interface IProps {
  index?: number;
  checklistitem?: ChecklistItem
  views: any;
  onChange?: any;
  eventConfig?: IDataItemEventConfig;
  dragEnabled: boolean;
  onDelete: any;
}

const ChecklistItemTemplate = ({checklistitem, views, index, eventConfig, dragEnabled, onDelete}: IProps): ReactElement => {
  const [itemTask, setItemTask] = useState<string>('');
  const [itemWho, setItemWho] = useState<string>('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [editResources, setEditResources] = useState<number[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [editReports, setEditReports] = useState<string[]>([]);
  const [resourcesChanged, setResourcesChanged] = useState<boolean>(false);
  const [reportsChanged, setReportsChanged] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const notifications = useNotifications();

    const loadResources = async () => {
      const res = await api.resource.getAllResources();
      setResources(res?.data);
    };

    const handleEditResourceChange = (e: any) => {
      const {
        target: { value },
      } = e;
      setEditResources(typeof value === 'string' ? value.split(',') : value);
      setResourcesChanged(true);
    };

    const handleEditReportChange = (e: any) => {
      const {
        target: { value },
      } = e;
      setEditReports(typeof value === 'string' ? value.split(',') : value);
      setReportsChanged(true);
    };

    const editChecklistItem = async () => {
      if (checklistitem) {
        checklistitem.ChecklistItemTask = itemTask === '' ? checklistitem.ChecklistItemTask : itemTask;
        checklistitem.ChecklistItemWho = itemWho === '' ? checklistitem.ChecklistItemWho : itemWho;
        checklistitem.ChecklistItemResource = resourcesChanged
          ? editResources?.map(resource => String(resource)).join(',')
          : checklistitem?.ChecklistItemResource;
        checklistitem.ChecklistItemReport = reportsChanged
          ? editReports?.map(resource => String(resource)).join(',')
          : checklistitem?.ChecklistItemReport;
      }
      const res = await api.checklists.updateChecklistItem(checklistitem?.ChecklistItemID, checklistitem)
      setResourcesChanged(false);
      setReportsChanged(false);
    };


    useMountEvents({
      onMounted: async () => {
        await loadResources();
        parseEditReports(checklistitem!);
        parseEditResourceIDs(checklistitem!);
      },
    });

  // Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Edit modal
  const editItem = async () => {
    setShowEditDialog(true);    
  }

  const deleteItem = async () => {
    notifications.toggleLoading(true);
    const deleteRes = await api.checklists.deleteChecklistItem(checklistitem?.ChecklistItemID);
    onDelete();
    if(eventConfig?.onRemove){
      eventConfig?.onRemove()
    }
    notifications.toggleLoading(false);
  }

  // Dragging
  const [dndId, setDndId] = useState(checklistitem?.ChecklistItemID);
  const [{isDragging}, drag] = useDrag({
    item: {type: 'CHECKLIST_ITEM', id: dndId, originalIndex: index},
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult: any, monitor: any) => {
      const {id: droppedId, originalIndex} = monitor.getItem()
      const didDrop = monitor.didDrop();
      if (eventConfig?.onItemDragEndEvent) {
        eventConfig?.onItemDragEndEvent();
      }
      if (!didDrop) {
        // moveCard(droppedId, originalIndex);
      }

    },
  });
  const [{isHoveredOver}, drop] = useDrop({
    accept: 'CHECKLIST_ITEM',
    canDrop: () => true,
    collect: (monitor: any) => ({
      isHoveredOver: monitor.isOver()
    }),
    drop({id: draggedId}: DragAndDropItem) {
      if (String(draggedId) !== String(dndId)) {
        if (eventConfig?.onItemDropEvent) {
          eventConfig?.onItemDropEvent({
            type: CrudActionType.MOVE,
            targetItemId: String(dndId),
            itemId: String(draggedId)
          });
        }
      }
    }
  });

  const parseEditResourceIDs = (item:ChecklistItem) => {
    if (item?.ChecklistItemResource?.length > 0){
        const idArray = item?.ChecklistItemResource?.split(",").map(Number);
        setEditResources(idArray);
    }
}

const parseEditReports = (item:ChecklistItem) => {
    if (item?.ChecklistItemReport?.length! > 0){
        const reportArray = item?.ChecklistItemReport?.split(",").map(String);
        setEditReports(reportArray!);
    }
}

  return (
    <>
      <div
        className={classnames(
          'item_card',
          { item_card_drag_target_placeholder: isHoveredOver },
          { item_card_drag_hover_placeholder: isDragging },
        )}
        ref={node => {
          if (dragEnabled) drag(drop(node));
        }}
      >
        <div className={'item_content'}>
          <Grid container spacing={1}>
            {views?.getCurrentHeaders()?.map((i: any, iIndex: number) => {
              if ((i.onlyOnNoDrag && !dragEnabled) || !i.onlyOnNoDrag)
                return (
                  <Grid
                    container
                    item
                    xs={i?.collapsedWidth && !dragEnabled ? i?.collapsedWidth : i?.width}
                    key={iIndex}
                    alignContent="center"
                  >
                    <div className={classnames('item_cell', { ['item_cell_first']: iIndex === 0 })}>
                      {!isNullOrUndefined(i?.component)
                        ? React.createElement(i.component, {
                            props: {
                              key: `${1}-${iIndex}`,
                              checklistitem,
                            },
                          })
                        : null}
                    </div>
                  </Grid>
                );
              else return null;
            })}
            <Grid container item xs={1} justifyContent="flex-end">
              <div className={classnames('item_cell_menu')}>
                <div className={classnames('item_cell_menu_button')}>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClickMenu}
                  >
                    <Icon>more_vert</Icon>
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={openMenu}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    <MenuItem
                      key={'edit'}
                      onClick={() => {
                        editItem().then();
                        handleCloseMenu();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      key={'delete'}
                      onClick={() => {
                        setShowDeleteConfirmation(true);
                        handleCloseMenu();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              <ConfirmationModal
                isOpen={showDeleteConfirmation}
                onConfirm={deleteItem}
                onCancel={() => setShowDeleteConfirmation(false)}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      {showEditDialog ? (
        <Modal
          title="Edit Checklist Item"
          isOpen={showEditDialog}
          handleClose={() => setShowEditDialog(false)}
          width="md"
          submitText="Add"
        >
          <div>
            <InputLabel>Task</InputLabel>
            <TextField
              defaultValue={checklistitem?.ChecklistItemTask}
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
              defaultValue={checklistitem?.ChecklistItemWho}
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
                onChange={handleEditResourceChange}
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
                value={editResources}
                name="ChecklistItemResource"
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected: any) => {
                  return `${selected?.length} resource(s) selected`;
                }}
              >
                {resources?.map(resource => {
                  return (
                    <MenuItem key={resource?.ResourceId} value={resource?.ResourceId}>
                      <Checkbox checked={editResources.indexOf(resource?.ResourceId) > -1} />
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
                onChange={handleEditReportChange}
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
                value={editReports}
                name="ChecklistItemReport"
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected: any) => {
                  return `${selected?.length} report(s) selected`;
                }}
              >
                {Object.keys(ReportTypes)?.map(key => {
                  return (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={editReports.indexOf(key) > -1} />
                      <ListItemText primary={ReportTypes[key].name} />
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <DialogActions>
              <Button
                type="submit"
                text="Save"
                variant="contained"
                size="large"
                color="primary"
                onClick={() => {
                  editChecklistItem();
                  setShowEditDialog(false);
                }}
              />
              <Button
                type="button"
                text="Cancel"
                size="large"
                variant="contained"
                color="default"
                onClick={() => {
                  setShowEditDialog(false);
                }}
              />
            </DialogActions>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default ChecklistItemTemplate;

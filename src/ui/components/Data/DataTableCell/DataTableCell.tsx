import React, {useState} from "react";
import {Box, CircularProgress, DialogActions, DialogTitle, Grid, Icon, Popover} from "@material-ui/core";
import Button from "~/ui/components/Button";
import styles from './DataTableCell.module.scss';
import classnames from 'classnames';
import DataTableCellInput from "~/ui/components/Data/DataTableCellInput";
import {IFormInputFormikProps, IFormInputValue} from "~/types/forms";
import {hasItems, isNullOrUndefined} from "~/ui/constants/utils";
import IconButton from "@material-ui/core/IconButton";
import {uniqueId} from 'lodash';

interface IProps {
  children: React.ReactNode;
  isLoading?: boolean;
  saveOnEnter?: boolean;
  inputProps?: IFormInputFormikProps;
  inputProps2?: IFormInputFormikProps;
  inputProps3?: IFormInputFormikProps;
  onSave?: (update: IFormInputValue[]) => any;
  onEdit?: () => any;
  onOpen?: () => any;
  editable?: boolean
}

const DataTableCell = (props: IProps) => {

  const [currentValue, setCurrentValue] = useState<IFormInputValue | undefined>({
    field: props?.inputProps?.field?.name,
    value: props?.inputProps?.field?.value
  });
  const [currentValue2, setCurrentValue2] = useState<IFormInputValue | undefined>({
    field: props?.inputProps2?.field?.name,
    value: props?.inputProps2?.field?.value
  });
  const [currentValue3, setCurrentValue3] = useState<IFormInputValue | undefined>({
    field: props?.inputProps3?.field?.name,
    value: props?.inputProps3?.field?.value
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const id = uniqueId('id_');

  const toggleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    if(props.editable === false) return;
    if (isEditing) return;
    if (!isEditing) {
      if (props?.onEdit) {
        props?.onEdit();
      }
    }
    setIsEditing(true);
    setAnchorEl(event.currentTarget);
  }

  const handleSave = async () => {
    setIsSaving(true);
    if (isEditing && currentValue && props?.onSave) {
      const items = [];
      if (currentValue && currentValue?.field) items.push(currentValue);
      if (currentValue2 && currentValue2?.field) items.push(currentValue2);
      if (currentValue3 && currentValue3?.field) items.push(currentValue3);
      if (hasItems(items)) {
        await props?.onSave(items);
      }
    }
    setIsEditing(false);
    setIsSaving(false);
  }

  const handleUpdate = (update: IFormInputValue) => {
    setCurrentValue(update);
  }

  const handleUpdate2 = (update: IFormInputValue) => {
    setCurrentValue2(update);
  }

  const handleUpdate3 = (update: IFormInputValue) => {
    setCurrentValue3(update);
  }

  const handleClose = () => {
    setIsEditing(false);
    setAnchorEl(null);
  }

  return (
    <Grid aria-describedby={id}
          onClick={(props?.inputProps && !isEditing) ? ((e: any) => toggleEdit(e)) : undefined}
          justifyContent={props?.isLoading ? "center" : undefined}
          className={classnames(styles.cell, {[styles.clickable]: !isNullOrUndefined(props?.inputProps)})}
          container
          item>
      {props?.isLoading ? <CircularProgress size="1rem"/> : null}
      {!props?.isLoading ? props?.children : null}
      {!props?.isLoading && isEditing && props?.inputProps ?
        <>
          <Popover
            id={id}
            open={isEditing}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}>
            <DialogTitle className={styles.popover_header}>
              <span className={styles.popover_header_title}>Edit</span>
              <IconButton className={styles.close_icon}
                          edge="end"
                          color="inherit"
                          onClick={handleClose}
                          aria-label="close">
                <Icon>close</Icon>
              </IconButton>
            </DialogTitle>
            <Box className={styles.popover_content} p={2}>
              <DataTableCellInput inputProps={{
                ...props?.inputProps,
                // Custom on change for the date select
                // @ts-ignore
                onChange(data){
                  handleUpdate({field: data.target.name, value: data.target.value})
                }
              }}
                                  onUpdate={handleUpdate}
                                  onSave={handleSave}/>
              {props?.inputProps2 ?
                <Box mt={1}>
                  <DataTableCellInput inputProps={props?.inputProps2}
                                      onUpdate={handleUpdate2}
                                      onSave={handleSave}/>
                </Box>
              : null}
              {props?.inputProps3 ?
                <Box mt={1}>
                  <DataTableCellInput inputProps={props?.inputProps3}
                                      onUpdate={handleUpdate3}
                                      onSave={handleSave}/>
                </Box>
                : null}
            </Box>
            <DialogActions>
              <Button text="Save"
                      onClick={handleSave}
                      color='default'/>
              <Button text="Cancel"
                      onClick={handleClose}
                      color='default'/>
            </DialogActions>
          </Popover>

        </>
        : null}
    </Grid>
  )
}

export default DataTableCell;

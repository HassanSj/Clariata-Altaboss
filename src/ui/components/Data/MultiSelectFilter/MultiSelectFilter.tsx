import {Box, Checkbox, Chip, FormControlLabel, FormGroup, Grid, Icon, Popover, Tooltip} from "@material-ui/core";
import React from "react";
import styles from './MultiSelectFilter.module.scss';
import {hasItems, isNullOrUndefined} from "~/ui/constants/utils";
import IconButton from "@material-ui/core/IconButton";
import {removeItemAtIndex} from "~/ui/constants/data";

interface IProps {
  id?: string;
  label: string;
  filterValue: any;
  filterOptions: any[];
  onUpdate?: (v: any) => any;
  noValueText?: string;
  icon?: string;
}

const MultiSelectFilter = ({id = 'multiselectfilter',
                             label,
                             filterValue,
                             filterOptions,
                             onUpdate,
                             noValueText = '0 filters',
                             icon = 'filter_alt'}: IProps) => {
  const [values, setValues] = React.useState<any | number[]>();
  const [state, setState] = React.useState<any | undefined>(filterValue && Array.isArray(filterValue) ? filterValue : []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState =  {...state, [event.target.name]: event.target.checked};
    if (checkIsChecked(event.target.name)) {
      delete newState[event.target.name];
    } 
      const newValues = Object.keys(newState)?.map((k: string) => Number(k));
      setState(newState);
      setValues(newValues);
      if (onUpdate) {
        if (hasItems(newValues)) {
          onUpdate(newValues);
        } else {
          onUpdate([]);
        }
      }
  };

  const checkIsChecked = (val: any) => {
    return !isNullOrUndefined(state[val]) && Boolean(state[val]);
  };

  const handleRemove = (index: number) => {
    const newValues = removeItemAtIndex(values, index);
    setState(newValues);
    setValues(newValues);
    if (onUpdate) {
      onUpdate(newValues);
    }
  }

  const handleClear = () => {
    setState([]);
    setValues([]);
    if (onUpdate) {
      onUpdate([]);
    }
  }

  // Popup
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const adjustedId = open ? id : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(open ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Selected
  const getLabel = (value: number) => {
    const item = filterOptions?.find((i: any) => i.value === value);
    return item?.label;
  }

  return (
    <>
      <Box aria-describedby={adjustedId} className={styles.selected}>
        <Grid container spacing={1}>
          <Grid container item xs={9}>
            {hasItems(values) ?
              <>
                {values?.map((v: any, index: number) => {
                  return (
                    <Chip label={getLabel(v)}
                          className={styles.chip}
                          deleteIcon={<Icon>clear</Icon>}
                          onDelete={() => handleRemove(index)}/>
                  )
                })}
              </>
              : <span>{noValueText}</span>}
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end">
            <Tooltip title="Change filters">
              <IconButton size="small"
                          onClick={handleClick}>
                <Icon>{icon}</Icon>
              </IconButton>
            </Tooltip>
            {(hasItems(values)) ?
              <Tooltip title="Clear">
                <IconButton size="small"
                            onClick={handleClear}>
                  <Icon>close</Icon>
                </IconButton>
              </Tooltip>
              : null}
          </Grid>
        </Grid>
      </Box>
      <Popover
        id={adjustedId}

        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <div className={styles.popup}>
          <FormGroup>
            {filterOptions?.map((item: any, index: number) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox
                    size="small"
                    checked={state[item.value] ? true : false}
                    onChange={handleCheckboxChange}
                    name={String(item.value)}/>
                  }
                  label={String(item.label)}
                />
              )
            })}
          </FormGroup>
          {!hasItems(filterOptions) ? 'No options found.' : null}
        </div>
      </Popover>

    </>
  )
}

export default MultiSelectFilter;

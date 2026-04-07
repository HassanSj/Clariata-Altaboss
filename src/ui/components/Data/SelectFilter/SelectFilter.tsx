import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  Popover,
  Radio,
  RadioGroup,
  Tooltip
} from "@material-ui/core";
import React from "react";
import styles from "~/ui/components/Data/MultiSelectFilter/MultiSelectFilter.module.scss";
import {hasItems, isNullOrUndefined} from "~/ui/constants/utils";
import IconButton from "@material-ui/core/IconButton";

interface IProps {
  id?: string;
  label: string;
  filterValue: any;
  filterOptions: any[];
  noValue: any;
  noValueText: string;
  icon: string;
}

const SelectFilter = ({id = 'selectfilter', label, filterValue, filterOptions, noValue, noValueText, icon}: IProps) => {

  // Change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    filterValue.setValue(event.target.value);
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
      <Box aria-describedby={adjustedId} className={styles.selected} onClick={handleClick}>
        <Grid container spacing={1}>
          <Grid container item xs={9}>
            {(!isNullOrUndefined(filterValue.value) && filterValue.value !== noValue) ?
              <>
                <Chip label={getLabel(filterValue.value)}
                      className={styles.chip}
                      deleteIcon={<Icon>clear</Icon>}
                      onDelete={() => filterValue.setValue(undefined)}/>
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
            {(!isNullOrUndefined(filterValue.value) && filterValue.value !== noValue) ?
              <Tooltip title="Clear">
                <IconButton size="small"
                            onClick={() => filterValue.setValue(noValue)}>
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
          <FormControl fullWidth={true}>
            <RadioGroup value={filterValue.value} onChange={handleChange}>
              {filterOptions?.map((item: any, index: number) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={<Radio/>}
                    value={String(item.value)}
                    label={String(item.label)}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
          {!hasItems(filterOptions) ? 'No options found.' : null}
        </div>
      </Popover>
    </>
  )
}

export default SelectFilter;

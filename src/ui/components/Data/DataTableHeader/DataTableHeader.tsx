import {Grid, Icon, makeStyles, Popover, Tooltip, Typography} from "@material-ui/core";
import React from "react";
import {IDataTableHeader} from "~/types/data";
import styles from './DataTableHeader.module.scss';
import classnames from 'classnames';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {SortDirection} from "~/ui/constants/data";
import {useStoreActions, useStoreState} from "~/store/hooks";

interface IProps {
  tableId?: string;
  header: IDataTableHeader;
  onSort?: (field: string, direction: SortDirection) => undefined;
  sortEnabled?: boolean;
  collapse?:boolean;
}

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    width: 350
  },
}));

const DataTableHeader = ({ tableId, header, sortEnabled, collapse }: IProps) => {
  const classes = useStyles();

  const { currentTableId, sortDirection, sortByField } = useStoreState(state => state.layout);
  const { onSort } = useStoreActions(actions => actions.layout);

  const onClick = async () => {
    if (!header?.sortable || (currentTableId !== tableId) || !sortEnabled) {
      return;
    }
    await onSort({
      currentTableId,
      sortDirection,
      sortByField: header?.field,
      selectedHeader: header
    })
  }

  const onToggleSortDirection = async () => {
    if (!header?.sortable || (currentTableId !== tableId) || !sortEnabled) {
      return;
    }
    await onSort({
      currentTableId,
      sortDirection: sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
      sortByField: header?.onSort ? header?.onSort : header?.field,
      selectedHeader: header
    })
  }

  // Popover
  const hasPopover = (!isNullOrUndefined(header) && !isNullOrUndefined(header.description));
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasPopover) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (!hasPopover) return;
    setAnchorEl(null);
  };

  return (
   <>
     <Grid className={classnames(styles.wrapper, { [styles.sortable]: Boolean(header.sortable) })}
           item xs={header.collapsedWidth && collapse ? header.collapsedWidth! : header.width}
           onClick={(sortByField === header?.field) ? onToggleSortDirection : onClick}>
       <Typography className={classnames(styles.header)}
            onMouseEnter={hasPopover ? handleOpen : undefined}
            onMouseLeave={hasPopover ? handleClose : undefined}>
         {header.title}
       </Typography>
       { header?.sortable && (sortByField === header?.field) && (currentTableId === tableId) ?
         <span className={styles.sorting}>
             <Tooltip title="Sort">
               { (sortDirection === SortDirection.DESC) ? <Icon className={styles.icon} onClick={() => onToggleSortDirection()}>arrow_upward</Icon> : <Icon className={styles.icon} onClick={() => onToggleSortDirection()}>arrow_downward</Icon>}
             </Tooltip>
           </span>
         : null }
       <Popover
         id="mouse-over-popover"
         className={classes.popover}
         classes={{
           paper: classes.paper,
         }}
         open={open}
         anchorEl={anchorEl}
         onClose={handleClose}
         anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'top',
           horizontal: 'left',
         }}
         disableRestoreFocus>
         {header.description}
       </Popover>
     </Grid>
   </>
  )
}

export default DataTableHeader;

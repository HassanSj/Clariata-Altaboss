import {IDataTableHeader} from "~/types/data";
import {Grid, SortDirection} from "@material-ui/core";
import React from "react";
import DataTableHeader from "~/ui/components/Data/DataTableHeader";
import styles from './DataTableHeaders.module.scss';

interface IProps {
  tableId?: string;
  headers: IDataTableHeader[] | undefined;
  onSort?: (field: string, direction: SortDirection) => undefined;
  dragEnabled?: boolean;
  sortEnabled?: boolean;
  collapse?: boolean;
}

const DataTableHeaders = ({ tableId, headers, dragEnabled, sortEnabled, collapse }: IProps) => {
  return (
    <div className={styles.headers}>
      <Grid container spacing={1}>
        {headers?.map((header: any, index: number) => {
            if((header.onlyOnNoDrag && !dragEnabled) || !header.onlyOnNoDrag)
              return (
                <DataTableHeader key={index}
                                 tableId={tableId}
                                 header={header}
                                 sortEnabled={sortEnabled}
                                 collapse={collapse}/>
              )
            else return null;
        })}
      </Grid>
    </div>
  )
}

export default DataTableHeaders;

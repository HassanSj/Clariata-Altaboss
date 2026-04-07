import React, {ReactElement} from 'react';
import {Grid, List} from '@material-ui/core';
import styles from './ListedData.module.scss';
import {Pagination} from "@material-ui/lab";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import {get} from 'lodash';
import {IDataItemEventConfig} from "~/types/data";
import Button from "@material-ui/core/Button";

interface IProps {
  paginator: any;
  component: any;
  keyLabel: string;
  propLabel: string;
  data?: any[];
  views?: any;
  eventConfig?: IDataItemEventConfig;
  isDragging?: boolean;
  hideShowAll?:boolean;
  componentProps?:{[key:string]:any}
}

const ListedData = ({ component,hideShowAll,componentProps, data, keyLabel, propLabel, views, paginator, eventConfig, isDragging }: IProps): ReactElement => {
  const dataToMap = data ? data : (paginator?.hasData() ? paginator?.currentData() : undefined)

  return (
    <>
      <List className={styles.list}>
        {dataToMap ? dataToMap?.map((item: any, index: number) => {
          return (
            React.createElement(
              component,
              {
                index,
                key: `${get(item, keyLabel)}-${index}`,
                [propLabel]: item,
                views,
                eventConfig,
                dragEnabled: isDragging,
                ...componentProps
              },
            )
          )
        }) : <EmptyContainer text='No data found.' /> }
      </List>
      { paginator ?
        <>
          <Grid container>
            <Grid item xs={8}>
              { !paginator?.showAll ?
                <Pagination
                  showFirstButton
                  showLastButton
                  variant="outlined"
                  count={paginator.count()}
                  page={paginator.pageIndex()}
                  onChange={(e, p) => paginator.jump(p)} />
              : null }
            </Grid>
            {!hideShowAll &&
            <Grid container item xs={4} justifyContent="flex-end">
              <Button color={paginator?.showAll ? 'primary' : 'default'}
                      variant={paginator?.showAll ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => paginator.toggleShowAll()}>
                {paginator?.showAll ? 'Show Less' : 'Show All'}
              </Button>
            </Grid>
            }
          </Grid>
        </>
        : null }
    </>
  )
};

export default ListedData;

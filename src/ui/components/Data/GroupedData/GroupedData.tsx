import React, {ReactElement} from 'react';
import classnames from 'classnames';
import {Accordion, AccordionDetails, AccordionSummary, Chip, Grid, List, Typography} from '@material-ui/core';
import styles from './GroupedData.module.scss';
import Icon from "@material-ui/core/Icon";
import {Pagination} from "@material-ui/lab";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import Button from "@material-ui/core/Button";

interface IProps {
  paginator: any;
  component: any;
  propLabel: string;
    keyLabel?: string;
  views?: any;
}

const GroupedData = ({ component, keyLabel, propLabel, views, paginator }: IProps): ReactElement => (
  <>
    <div className={classnames(styles.groups)}>
      {paginator.hasData() ? paginator.currentData().map((group: any, index: number) => {
        return (
          <>
            <Accordion className={classnames(styles.group)}
                       key={(index + 1) * (paginator?.pageIndex() + 1)}
                       defaultExpanded={index === 0}>
              <AccordionSummary
                className={styles.group_header}
                expandIcon={<Icon>expand_more</Icon>}
                aria-controls={`group-${index}-content`}
                id={`group-${index}-header`}
                key={index}>
                <Typography className={styles.group_label}>{group?.label}</Typography>
                <Chip className={classnames(styles.item_badge)}
                      label={group?.items ? group?.items.length : 0}
                      size="small" />
              </AccordionSummary>
              <AccordionDetails >
                <List className={classnames(styles.list)}>
                  {group?.items ? group?.items.map((item: any, iindex: number) => {
                    return (
                      React.createElement(
                        component,
                        {
                          key: (index * iindex * paginator?.pageIndex()),
                          [propLabel]: item,
                          views
                        },
                      )
                    )
                  }) : <EmptyContainer text='No group items found.' /> }
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        )
      }) : null }
    </div>
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
          <Grid container item xs={4} justifyContent="flex-end">
            <Button color={paginator?.showAll ? 'primary' : 'default'}
                    variant={paginator?.showAll ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => paginator.toggleShowAll()}>
              Show All
            </Button>
          </Grid>
        </Grid>
      </>
      : null }
  </>
);

export default GroupedData;

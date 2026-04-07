import React, {ReactElement} from 'react';
import {Card, Grid} from '@material-ui/core';
import styles from './CardCentered.module.scss';

interface IProps {
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | boolean | 'auto';
  children: React.ReactNode;
}

const CardCentered = ({ width = 6, children }: IProps): ReactElement => (
  <div>
    <Grid container justifyContent="center" alignItems="center" spacing={1}>
      <Grid item xs={width}>
        <Card className={styles.card_container}>
            {children}
        </Card>
      </Grid>
    </Grid>
  </div>
);

export default CardCentered;

import React, {ReactElement} from 'react';
import {Backdrop, CircularProgress} from "@material-ui/core";
import classnames from 'classnames';
import styles from './Loader.module.scss';

interface IProps {
  message?: string;
}

const Loader = ({ message }: IProps): ReactElement => {
  return (
    <>
      <Backdrop className={classnames(styles.loader)} open={true}>
        <CircularProgress />
      </Backdrop>
    </>
  )
}

export default Loader;

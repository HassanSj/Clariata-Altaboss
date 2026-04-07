import React from 'react';
import styles from './FixedFooterToolbar.module.scss';

interface IProps {
  children: any;
}

const FixedFooterToolbar = ({ children }: IProps) => {
  return (
    <div className={styles.fixed_toolbar}>
      {children}
    </div>
  )
}

export default FixedFooterToolbar;

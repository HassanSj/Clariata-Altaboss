import React, {ReactElement} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import classnames from 'classnames';

import styles from './Link.module.scss';

interface IProps {
  children: React.ReactNode;
  className?: string;
  to: string;
}

const Link = ({ children, className, to }: IProps): ReactElement => (
  <RouterLink to={to} className={classnames(styles.link, className)}>
    {children}
  </RouterLink>
);

export default Link;

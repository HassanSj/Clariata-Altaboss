import React, {ReactElement} from 'react';
import classnames from 'classnames';

import styles from './Content.module.scss';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Content = ({ children, className }: IProps): ReactElement => (
  <div className={classnames(styles.contentLayout, className)}>{children}</div>
);

export default Content;

import React, {ReactElement} from 'react';
import styles from './EmptyContainer.module.scss';
import classnames from "classnames";

interface IProps {
  text: string;
}

const EmptyContainer = ({ text }: IProps): ReactElement => {

  return (
    <div className={classnames(styles.container)}>
      {text}
    </div>
  );
};

export default EmptyContainer;

import React, {ReactElement} from 'react';
import styles from './CardCenteredHeader.module.scss';

interface IProps {
  children: React.ReactNode;
}

const CardCenteredHeader = ({ children }: IProps): ReactElement => <div className={styles.card_header}>{children}</div>;

export default CardCenteredHeader;

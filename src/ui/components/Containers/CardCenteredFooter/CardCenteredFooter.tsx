import React, {ReactElement} from 'react';
import styles from './CardCenteredFooter.module.scss';

interface IProps {
  children: React.ReactNode;
}

const CardCenteredFooter = ({ children }: IProps): ReactElement => <div className={styles.card_footer}>{children}</div>;

export default CardCenteredFooter;

import React, {ReactElement} from 'react';

import styles from './ServerError.module.scss';

interface IProps {
  error: string;
}

const ServerError = ({ error }: IProps): ReactElement => <>{error && <p className={styles.error}>{error}</p>}</>;

export default ServerError;

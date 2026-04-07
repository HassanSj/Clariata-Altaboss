import React, {ReactElement} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Container} from '@material-ui/core';
import classnames from 'classnames';
import styles from './PDFLayout.module.scss';
import useMountEvents from "~/ui/hooks/useMountEvents";
import {useStoreState} from "~/store/hooks";
import {setupLogging} from "~/ui/constants/utils";

interface IProps {
  children: React.ReactNode;
}

const PDFLayout = ({ children }: IProps): ReactElement => {
  const { user } = useStoreState(state => state.user);

  useMountEvents({
    onMounted: async () => {
      // Setup logging
      setupLogging(user);
    }
  });

  return (
    <div className={classnames(styles.root)}>
      <CssBaseline />
      <main className={classnames(styles.content)}>
        <div className={classnames(styles.content_container)}>
          <Container maxWidth={false}>
            <div>{children}</div>
          </Container>
        </div>
      </main>
    </div>
  );
};

export default PDFLayout;

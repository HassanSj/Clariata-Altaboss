import { Button, Icon, Grid } from '@material-ui/core';
import Widget from '~/ui/components/Widgets/Widget';
import React from 'react';
import paths from '~/ui/constants/paths';
import styles from './../Widgets.module.scss';
import classnames from 'classnames';
import Link from 'next/dist/client/link';

const ResourcesWidget = () => {
  return (
    <Widget title="Resources">
      <span className={classnames(styles.cl_violet, styles.cl_icon, styles.cl_icon_discover)} />
      <span className={styles.cl_box_title}>Checklist/Resources</span>
      <div className={styles.module_widgets}>
        <span>
          <Grid container>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'General' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      General
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Contacts' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Contacts
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Discover' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Discover
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Dream' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Dream
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Direction' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Direction
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={5}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Deepen' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Deepen
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Link
                href={{
                  pathname: paths.MODULE_RESOURCES,
                  query: { module: 'Destiny' },
                }}
                passHref
              >
                <a rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
                  <div className={styles.footer_actions}>
                    <Button
                      fullWidth={true}
                      color="primary"
                      variant="outlined"
                      size="large"
                      className={styles.module_button}
                    >
                      Destiny
                      <Icon>arrow_forward</Icon>
                    </Button>
                  </div>
                </a>
              </Link>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </span>
      </div>
    </Widget>
  );
};

export default ResourcesWidget;

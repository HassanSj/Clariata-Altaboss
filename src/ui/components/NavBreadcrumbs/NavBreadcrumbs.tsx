import React, {ReactElement, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import {Breadcrumbs, Grid} from "@material-ui/core";
import {useRouter} from "next/router";
import styles from './NavBreadcrumbs.module.scss';
import classnames from 'classnames';
import {useStoreState} from "~/store/hooks";
import paths from "~/ui/constants/paths";

interface Breadcrumb {
  breadcrumb: string;
  href: string;
}

const convertBreadcrumb = (str: string) => {
  const result = str
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü')
    .toUpperCase();

  return result.split('?')[0]
};

const {DASHBOARD} = paths;

const NavBreadcrumbs = (): ReactElement => {
  const router = useRouter();
  const [isDashboard, setIsDashboard] = React.useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);
  const {selectedHousehold} = useStoreState((state) => state.household);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray: Breadcrumb[] = linkPath.map((path, i) => {
        return {breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/')};
      });

      if (pathArray) {
        setBreadcrumbs(pathArray);
      }

      setIsDashboard(Boolean(router.asPath.includes('dashboard')));
    }
  }, [router]);

  return (
    <>
            <span className={styles.container}>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Breadcrumbs aria-label="breadcrumb">
                            {breadcrumbs.map((breadcrumb: any, index: number) => {
                              return (
                                <Link key={index}
                                      className={classnames(styles.breadcrumb)}
                                      color="inherit"
                                      href={breadcrumb.href}>
                                  {convertBreadcrumb(breadcrumb.breadcrumb)}
                                </Link>
                              );
                            })}
                          </Breadcrumbs>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classnames(styles.breadcrumbs)}>

                        </div>
                    </Grid>
                </Grid>
            </span>
    </>
  );
};
export default NavBreadcrumbs;
